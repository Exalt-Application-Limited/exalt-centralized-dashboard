package com.gogidix.centralizeddashboard.metrics.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing a performance metric
 */
@Entity
@Table(name = "performance_metrics")
public class PerformanceMetric {

    @Id
    private String id;
    
    @Column(nullable = false)
    private String serviceName;
    
    @Column(nullable = false)
    private String instanceId;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MetricType metricType;
    
    @Column(nullable = false)
    private String metricName;
    
    @Column(nullable = false)
    private Double value;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column
    private String tags;
    
    // Default constructor
    public PerformanceMetric() {
        this.id = UUID.randomUUID().toString();
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructor with required fields
    public PerformanceMetric(String serviceName, String instanceId, MetricType metricType, 
            String metricName, Double value) {
        this();
        this.serviceName = serviceName;
        this.instanceId = instanceId;
        this.metricType = metricType;
        this.metricName = metricName;
        this.value = value;
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

    public MetricType getMetricType() {
        return metricType;
    }

    public void setMetricType(MetricType metricType) {
        this.metricType = metricType;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }
} 