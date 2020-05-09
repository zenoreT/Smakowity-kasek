package pl.SmakowityKasek.utils.requests;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import lombok.Data;

@Data
public class SearchItemsRequest {
  @NotBlank
  private String searchText;
  
  @NotEmpty
  private List<Long> ids;
}