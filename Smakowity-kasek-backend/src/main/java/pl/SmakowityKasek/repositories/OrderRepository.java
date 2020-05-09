package pl.SmakowityKasek.repositories;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.SmakowityKasek.entities.Order;
import pl.SmakowityKasek.models.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {
  Page<Order> findAllByUserUsername(String username, Pageable pageable);
  
  Page<Order> findAllByUserUsernameAndOrderStatusIn(String username, List<OrderStatus> orderStatuses, Pageable pageable);
  
  Page<Order> findAllByOrderStatusIn(List<OrderStatus> orderStatuses, Pageable pageable);
}
