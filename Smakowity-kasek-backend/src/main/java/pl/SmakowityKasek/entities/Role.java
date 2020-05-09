package pl.SmakowityKasek.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.NaturalId;

import lombok.Data;
import lombok.NoArgsConstructor;
import pl.SmakowityKasek.models.RoleName;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
public class Role implements Serializable {
  
  private static final long serialVersionUID = 9030624751157498275L;
  
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "roles_id_seq")
  @SequenceGenerator(name = "roles_id_seq", sequenceName = "roles_id_seq", allocationSize = 1)
  private Long id;
  
  @NotNull
  @Enumerated(EnumType.STRING)
  @NaturalId
  @Column(nullable = false)
  private RoleName name;
  
  public Role(RoleName name) {
    this.name = name;
  }
  
  public Role(String name) {
    this.name = RoleName.fromValue(name);
  }
}
