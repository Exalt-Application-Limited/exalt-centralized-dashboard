package com.gogidix.centralizeddashboard.metrics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for the Performance Metrics service
 * This service is responsible for collecting, storing, and providing performance metrics 
 * for the entire micro-service ecosystem
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
public class PerformanceMetricsApplication {

    public static void main(String[] args) {
        SpringApplication.run(PerformanceMetricsApplication.class, args);
    }
} 