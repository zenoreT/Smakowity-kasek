package pl.SmakowityKasek.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.SmakowityKasek.entities.Ingredient;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
  List<Ingredient> findFirst5ByNameIgnoreCaseContainingAndIdNotIn(String name, List<Long> ids);
}
