package pl.SmakowityKasek.utils.responses;

import lombok.Data;
import pl.SmakowityKasek.models.RoleName;

import java.util.Set;

@Data
public class AuthenticationResponse {
  private String username;
  private Set<RoleName> roles;
  private String accessToken;
  private String tokenType = "Bearer";

  public AuthenticationResponse(String username, Set<RoleName> roles, String accessToken) {
    this.username = username;
    this.roles = roles;
    this.accessToken = accessToken;
  }
}
