package pl.SmakowityKasek.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.SmakowityKasek.entities.Meal;
import pl.SmakowityKasek.models.Category;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
  List<Meal> findFirst5ByNameIgnoreCaseContainingAndIdNotInAndCategoryNotIn(String name, List<Long> ids, List<Category> categories);
  
  List<Meal> findAllByNameIgnoreCaseContaining(String name);
  
  List<Meal> findAllByMealsContaining(Meal meal);
}
