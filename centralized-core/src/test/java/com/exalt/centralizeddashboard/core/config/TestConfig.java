package com.exalt.centralizeddashboard.core.config;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;

@TestConfiguration
@ActiveProfiles("test")
public class TestConfig {
    
    @Bean
    public JwtDecoder jwtDecoder() {
        // Return a mock JwtDecoder for testing
        return Mockito.mock(JwtDecoder.class);
    }
    
    // Add other test-specific beans here
}
