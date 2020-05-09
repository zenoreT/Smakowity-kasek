package pl.SmakowityKasek.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.SmakowityKasek.entities.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
  
}