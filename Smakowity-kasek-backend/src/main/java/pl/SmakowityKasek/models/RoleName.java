package pl.SmakowityKasek.models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RoleName {
  USER("Użytkownik"),
  ADMIN("Admin"),
  COOK("Kucharz"),
  PACKAGER("Pakujący"),
  DRIVER("Kierowca");
  
  @JsonValue
  private String value;
  
  private RoleName(String value) {
    this.value = value;
  }
  
  public static RoleName fromValue(String value) {
    for (RoleName roleName : RoleName.values()) {
      if (roleName.value.equalsIgnoreCase(value)) {
        return roleName;
      }
    }
    throw new IllegalArgumentException("No constant with value " + value + " found");
  }
  
  public static RoleName fromName(String name) {
    for (RoleName roleName : RoleName.values()) {
      if (roleName.name().equalsIgnoreCase(name)) {
        return roleName;
      }
    }
    throw new IllegalArgumentException("No constant with name " + name + " found");
  }
}
