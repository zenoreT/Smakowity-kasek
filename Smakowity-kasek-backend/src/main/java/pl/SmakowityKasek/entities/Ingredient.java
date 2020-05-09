package pl.SmakowityKasek.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Data;
import lombok.EqualsAndHashCode;
import pl.SmakowityKasek.utils.DateAudit;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "ingredients")
@Data
public class Ingredient extends DateAudit {
  
  private static final long serialVersionUID = -763966553682859938L;
  
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ingredients_id_seq")
  @SequenceGenerator(name = "ingredients_id_seq", sequenceName = "ingredients_id_seq", allocationSize = 1)
  private Long id;
  
  @NotBlank
  @Size(min = 2, max = 40)
  @Column(nullable = false)
  private String name;
  
  @NotBlank
  @Size(min = 2, max = 100)
  @Column(nullable = false)
  private String imageName;
  
  // @NotNull
  // @Min(0)
  // @Column(nullable = false)
  // private Integer quantity;
  
  // @NotNull
  // @Min(0)
  // @Column(nullable = false)
  // private Float price;
  
  // @ManyToMany(fetch = FetchType.LAZY, mappedBy = "ingredients")
  // private Set<Dish> dishes = new HashSet<>();
}
