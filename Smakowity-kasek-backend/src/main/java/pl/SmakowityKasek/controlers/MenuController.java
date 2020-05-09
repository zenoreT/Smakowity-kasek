package pl.SmakowityKasek.controlers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import pl.SmakowityKasek.entities.Ingredient;
import pl.SmakowityKasek.entities.Meal;
import pl.SmakowityKasek.models.Category;
import pl.SmakowityKasek.repositories.IngredientRepository;
import pl.SmakowityKasek.repositories.MealRepository;
import pl.SmakowityKasek.utils.requests.SearchItemsRequest;
import pl.SmakowityKasek.utils.requests.SearchRequest;
import pl.SmakowityKasek.utils.requests.TableRequest;
import pl.SmakowityKasek.utils.responses.CommonResponse;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
  
  private final String MEAL_DELETED_SUCCESS = "Posiłek usunięto pomyślnie!";
  private final String IMAGE_DELETED_SUCCESS = "Zdjęcie usunięto pomyślnie!";
  
  @Value("${app.upload-dir}")
  private String uploadDir;
  private final MealRepository mealRepository;
  private final IngredientRepository ingredientRepository;
  
  @Autowired
  public MenuController(MealRepository mealRepository, IngredientRepository ingredientRepository) {
    this.mealRepository = mealRepository;
    this.ingredientRepository = ingredientRepository;
  }
  
  @PreAuthorize("hasAuthority('ADMIN')")
  @PostMapping("/ingredient/list")
  public ResponseEntity<?> getIngredientList(@RequestBody TableRequest tableRequest) {
    PageRequest pageRequest = tableRequest.toPageRequest();
    List<Ingredient> igredients = ingredientRepository.findAll(pageRequest).getContent();
    return ResponseEntity.ok(Map.of("ingredients", igredients, "count", igredients.size()));
  }
  
  @PostMapping("/ingredient/new")
  public ResponseEntity<?> addIngredient(@RequestBody Ingredient ingredient) {
    ingredientRepository.save(ingredient);
    Ingredient freshIngredient = ingredientRepository.findById(ingredient.getId()).get();
    
    return ResponseEntity.ok(freshIngredient);
  }
  
  @PostMapping(value = "/ingredient/search")
  public ResponseEntity<?> searchIngredients(@RequestBody SearchItemsRequest searchItemsRequest) {
    return ResponseEntity
        .ok(ingredientRepository.findFirst5ByNameIgnoreCaseContainingAndIdNotIn(searchItemsRequest.getSearchText(), searchItemsRequest.getIds()));
  }
  
  @PreAuthorize("hasAuthority('ADMIN')")
  @PostMapping("/meal/list")
  public ResponseEntity<?> getMealsList(@RequestBody TableRequest tableRequest) {
    PageRequest pageRequest = tableRequest.toPageRequest();
    List<Meal> meals = mealRepository.findAll(pageRequest).getContent();
    return ResponseEntity.ok(Map.of("meals", meals, "count", meals.size()));
  }
  
  @PostMapping("/meal/new")
  public ResponseEntity<?> addMeal(@RequestBody Meal meal) {
    mealRepository.save(meal);
    Meal freshMeal = mealRepository.findById(meal.getId()).get();
    
    return ResponseEntity.ok(freshMeal);
  }
  
  @DeleteMapping("/meal/delete")
  public ResponseEntity<?> deleteMeal(@RequestBody Meal meal) {
    if (meal.getCategory() != Category.MEAL_SETS) {
      mealRepository.deleteAll(mealRepository.findAllByMealsContaining(meal));
    }
    mealRepository.delete(meal);
    
    return ResponseEntity.ok(new CommonResponse(this.MEAL_DELETED_SUCCESS));
  }
  
  @PostMapping(value = "/meal/search")
  public ResponseEntity<?> searchMeals(@RequestBody SearchItemsRequest searchItemsRequest) {
    return ResponseEntity
        .ok(mealRepository
            .findFirst5ByNameIgnoreCaseContainingAndIdNotInAndCategoryNotIn(searchItemsRequest.getSearchText(), searchItemsRequest.getIds(),
                List.of(Category.MEAL_SETS)));
  }
  
  @GetMapping(value = "/meal/get/all")
  public @ResponseBody ResponseEntity<?> getAllMeals() throws IOException {
    return ResponseEntity.ok(mealRepository.findAll(Sort.by("id")));
  }
  
  @PostMapping(value = "/meal/get")
  public @ResponseBody ResponseEntity<?> getMealsByName(@RequestBody SearchRequest searchText) throws IOException {
    return ResponseEntity.ok(mealRepository.findAllByNameIgnoreCaseContaining(searchText.getSearchText()));
  }
  
  @PostMapping("/images/new")
  public ResponseEntity<?> uploadImage(@RequestParam MultipartFile uploadFile, @RequestParam String imageName) throws IOException {
    if (uploadFile.getOriginalFilename() == null) {
      return ResponseEntity.badRequest().build();
    }
    
    File file = createFile(imageName + uploadFile.getOriginalFilename().substring(uploadFile.getOriginalFilename().length() - 4));
    
    if (file.exists()) {
      return ResponseEntity.badRequest().build();
    }
    
    FileUtils.writeByteArrayToFile(file, uploadFile.getInputStream().readAllBytes());
    return ResponseEntity.ok().build();
  }
  
  @DeleteMapping(value = "/images/delete", params =
    { "imageName" })
  public ResponseEntity<?> deleteImage(@RequestParam String imageName) throws IOException {
    File file = createFile(imageName);
    Files.deleteIfExists(file.toPath());
    
    return ResponseEntity.ok(new CommonResponse(this.IMAGE_DELETED_SUCCESS));
  }
  
  @GetMapping(value = "/images/get", params =
    { "imageName" })
  public @ResponseBody ResponseEntity<?> getImage(@RequestParam String imageName) throws IOException {
    Path path = createFile(imageName).toPath();
    
    return ResponseEntity
        .ok().contentLength(Files.size(path)).contentType(MediaType.valueOf(Files.probeContentType(path)))
        .body(new InputStreamResource(Files.newInputStream(path)));
  }
  
  private File createFile(String fileName) {
    return new File("src/main/resources" + uploadDir + fileName);
  }
}
