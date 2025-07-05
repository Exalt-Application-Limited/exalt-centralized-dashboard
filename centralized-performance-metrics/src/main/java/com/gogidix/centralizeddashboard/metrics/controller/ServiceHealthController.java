package com.gogidix.centralizeddashboard.metrics.controller;

import com.gogidix.centralizeddashboard.metrics.model.HealthStatus;
import com.gogidix.centralizeddashboard.metrics.model.ServiceHealth;
import com.gogidix.centralizeddashboard.metrics.service.ServiceHealthService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for service health operations
 */
@RestController
@RequestMapping("/api/v1/health")
public class ServiceHealthController {

    private static final Logger logger = LoggerFactory.getLogger(ServiceHealthController.class);
    
    private final ServiceHealthService healthService;
    
    @Autowired
    public ServiceHealthController(ServiceHealthService healthService) {
        this.healthService = healthService;
    }
    
    /**
     * Report service health status
     */
    @PostMapping
    public ResponseEntity<ServiceHealth> reportHealthStatus(@RequestBody Map<String, Object> healthData) {
        try {
            String serviceName = (String) healthData.get("serviceName");
            String instanceId = (String) healthData.get("instanceId");
            String statusStr = (String) healthData.get("status");
            String details = (String) healthData.get("details");
            
            // Validate required fields
            if (serviceName == null || instanceId == null || statusStr == null) {
                return ResponseEntity.badRequest().build();
            }
            
            HealthStatus status = HealthStatus.valueOf(statusStr);
            
            ServiceHealth health;
            if (details != null) {
                health = healthService.recordHealthStatusWithDetails(
                        serviceName, instanceId, status, details);
            } else {
                health = healthService.recordHealthStatus(
                        serviceName, instanceId, status);
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(health);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid health data: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error reporting health status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get health status by service name and instance ID
     */
    @GetMapping("/status")
    public ResponseEntity<ServiceHealth> getHealthStatus(
            @RequestParam String serviceName, @RequestParam String instanceId) {
        try {
            Optional<ServiceHealth> healthOpt = healthService.getHealthStatus(serviceName, instanceId);
            
            if (healthOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(healthOpt.get());
        } catch (Exception e) {
            logger.error("Error getting health status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get all health statuses for a service name
     */
    @GetMapping("/by-service/{serviceName}")
    public ResponseEntity<List<ServiceHealth>> getHealthStatusesByServiceName(@PathVariable String serviceName) {
        try {
            List<ServiceHealth> healthStatuses = healthService.getHealthStatusesByServiceName(serviceName);
            return ResponseEntity.ok(healthStatuses);
        } catch (Exception e) {
            logger.error("Error getting health statuses by service name: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get all health statuses for a specific status
     */
    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<ServiceHealth>> getHealthStatusesByStatus(@PathVariable String status) {
        try {
            HealthStatus healthStatus = HealthStatus.valueOf(status.toUpperCase());
            List<ServiceHealth> healthStatuses = healthService.getHealthStatusesByStatus(healthStatus);
            return ResponseEntity.ok(healthStatuses);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid health status: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error getting health statuses by status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get stale service instances
     */
    @GetMapping("/stale")
    public ResponseEntity<List<ServiceHealth>> getStaleServiceInstances(
            @RequestParam(defaultValue = "5") long staleThresholdMinutes) {
        try {
            List<ServiceHealth> staleInstances = healthService.findStaleServiceInstances(staleThresholdMinutes);
            return ResponseEntity.ok(staleInstances);
        } catch (Exception e) {
            logger.error("Error getting stale service instances: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get overall health status for a service
     */
    @GetMapping("/overall/{serviceName}")
    public ResponseEntity<Map<String, String>> getOverallHealthForService(@PathVariable String serviceName) {
        try {
            HealthStatus status = healthService.getOverallHealthForService(serviceName);
            Map<String, String> result = new HashMap<>();
            result.put("serviceName", serviceName);
            result.put("status", status.toString());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error getting overall health for service: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get service health summary
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getHealthSummary() {
        try {
            Map<String, Object> summary = healthService.getHealthSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            logger.error("Error getting health summary: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get service count by status
     */
    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getServiceCountByStatus() {
        try {
            Map<HealthStatus, Long> countsByStatus = healthService.getServiceCountByStatus();
            
            // Convert enum keys to strings for JSON serialization
            Map<String, Long> result = new HashMap<>();
            countsByStatus.forEach((status, count) -> result.put(status.toString(), count));
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error getting service count by status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Mark stale services as UNKNOWN
     */
    @PostMapping("/mark-stale-as-unknown")
    public ResponseEntity<Map<String, Integer>> markStaleServicesAsUnknown(
            @RequestParam(defaultValue = "5") long staleThresholdMinutes) {
        try {
            int count = healthService.markStaleServicesAsUnknown(staleThresholdMinutes);
            Map<String, Integer> result = new HashMap<>();
            result.put("updatedCount", count);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error marking stale services as unknown: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Check if critical services are healthy
     */
    @GetMapping("/critical-services-healthy")
    public ResponseEntity<Map<String, Boolean>> areCriticalServicesHealthy(
            @RequestParam List<String> criticalServices) {
        try {
            boolean healthy = healthService.areCriticalServicesHealthy(criticalServices);
            Map<String, Boolean> result = new HashMap<>();
            result.put("allHealthy", healthy);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error checking critical services health: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Delete old health records manually
     */
    @DeleteMapping("/prune")
    public ResponseEntity<Map<String, Integer>> pruneOldHealthRecords(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cutoffTime) {
        try {
            int count = healthService.pruneOldHealthRecords(cutoffTime);
            Map<String, Integer> result = new HashMap<>();
            result.put("prunedCount", count);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error pruning old health records: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 