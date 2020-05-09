package pl.SmakowityKasek.models;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Embeddable
@Data
public class Address {
  @NotBlank
  private String city;
  @NotBlank
  private String postCode;
  @NotBlank
  private String street;
}
