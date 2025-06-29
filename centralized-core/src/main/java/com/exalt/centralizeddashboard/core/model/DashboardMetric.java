package com.exalt.centralizeddashboard.core.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing a dashboard metric.
 * This is a base entity for storing metric data from various domains.
 */
@Entity
@Table(name = "dashboard_metrics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metric_name", nullable = false)
    private String metricName;
    
    @Column(name = "metric_value", nullable = false)
    private Double metricValue;
    
    @Column(name = "metric_unit")
    private String metricUnit;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "source_domain", nullable = false)
    private SourceDomain sourceDomain;
    
    @Column(name = "source_service")
    private String sourceService;
    
    @Column(name = "region")
    private String region;
    
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "data_point_type")
    @Enumerated(EnumType.STRING)
    private DataPointType dataPointType;
    
    @Column(name = "tags")
    private String tags;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Enum representing the source domain of a metric.
     */
    public enum SourceDomain {
        SOCIAL_COMMERCE,
        WAREHOUSING,
        COURIER_SERVICES
    }
    
    /**
     * Enum representing the type of data point.
     */
    public enum DataPointType {
        INSTANT,
        CUMULATIVE,
        GAUGE,
        DELTA
    }
}