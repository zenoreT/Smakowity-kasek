package pl.SmakowityKasek.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import lombok.Data;
import lombok.EqualsAndHashCode;
import pl.SmakowityKasek.models.Category;
import pl.SmakowityKasek.utils.DateAudit;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "meals")
@Data
public class Meal extends DateAudit {
  
  private static final long serialVersionUID = 5530144589438219134L;
  
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "meals_id_seq")
  @SequenceGenerator(name = "meals_id_seq", sequenceName = "meals_id_seq", allocationSize = 1)
  private Long id;
  
  @NotBlank
  @Size(min = 2, max = 40)
  @Column(nullable = false)
  private String name;
  
  @NotBlank
  @Size(min = 2, max = 200)
  @Column(nullable = false)
  private String description;
  
  @NotBlank
  @Size(min = 2, max = 100)
  @Column(nullable = false)
  private String imageName;
  
  @NotNull
  @Min(0)
  @Column(nullable = false)
  private Float price;
  
  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Category category;
  
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "meals_ingredients", joinColumns = @JoinColumn(name = "meal_id"), inverseJoinColumns = @JoinColumn(name = "ingredient_id"))
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Set<Ingredient> ingredients = new HashSet<>();
  
  // @ManyToMany(fetch = FetchType.LAZY)
  // @JoinTable(name = "meals_additional_ingredients", joinColumns =
  // @JoinColumn(name = "meal_id"), inverseJoinColumns = @JoinColumn(name =
  // "ingredient_id"))
  // @OnDelete(action = OnDeleteAction.CASCADE)
  // private Set<Ingredient> additionalIngredients = new HashSet<>();
  
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "mealsets_meals", joinColumns = @JoinColumn(name = "parent_id"), inverseJoinColumns = @JoinColumn(name = "meal_id"))
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Set<Meal> meals = new HashSet<>();
}
