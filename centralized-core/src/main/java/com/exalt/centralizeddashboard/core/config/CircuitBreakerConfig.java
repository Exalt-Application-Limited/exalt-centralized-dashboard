package com.exalt.centralizeddashboard.core.config;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.common.circuitbreaker.configuration.CircuitBreakerConfigCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configuration for Circuit Breakers used in cross-domain integration.
 * Provides customized circuit breaker configurations for different domain services.
 */
@Configuration
public class CircuitBreakerConfig {

    /**
     * Customizer for Courier Service circuit breakers.
     * Configures circuit breakers with appropriate timeouts and failure thresholds.
     */
    @Bean
    public CircuitBreakerConfigCustomizer courierCircuitBreakerConfig() {
        return CircuitBreakerConfigCustomizer.of(
                "courierHqAdmin",
                builder -> builder
                        .slidingWindowSize(10)
                        .failureRateThreshold(50.0f)
                        .waitDurationInOpenState(Duration.ofSeconds(30))
                        .permittedNumberOfCallsInHalfOpenState(5)
                        .automaticTransitionFromOpenToHalfOpenEnabled(true)
                        .recordExceptions(Exception.class)
        );
    }

    /**
     * Customizer for Social Commerce circuit breakers.
     * Configures circuit breakers with appropriate timeouts and failure thresholds.
     */
    @Bean
    public CircuitBreakerConfigCustomizer socialCommerceCircuitBreakerConfig() {
        return CircuitBreakerConfigCustomizer.of(
                "socialCommerceAnalytics",
                builder -> builder
                        .slidingWindowSize(10)
                        .failureRateThreshold(50.0f)
                        .waitDurationInOpenState(Duration.ofSeconds(30))
                        .permittedNumberOfCallsInHalfOpenState(5)
                        .automaticTransitionFromOpenToHalfOpenEnabled(true)
                        .recordExceptions(Exception.class)
        );
    }

    /**
     * Customizer for Warehousing circuit breakers.
     * Configures circuit breakers with appropriate timeouts and failure thresholds.
     */
    @Bean
    public CircuitBreakerConfigCustomizer warehousingCircuitBreakerConfig() {
        return CircuitBreakerConfigCustomizer.of(
                "warehousingInventory",
                builder -> builder
                        .slidingWindowSize(10)
                        .failureRateThreshold(50.0f)
                        .waitDurationInOpenState(Duration.ofSeconds(30))
                        .permittedNumberOfCallsInHalfOpenState(5)
                        .automaticTransitionFromOpenToHalfOpenEnabled(true)
                        .recordExceptions(Exception.class)
        );
    }

    /**
     * Register and initialize all circuit breakers for monitoring.
     * This is not required for functionality but is useful for observability.
     */
    @Bean
    public void initializeCircuitBreakers(CircuitBreakerRegistry registry) {
        // Courier Service circuit breakers
        CircuitBreaker courierHqAdmin = registry.circuitBreaker("courierHqAdmin");
        CircuitBreaker courierRegionalAdmin = registry.circuitBreaker("courierRegionalAdmin");
        CircuitBreaker courierLocalManagement = registry.circuitBreaker("courierLocalManagement");
        CircuitBreaker courierFieldStaff = registry.circuitBreaker("courierFieldStaff");
        
        // Social Commerce circuit breakers
        CircuitBreaker socialCommerceAnalytics = registry.circuitBreaker("socialCommerceAnalytics");
        CircuitBreaker socialCommerceEngagement = registry.circuitBreaker("socialCommerceEngagement");
        CircuitBreaker socialCommerceSales = registry.circuitBreaker("socialCommerceSales");
        
        // Warehousing circuit breakers
        CircuitBreaker warehousingInventory = registry.circuitBreaker("warehousingInventory");
        CircuitBreaker warehousingOperations = registry.circuitBreaker("warehousingOperations");
        CircuitBreaker warehousingFulfillment = registry.circuitBreaker("warehousingFulfillment");
    }
}
