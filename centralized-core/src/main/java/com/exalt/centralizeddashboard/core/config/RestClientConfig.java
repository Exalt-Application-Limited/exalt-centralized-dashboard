package com.exalt.centralizeddashboard.core.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Configuration for REST clients used in the Centralized Dashboard.
 * Configures RestTemplate with appropriate timeouts and error handlers.
 */
@Configuration
public class RestClientConfig {

    /**
     * Creates a ClientHttpRequestFactory with custom connection and read timeouts.
     *
     * @return the ClientHttpRequestFactory
     */
    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // 5 seconds
        factory.setReadTimeout(10000);   // 10 seconds
        return factory;
    }

    /**
     * Creates a RestTemplate configured with appropriate timeouts and error handlers.
     *
     * @param builder the RestTemplateBuilder
     * @return the configured RestTemplate
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }
}