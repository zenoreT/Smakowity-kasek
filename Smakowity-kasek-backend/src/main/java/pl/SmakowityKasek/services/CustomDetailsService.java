package pl.SmakowityKasek.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.SmakowityKasek.entities.User;
import pl.SmakowityKasek.models.UserPrincipal;
import pl.SmakowityKasek.repositories.UserRepository;

import javax.transaction.Transactional;

@Service
public class CustomDetailsService implements UserDetailsService {
  private final UserRepository userRepository;

  @Autowired
  public CustomDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email : " + username));

    return UserPrincipal.create(user);
  }

  @Transactional
  public UserDetails loadUserById(Long id) {
    User user = userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found with id : " + id));

    return UserPrincipal.create(user);
  }
}
