package com.exalt.centralizeddashboard.analytics.aggregation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for the Analytics Engine
 * Responsible for data aggregation, processing, and storage for analytics purposes
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
public class AnalyticsEngineApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnalyticsEngineApplication.class, args);
    }
} 