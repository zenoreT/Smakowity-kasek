package pl.SmakowityKasek.utils.requests;

import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;
import pl.SmakowityKasek.models.Address;
import pl.SmakowityKasek.models.RoleName;

@Data
public class RegisterRequest {
  @NotBlank
  @Size(min = 5, max = 15)
  private String username;
  
  @NotBlank
  @Size(max = 40)
  @Email
  private String email;
  
  @NotBlank
  @Size(min = 8, max = 20)
  private String password;
  
  @NotNull
  private Address address;
  
  private Set<RoleName> roles;
}
