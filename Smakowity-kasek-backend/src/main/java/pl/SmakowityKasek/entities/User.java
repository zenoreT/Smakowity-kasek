package pl.SmakowityKasek.entities;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.NoArgsConstructor;
import pl.SmakowityKasek.models.Address;

@Entity
@Table(name = "users")
@JsonIgnoreProperties(value =
  { "createdAt", "updatedAt" }, allowGetters = true)
@NoArgsConstructor
public class User implements Serializable {
  
  private static final long serialVersionUID = -5688857929808131334L;
  
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_id_seq")
  @SequenceGenerator(name = "users_id_seq", sequenceName = "users_id_seq", allocationSize = 1)
  private Long id;
  
  @NotBlank
  @Size(min = 5, max = 15)
  @Column(nullable = false)
  private String username;
  
  @NotBlank
  @Size(max = 40)
  @Email
  @Column(nullable = false)
  private String email;
  
  @JsonIgnore
  @NotBlank
  @Size(min = 8, max = 60)
  @Column(nullable = false)
  private String password;
  
  @NotNull
  @Column(nullable = false)
  private Address address;
  
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();
  
  @JsonIgnore
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private Set<Order> orders = new HashSet<>();
  
  public User(String username, String email, String password, Address address, Set<Role> roles) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.address = address;
    this.roles = roles;
  }
  
  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }
  
  public String getUsername() {
    return username;
  }
  
  public void setUsername(String username) {
    this.username = username;
  }
  
  public String getEmail() {
    return email;
  }
  
  public void setEmail(String email) {
    this.email = email;
  }
  
  public String getPassword() {
    return password;
  }
  
  public void setPassword(String password) {
    this.password = password;
  }
  
  public Address getAddress() {
    return address;
  }
  
  public void setAddress(Address address) {
    this.address = address;
  }
  
  public Set<Role> getRoles() {
    return roles;
  }
  
  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }
  
  public Set<Order> getOrders() {
    return orders;
  }
  
  public void setOrders(Set<Order> orders) {
    this.orders = orders;
  }
}
