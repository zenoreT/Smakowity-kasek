package pl.SmakowityKasek.models;

public enum Category {
    MEAL_SETS("Zestawy"),
    BURGERS("Burgery"),
    WRAPS("Wrapy/Tortille"),
    SANDWICHES("Kanapki"),
    SOUPS("Zupy"),
    KIDS("Dla dzieci"),
    FRIES("Frytki"),
    SALADS("Sałatki"),
    HOT_DRINKS("Ciepłe napoje"),
    COLD_DRINKS("Zimne napoje"),
    DESSERTS("Desery");
    
    private String value;
    
    private Category(String value) {
        this.value = value;
    }
    
    public static Category fromValue(String value) {
        for (Category category : Category.values()) {
            if (category.value.equalsIgnoreCase(value)) {
                return category;
            }
        }
        throw new IllegalArgumentException("No constant with value " + value + " found");
    }
    
    public static Category fromName(String name) {
        for (Category category : Category.values()) {
            if (category.name().equalsIgnoreCase(name)) {
                return category;
            }
        }
        throw new IllegalArgumentException("No constant with name " + name + " found");
    }
}
