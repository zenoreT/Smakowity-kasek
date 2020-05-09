package pl.SmakowityKasek.utils.requests;

import java.util.Set;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import lombok.Data;
import pl.SmakowityKasek.models.Address;
import pl.SmakowityKasek.entities.OrderItem;

@Data
public class OrderRequest {
  @NotEmpty
  private Set<OrderItem> orderItems;
  
  @NotBlank
  private Address address;
  
  @NotBlank
  private String phoneNumber;
}
