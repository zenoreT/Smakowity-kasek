package pl.SmakowityKasek.utils.responses;

import lombok.Data;
import org.springframework.validation.BindingResult;

@Data
public class CommonResponse {
  private String title;
  private String description;

  public CommonResponse(String title, String description) {
    this.title = title;
    this.description = description;
  }

  public CommonResponse(String title) {
    this.title = title;
    this.description = "";
  }

  public CommonResponse(String title, BindingResult bindingResult) {
    this.title = title;
    this.description = "";
    bindingResult.getFieldErrors().forEach(error -> description += error.getField() + ": " + error.getDefaultMessage() + ", \n");
  }
}
