package com.exalt.centralizeddashboard.metrics.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing the health status of a service instance
 */
@Entity
@Table(name = "service_health")
public class ServiceHealth {

    @Id
    private String id;
    
    @Column(nullable = false)
    private String serviceName;
    
    @Column(nullable = false)
    private String instanceId;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private HealthStatus status;
    
    @Column(nullable = false)
    private LocalDateTime lastUpdated;
    
    @Column(nullable = false)
    private LocalDateTime lastCheckTime;
    
    @Column
    private String details;
    
    // Default constructor
    public ServiceHealth() {
        this.id = UUID.randomUUID().toString();
        this.lastUpdated = LocalDateTime.now();
        this.lastCheckTime = LocalDateTime.now();
    }
    
    // Constructor with required fields
    public ServiceHealth(String serviceName, String instanceId, HealthStatus status) {
        this();
        this.serviceName = serviceName;
        this.instanceId = instanceId;
        this.status = status;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }

    public HealthStatus getStatus() {
        return status;
    }

    public void setStatus(HealthStatus status) {
        this.status = status;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public LocalDateTime getLastCheckTime() {
        return lastCheckTime;
    }

    public void setLastCheckTime(LocalDateTime lastCheckTime) {
        this.lastCheckTime = lastCheckTime;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
    
    /**
     * Update the health status and timestamps
     */
    public void updateStatus(HealthStatus newStatus, String newDetails) {
        this.status = newStatus;
        this.details = newDetails;
        this.lastUpdated = LocalDateTime.now();
        this.lastCheckTime = LocalDateTime.now();
    }
    
    /**
     * Update just the check time without changing the status
     */
    public void updateCheckTime() {
        this.lastCheckTime = LocalDateTime.now();
    }
} 