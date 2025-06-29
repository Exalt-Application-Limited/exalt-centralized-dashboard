package com.exalt.centralizeddashboard.realtime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for the Real Time Data service
 * This service is responsible for streaming and processing real-time data
 * for the entire micro-service ecosystem
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
public class RealTimeDataApplication {

    public static void main(String[] args) {
        SpringApplication.run(RealTimeDataApplication.class, args);
    }
}