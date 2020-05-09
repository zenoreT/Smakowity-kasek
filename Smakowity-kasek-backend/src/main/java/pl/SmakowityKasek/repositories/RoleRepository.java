package pl.SmakowityKasek.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.SmakowityKasek.models.RoleName;
import pl.SmakowityKasek.entities.Role;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(RoleName roleName);
  
  List<Role> findByNameIn(List<RoleName> roleNames);
}
