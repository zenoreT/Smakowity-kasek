package pl.SmakowityKasek.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.Min;

import com.sun.istack.NotNull;

import lombok.Data;
import lombok.EqualsAndHashCode;
import pl.SmakowityKasek.utils.DateAudit;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "order_items")
@Data
public class OrderItem extends DateAudit {
  
  private static final long serialVersionUID = 8624201804141738288L;
  
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_items_id_seq")
  @SequenceGenerator(name = "order_items_id_seq", sequenceName = "order_items_id_seq", allocationSize = 1)
  private Long id;
  
  @NotNull
  @OneToOne(fetch = FetchType.EAGER)
  private Meal item;
  
  @NotNull
  @Min(0)
  @Column(nullable = false)
  private Integer quantity;
}
