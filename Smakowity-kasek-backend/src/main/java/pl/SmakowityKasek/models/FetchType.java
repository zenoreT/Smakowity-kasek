package pl.SmakowityKasek.models;

public enum FetchType {
  ALL_VALUES("ALL_VALUES"),
  ONLY_USERS("ONLY_USERS");
  
  private String value;
  
  private FetchType(String value) {
    this.value = value;
  }
  
  public static FetchType fromValue(String value) {
    for (FetchType fetchType : FetchType.values()) {
      if (fetchType.value.equalsIgnoreCase(value)) {
        return fetchType;
      }
    }
    throw new IllegalArgumentException("No constant with value " + value + " found");
  }
  
  public static FetchType fromName(String name) {
    for (FetchType fetchType : FetchType.values()) {
      if (fetchType.name().equalsIgnoreCase(name)) {
        return fetchType;
      }
    }
    throw new IllegalArgumentException("No constant with name " + name + " found");
  }
}
