package com.gogidix.centralizeddashboard.metrics.model;

/**
 * Enum representing the health status of a service
 */
public enum HealthStatus {
    UP,              // Service is healthy and operating normally
    DOWN,            // Service is down and not accessible
    DEGRADED,        // Service is operating but with reduced functionality or performance
    UNKNOWN,         // Service health status could not be determined
    OUT_OF_SERVICE,  // Service has been intentionally taken out of service (e.g., for maintenance)
    WARNING,         // Service is up but there are warning signs that require attention
    CIRCUIT_OPEN     // Service circuit breaker is open
} 