package pl.SmakowityKasek.configs.jwt;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import pl.SmakowityKasek.models.UserPrincipal;

import java.util.Date;

@Component
public class JwtTokenProvider {
  private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

  @Value("${app.jwtSecret}")
  private String jwtSecret;

  @Value("${app.jwtExpirationTime}")
  private int jwtExpirationTime;

  public String generateToken(Authentication authentication) {
    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
    Date expirationDate = new Date(new Date().getTime() + jwtExpirationTime);

    return Jwts
      .builder()
      .setSubject(Long.toString(userPrincipal.getId()))
      .setIssuedAt(new Date())
      .setExpiration(expirationDate)
      .signWith(SignatureAlgorithm.HS512, jwtSecret)
      .compact();
  }

  public Long getUserIdFromToken(String token) {
    Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();

    return Long.parseLong(claims.getSubject());
  }

  public boolean isTokenValid(String token) {
    try {
      Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
      return true;
    } catch (SignatureException ex) {
      logger.error("Invalid JWT signature");
    } catch (MalformedJwtException ex) {
      logger.error("Invalid JWT token");
    } catch (ExpiredJwtException ex) {
      logger.error("Expired JWT token");
    } catch (UnsupportedJwtException ex) {
      logger.error("Unsupported JWT token");
    } catch (IllegalArgumentException ex) {
      logger.error("JWT claims string is empty.");
    }
    return false;
  }
}
