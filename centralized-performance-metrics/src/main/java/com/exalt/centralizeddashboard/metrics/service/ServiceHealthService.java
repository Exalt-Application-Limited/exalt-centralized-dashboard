package com.exalt.centralizeddashboard.metrics.service;

import com.exalt.centralizeddashboard.metrics.model.HealthStatus;
import com.exalt.centralizeddashboard.metrics.model.ServiceHealth;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service interface for service health operations
 */
public interface ServiceHealthService {

    /**
     * Record a service health update
     */
    ServiceHealth recordHealthStatus(String serviceName, String instanceId, HealthStatus status);
    
    /**
     * Record a service health update with details
     */
    ServiceHealth recordHealthStatusWithDetails(
            String serviceName, String instanceId, HealthStatus status, String details);
    
    /**
     * Get health status by service name and instance ID
     */
    Optional<ServiceHealth> getHealthStatus(String serviceName, String instanceId);
    
    /**
     * Get all health statuses for a service name
     */
    List<ServiceHealth> getHealthStatusesByServiceName(String serviceName);
    
    /**
     * Get all health statuses for a specific status
     */
    List<ServiceHealth> getHealthStatusesByStatus(HealthStatus status);
    
    /**
     * Check for service instances that haven't reported their health recently
     */
    List<ServiceHealth> findStaleServiceInstances(long staleThresholdMinutes);
    
    /**
     * Get overall health status for a service (considering all instances)
     */
    HealthStatus getOverallHealthForService(String serviceName);
    
    /**
     * Get service health summary for all services
     */
    Map<String, Object> getHealthSummary();
    
    /**
     * Get the count of services by health status
     */
    Map<HealthStatus, Long> getServiceCountByStatus();
    
    /**
     * Mark stale service instances as UNKNOWN
     */
    int markStaleServicesAsUnknown(long staleThresholdMinutes);
    
    /**
     * Prune old service health records
     */
    int pruneOldHealthRecords(LocalDateTime cutoffTime);
    
    /**
     * Check if any critical services are down
     */
    boolean areCriticalServicesHealthy(List<String> criticalServices);
} 