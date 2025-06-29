package com.exalt.centralizeddashboard.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for the Centralized Dashboard Core.
 * This module serves as the central component for aggregating data from all domains
 * and providing a unified view of business intelligence across the ecosystem.
 */
@SpringBootApplication
@EnableCaching
@EnableScheduling
@EnableJpaAuditing
public class CentralizedDashboardCoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(CentralizedDashboardCoreApplication.class, args);
    }
}