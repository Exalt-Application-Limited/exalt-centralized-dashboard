package com.gogidix.centralizeddashboard.core.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import java.time.Duration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for Admin Framework integration.
 * Configures the circuit breaker patterns for resilience.
 */
@Configuration
public class AdminFrameworkConfig {

    /**
     * Configures the circuit breaker for Admin Framework authentication calls.
     *
     * @param circuitBreakerRegistry the circuit breaker registry
     * @return the configured circuit breaker
     */
    @Bean
    public io.github.resilience4j.circuitbreaker.CircuitBreaker adminFrameworkAuthCircuitBreaker(
            CircuitBreakerRegistry circuitBreakerRegistry) {
        
        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofSeconds(20))
                .permittedNumberOfCallsInHalfOpenState(5)
                .slidingWindowSize(10)
                .build();
        
        return circuitBreakerRegistry.circuitBreaker("adminFrameworkAuth", config);
    }

    /**
     * Configures the circuit breaker for Admin Framework template calls.
     *
     * @param circuitBreakerRegistry the circuit breaker registry
     * @return the configured circuit breaker
     */
    @Bean
    public io.github.resilience4j.circuitbreaker.CircuitBreaker adminFrameworkTemplatesCircuitBreaker(
            CircuitBreakerRegistry circuitBreakerRegistry) {
        
        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofSeconds(30))
                .permittedNumberOfCallsInHalfOpenState(3)
                .slidingWindowSize(10)
                .build();
        
        return circuitBreakerRegistry.circuitBreaker("adminFrameworkTemplates", config);
    }

    /**
     * Configures the circuit breaker for Admin Framework export calls.
     *
     * @param circuitBreakerRegistry the circuit breaker registry
     * @return the configured circuit breaker
     */
    @Bean
    public io.github.resilience4j.circuitbreaker.CircuitBreaker adminFrameworkExportCircuitBreaker(
            CircuitBreakerRegistry circuitBreakerRegistry) {
        
        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofSeconds(20))
                .permittedNumberOfCallsInHalfOpenState(2)
                .slidingWindowSize(10)
                .build();
        
        return circuitBreakerRegistry.circuitBreaker("adminFrameworkExport", config);
    }

    /**
     * Configures the circuit breaker for Admin Framework user management calls.
     *
     * @param circuitBreakerRegistry the circuit breaker registry
     * @return the configured circuit breaker
     */
    @Bean
    public io.github.resilience4j.circuitbreaker.CircuitBreaker adminFrameworkUsersCircuitBreaker(
            CircuitBreakerRegistry circuitBreakerRegistry) {
        
        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofSeconds(15))
                .permittedNumberOfCallsInHalfOpenState(3)
                .slidingWindowSize(10)
                .build();
        
        return circuitBreakerRegistry.circuitBreaker("adminFrameworkUsers", config);
    }
}
