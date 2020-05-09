package pl.SmakowityKasek.controlers;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.SmakowityKasek.entities.Role;
import pl.SmakowityKasek.entities.User;
import pl.SmakowityKasek.models.RoleName;
import pl.SmakowityKasek.repositories.RoleRepository;
import pl.SmakowityKasek.repositories.UserRepository;
import pl.SmakowityKasek.utils.FunctionUtils;
import pl.SmakowityKasek.utils.requests.TableRequest;

/**
 * EmployeesController
 */
@RestController
@RequestMapping("/api/employee")
public class EmployeesController {
  
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  
  @Autowired
  public EmployeesController(UserRepository userRepository, RoleRepository roleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }
  
  @PreAuthorize("hasAuthority('ADMIN')")
  @PostMapping("/list")
  public ResponseEntity<?> getUsersList(@RequestBody TableRequest tableRequest) {
    PageRequest pageRequest = tableRequest.toPageRequest();
    List<RoleName> roleNames = FunctionUtils.getEnumFromFilters(tableRequest.getFilters(), RoleName.class);
    List<Role> roles = roleRepository.findByNameIn(roleNames);
    List<User> users = userRepository.findAllDistinctByRolesIn(roles, pageRequest).getContent();
    return ResponseEntity.ok(Map.of("employees", users, "count", users.size()));
  }
  
  @PreAuthorize("hasAuthority('ADMIN')")
  @PostMapping("/update")
  public ResponseEntity<?> updateUser(@RequestBody User user) {
    User originalUser = userRepository.findByUsername(user.getUsername()).orElseThrow();
    Set<Role> roles = roleRepository
        .findByNameIn(user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList())).stream().collect(Collectors.toSet());
    originalUser.setUsername(user.getUsername());
    originalUser.setRoles(user.getRoles());
    originalUser.setEmail(user.getEmail());
    originalUser.setAddress(user.getAddress());
    originalUser.setRoles(roles);
    userRepository.save(originalUser);
    return ResponseEntity.ok(originalUser);
  }
}