package com.gogidix.centralizeddashboard.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Test application class for the Centralized Dashboard Core module.
 * This class bridges the package mismatch between main code and test code.
 * The main application is in com.microecosystem.dashboard.core
 * While tests are in com.exalt.centralizeddashboard.core
 */
@SpringBootApplication
@ComponentScan(basePackages = {
    "com.microecosystem.dashboard.core",
    "com.exalt.centralizeddashboard.core"
})
@EntityScan(basePackages = {
    "com.microecosystem.dashboard.core.model"
})
@EnableJpaRepositories(basePackages = {
    "com.microecosystem.dashboard.core.repository"
})
@EnableCaching
@EnableScheduling
@EnableJpaAuditing
public class CentralizedDashboardCoreTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(CentralizedDashboardCoreTestApplication.class, args);
    }
}
