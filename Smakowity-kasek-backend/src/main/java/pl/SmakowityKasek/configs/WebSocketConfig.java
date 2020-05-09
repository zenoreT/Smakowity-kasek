package pl.SmakowityKasek.configs;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import pl.SmakowityKasek.configs.jwt.JwtTokenProvider;
import pl.SmakowityKasek.services.CustomDetailsService;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  @Autowired
  private JwtTokenProvider jwtTokenProvider;
  
  @Autowired
  private CustomDetailsService customDetailsService;
  
  private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);
  
  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/socket");
  }
  
  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/socket").setAllowedOrigins("*").withSockJS();
  }
  
  @Override
  public void configureClientInboundChannel(ChannelRegistration registration) {
    registration.interceptors(new ChannelInterceptor() {
      @Override
      public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
          try {
            String token = getJwtFromMessage(message);
            if (StringUtils.hasText(token) && jwtTokenProvider.isTokenValid(token)) {
              Long userId = jwtTokenProvider.getUserIdFromToken(token);
              
              UserDetails userDetails = customDetailsService.loadUserById(userId);
              UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
              accessor.setUser(authentication);
            }
          } catch (Exception ex) {
            logger.error("Could not set repositories authentication in security context", ex);
          }
        }
        return message;
      }
    });
  }
  
  private String getJwtFromMessage(Message<?> message) {
    @SuppressWarnings("unchecked")
    Map<String, List<String>> nativeHeaders = (Map<String, List<String>>) message.getHeaders().get("nativeHeaders");
    String bearerToken = nativeHeaders.get("Authorization").get(0);
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }
}