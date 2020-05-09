package pl.SmakowityKasek.controlers;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.SmakowityKasek.entities.Order;
import pl.SmakowityKasek.entities.OrderItem;
import pl.SmakowityKasek.entities.User;
import pl.SmakowityKasek.models.FetchType;
import pl.SmakowityKasek.models.OrderStatus;
import pl.SmakowityKasek.repositories.OrderRepository;
import pl.SmakowityKasek.repositories.UserRepository;
import pl.SmakowityKasek.utils.FunctionUtils;
import pl.SmakowityKasek.utils.exceptionHandling.CommonException;
import pl.SmakowityKasek.utils.requests.TableRequest;
import pl.SmakowityKasek.utils.responses.CommonResponse;

@RestController
@RequestMapping("/api/order")
public class OrderController {
  
  private final String ORDER_SUCCESS = "Zamówienie przesłano pomyślnie!";
  private final String ORDER_ERROR = "Nieudało się przesłać zamówienia!";
  private final String ORDER_HISTORY_ERROR = "Nie udało się pobrać historii dla podanego użytkownika!";
  
  private final OrderRepository orderRepository;
  private final UserRepository userRepository;
  
  @Autowired
  private SimpMessagingTemplate messagingTemplate;
  
  @Autowired
  public OrderController(OrderRepository orderRepository, UserRepository userRepository) {
    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
  }
  
  @PostMapping("/new")
  public ResponseEntity<?> addOrder(@RequestBody Order order, Principal principal) {
    if (principal != null) {
      if (order.getId() == null) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new CommonException("User not found"));
        order.setUser(user);
        Double totalPrice = 0D;
        
        for (OrderItem orderItem : order.getOrderItems()) {
          totalPrice += (orderItem.getItem().getPrice() * orderItem.getQuantity());
        }
        
        order.setTotalPrice(totalPrice);
        order.setOrderStatus(OrderStatus.ACCEPTED);
        order.setAddress(order.getAddress() != null ? order.getAddress() : user.getAddress());
        
      } else {
        Order previousOrder = orderRepository.findById(order.getId()).orElseThrow(() -> new CommonException("Wystąpił błąd podczas zatwierdzania zamówienia"));
        order.setUser(previousOrder.getUser());
      }

      Order newOrder = orderRepository.save(order);
      newOrder.setOwnerUserName(order.getUser().getUsername());
      
      messagingTemplate.convertAndSend("/socket/order/history", newOrder);
      
      return ResponseEntity.ok(new CommonResponse(this.ORDER_SUCCESS));
    }
    
    return ResponseEntity.badRequest().body(new CommonResponse(this.ORDER_ERROR));
  }
  
  @PostMapping("/history")
  public ResponseEntity<?> getOrdersHistory(@RequestBody TableRequest tableRequest, Principal principal) throws JsonProcessingException {
    if (principal != null) {
      PageRequest pageRequest = tableRequest.toPageRequest();
      List<OrderStatus> orderStatuses = FunctionUtils.getEnumFromFilters(tableRequest.getFilters(), OrderStatus.class);
      // assume there is only one fetch type -> take first found
      FetchType fetchType = FunctionUtils.getEnumFromFilters(tableRequest.getFilters(), FetchType.class).get(0);
      
      List<Order> orders = new ArrayList<>();
      
      if (fetchType == FetchType.ONLY_USERS) {
        orders = orderRepository.findAllByUserUsernameAndOrderStatusIn(principal.getName(), orderStatuses, pageRequest).getContent();
      } else if (fetchType == FetchType.ALL_VALUES) {
        orders = orderRepository.findAllByOrderStatusIn(orderStatuses, pageRequest).getContent();
      }
      
      // page has to be substracted by one because frontend starts sending pages at 1
      return ResponseEntity.ok(Map.of("orders", orders, "count", orders.size()));
    }
    
    return ResponseEntity.badRequest().body(new CommonResponse(this.ORDER_HISTORY_ERROR));
  }
}
