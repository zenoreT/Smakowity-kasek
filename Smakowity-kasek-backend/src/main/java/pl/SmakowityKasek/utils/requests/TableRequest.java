package pl.SmakowityKasek.utils.requests;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import lombok.Setter;

@Setter
public class TableRequest {
  
  private final static String DEFAULT_SORTING_FIELD = "updatedAt";
  
  private Integer results;
  private Integer page;
  private String sortField;
  private String sortOrder;
  private Map<String, List<String>> filters;
  
  public PageRequest toPageRequest(String defaultField) {
    return PageRequest.of(this.getPage() - 1, this.getResults(), Sort.by(Direction.fromString(this.getSortOrder()), this.getSortField(defaultField)));
  }
  
  public PageRequest toPageRequest() {
    return this.toPageRequest(DEFAULT_SORTING_FIELD);
  }
  
  public PageRequest toPageRequestNoSorting() {
    return PageRequest.of(this.getPage() - 1, this.getResults());
  }
  
  public Integer getResults() {
    return results != null ? results : 10;
  }
  
  public Integer getPage() {
    return page != null ? page : 0;
  }
  
  public String getSortField(String defaultField) {
    return sortField != null ? sortField : defaultField;
  }
  
  public String getSortField() {
    return this.getSortField(DEFAULT_SORTING_FIELD);
  }
  
  public String getSortOrder() {
    return sortOrder != null ? (sortOrder.contains("asc") ? "asc" : "desc") : "desc";
  }
  
  public Map<String, List<String>> getFilters() {
    return filters != null ? filters : new HashMap<>();
  }
}
