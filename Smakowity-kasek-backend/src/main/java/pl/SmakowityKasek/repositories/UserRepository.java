package pl.SmakowityKasek.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.SmakowityKasek.entities.Role;
import pl.SmakowityKasek.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
  
  List<User> findByIdIn(List<Long> userIds);
  
  Page<User> findAllDistinctByRolesIn(List<Role> roles, Pageable pageable);
  
  Optional<User> findByUsername(String username);
  
  Boolean existsByUsername(String username);
  
  Boolean existsByEmail(String email);
}
