package pl.SmakowityKasek.utils;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.time.Instant;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
public abstract class DateAudit implements Serializable {
  
  private static final long serialVersionUID = 5478728277418183584L;
  
  @CreatedDate
  @Column(nullable = false, updatable = false)
  private Instant createdAt;
  
  @LastModifiedDate
  @Column(nullable = false)
  private Instant updatedAt;
}
