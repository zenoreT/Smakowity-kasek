package pl.SmakowityKasek.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;

import pl.SmakowityKasek.models.RoleName;

public class FunctionUtils {
  public static Set<RoleName> grantedAuthoritiesRoles(Collection<? extends GrantedAuthority> grantedAuthorities) {
    Set<RoleName> roles = new HashSet<>();
    grantedAuthorities.forEach(grantedAuthority -> roles.add(RoleName.fromName(grantedAuthority.getAuthority())));
    return roles;
  }
  
  public static <T extends Enum<T>> List<String> getFiltersForEnum(Map<String, List<String>> filters, Class<T> enumType) {
    return filters
        .entrySet().stream().filter(e -> enumType.getSimpleName().equals(capitalizeString(e.getKey()))).map(Map.Entry::getValue).findFirst()
        .orElse(new ArrayList<>());
  }
  
  public static <T extends Enum<T>> List<T> getEnumFromFilters(Map<String, List<String>> filters, Class<T> enumType) {
    List<T> enums = new ArrayList<>();
    List<String> resolvedFilters = getFiltersForEnum(filters, enumType);
    
    if (resolvedFilters.isEmpty()) {
      enums.addAll(Arrays.asList(enumType.getEnumConstants()));
      return enums;
    }
    
    resolvedFilters.forEach(e -> {
      try {
        enums.add(Enum.valueOf(enumType, e));
      } catch (IllegalArgumentException ex) {
        throw new RuntimeException(ex);
      }
    });
    return enums;
  }
  
  public static String capitalizeString(String string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  }
}
