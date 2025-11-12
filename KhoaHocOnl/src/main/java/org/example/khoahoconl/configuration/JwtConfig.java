package org.example.khoahoconl.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {
    private String secret;
    private Expiration expiration = new Expiration();

    @Setter
    @Getter
    public static class Expiration {
        private long ms;

    }
}
