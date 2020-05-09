package pl.SmakowityKasek.models;

public enum OrderStatus {
  ACCEPTED("Przyjęte do realizacji"),
  PREPARED("Przygotowane"),
  PACKING("Pakowane"),
  PACKAGED("Spakowane"),
  FORWARDED_TO_DELIVERY("Przekazane do dostarczenia"),
  ON_THE_WAY("W drodze"),
  RECEIVED("Dostarczone"),
  FINISHED("Zakończone");
  
  private String value;
  
  private OrderStatus(String value) {
    this.value = value;
  }
  
  public static OrderStatus fromValue(String value) {
    for (OrderStatus orderStatus : OrderStatus.values()) {
      if (orderStatus.value.equalsIgnoreCase(value)) {
        return orderStatus;
      }
    }
    throw new IllegalArgumentException("No constant with value " + value + " found");
  }
  
  public static OrderStatus fromName(String name) {
    for (OrderStatus orderStatus : OrderStatus.values()) {
      if (orderStatus.name().equalsIgnoreCase(name)) {
        return orderStatus;
      }
    }
    throw new IllegalArgumentException("No constant with name " + name + " found");
  }
}
