package pl.SmakowityKasek.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import pl.SmakowityKasek.models.Address;
import pl.SmakowityKasek.models.OrderStatus;
import pl.SmakowityKasek.utils.DateAudit;

@Entity
@Table(name = "orders")
public class Order extends DateAudit {
  
  private static final long serialVersionUID = 6134694221769481177L;
  
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "orders_id_seq")
  @SequenceGenerator(name = "orders_id_seq", sequenceName = "orders_id_seq", allocationSize = 1)
  private Long id;
  
  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private OrderStatus orderStatus;
  
  @JsonIgnore
  @NotNull
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
  
  @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "order_id", nullable = false)
  private Set<OrderItem> orderItems = new HashSet<>();
  
  @Column(nullable = false)
  private Double totalPrice;
  
  @NotNull
  @Column(nullable = false)
  private Address address;
  
  @NotBlank
  @Size(min = 9, max = 9)
  @Column(nullable = false)
  private String phoneNumber;

  @Transient
  private String ownerUserName;
  
  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }
  
  public OrderStatus getOrderStatus() {
    return orderStatus;
  }
  
  public void setOrderStatus(OrderStatus orderStatus) {
    this.orderStatus = orderStatus;
  }
  
  public User getUser() {
    return user;
  }
  
  public void setUser(User user) {
    this.user = user;
  }
  
  public Set<OrderItem> getOrderItems() {
    return orderItems;
  }
  
  public void setOrderItems(Set<OrderItem> orderItems) {
    this.orderItems = orderItems;
  }
  
  public Double getTotalPrice() {
    return totalPrice;
  }
  
  public void setTotalPrice(Double totalPrice) {
    this.totalPrice = totalPrice;
  }
  
  public Address getAddress() {
    return address;
  }
  
  public void setAddress(Address address) {
    this.address = address;
  }
  
  public String getPhoneNumber() {
    return phoneNumber;
  }
  
  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }
  
  public String getOwnerUserName() {
    return ownerUserName;
  }
  
  public void setOwnerUserName(String ownerUserName) {
    this.ownerUserName = ownerUserName;
  }
}
