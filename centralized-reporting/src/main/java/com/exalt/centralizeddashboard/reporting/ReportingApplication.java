package com.exalt.centralizeddashboard.reporting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for the Reporting service
 * This service is responsible for generating reports and analytics
 * for the entire micro-service ecosystem
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
public class ReportingApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReportingApplication.class, args);
    }
}