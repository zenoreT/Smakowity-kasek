package pl.SmakowityKasek.utils.exceptionHandling;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class CommonException extends RuntimeException {

  private static final long serialVersionUID = -8818676476261845967L;
  
  public CommonException(String message) {
    super(message);
  }
  
  public CommonException(String message, Throwable cause) {
    super(message, cause);
  }
}
