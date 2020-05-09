package pl.SmakowityKasek.controlers;

import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.SmakowityKasek.configs.jwt.JwtTokenProvider;
import pl.SmakowityKasek.entities.Role;
import pl.SmakowityKasek.entities.User;
import pl.SmakowityKasek.models.RoleName;
import pl.SmakowityKasek.repositories.RoleRepository;
import pl.SmakowityKasek.repositories.UserRepository;
import pl.SmakowityKasek.services.CustomDetailsService;
import pl.SmakowityKasek.utils.FunctionUtils;
import pl.SmakowityKasek.utils.exceptionHandling.CommonException;
import pl.SmakowityKasek.utils.requests.LoginRequest;
import pl.SmakowityKasek.utils.requests.RegisterRequest;
import pl.SmakowityKasek.utils.responses.AuthenticationResponse;
import pl.SmakowityKasek.utils.responses.CommonResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  
  private final String REGISTER_SUCCESS = "Zarejestrowano pomyślnie!";
  private final String REGISTER_ERROR = "Nie udało się zarejestrować! Spróbuj ponownie.";
  private final String REGISTER_ERROR_USERNAME = "Nie udało się zarejestrować! Podana nazwa użytkownika jest już zajęta.";
  private final String REGISTER_ERROR_EMAIL = "Nie udało się zarejestrować! Podany adres e-mail jest już zajęty.";
  
  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider tokenProvider;
  private final JwtTokenProvider jwtTokenProvider;
  private final CustomDetailsService customDetailsService;
  
  @Autowired
  public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository,
      PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider, JwtTokenProvider jwtTokenProvider, CustomDetailsService customDetailsService) {
    this.authenticationManager = authenticationManager;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
    this.tokenProvider = tokenProvider;
    this.jwtTokenProvider = jwtTokenProvider;
    this.customDetailsService = customDetailsService;
  }
  
  @PostMapping(value = "/authenticate", params =
    { "token" })
  public ResponseEntity<?> authenticateUser(@RequestParam String token) {
    Long userId = jwtTokenProvider.getUserIdFromToken(token);
    UserDetails userDetails = customDetailsService.loadUserById(userId);
    
    return ResponseEntity.ok(new AuthenticationResponse(userDetails.getUsername(), FunctionUtils.grantedAuthoritiesRoles(userDetails.getAuthorities()), token));
  }
  
  @PostMapping("/login")
  public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
    
    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = tokenProvider.generateToken(authentication);
    
    return ResponseEntity
        .ok(new AuthenticationResponse(loginRequest.getUsername(), FunctionUtils.grantedAuthoritiesRoles(authentication.getAuthorities()), jwt));
  }
  
  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return ResponseEntity.badRequest().body(new CommonResponse(this.REGISTER_ERROR, bindingResult));
    }
    if (userRepository.existsByUsername(registerRequest.getUsername())) {
      return ResponseEntity.badRequest().body(new CommonResponse(this.REGISTER_ERROR_USERNAME));
    }
    if (userRepository.existsByEmail(registerRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new CommonResponse(this.REGISTER_ERROR_EMAIL));
    }
    
    Set<Role> roles = roleRepository.findByNameIn(registerRequest.getRoles().stream().collect(Collectors.toList())).stream().collect(Collectors.toSet());
    
    User user = new User(registerRequest.getUsername(), registerRequest.getEmail(), registerRequest.getPassword(), registerRequest.getAddress(), roles);
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    
    Role userRole = roleRepository.findByName(RoleName.USER).orElseThrow(() -> new CommonException(this.REGISTER_ERROR));
    user.getRoles().add(userRole);
    userRepository.save(user);
    
    return ResponseEntity.ok(new CommonResponse(this.REGISTER_SUCCESS));
  }
}
