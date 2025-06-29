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
 * Entity representing a Key Performance Indicator (KPI) in the dashboard.
 * KPIs are calculated metrics based on one or more raw metrics.
 */
@Entity
@Table(name = "dashboard_kpis")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardKPI {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "kpi_name", nullable = false)
    private String kpiName;
    
    @Column(name = "kpi_value", nullable = false)
    private Double kpiValue;
    
    @Column(name = "kpi_unit")
    private String kpiUnit;
    
    @Column(name = "target_value")
    private Double targetValue;
    
    @Column(name = "min_threshold")
    private Double minThreshold;
    
    @Column(name = "max_threshold")
    private Double maxThreshold;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "kpi_status")
    private KPIStatus kpiStatus;
    
    @Column(name = "kpi_category", nullable = false)
    @Enumerated(EnumType.STRING)
    private KPICategory kpiCategory;
    
    @Column(name = "calculation_formula")
    private String calculationFormula;
    
    @Column(name = "calculation_period")
    @Enumerated(EnumType.STRING)
    private CalculationPeriod calculationPeriod;
    
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "region")
    private String region;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "domain")
    private String domain;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "source_domain")
    private DashboardMetric.SourceDomain sourceDomain;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Enum representing the status of a KPI.
     */
    public enum KPIStatus {
        EXCELLENT,
        GOOD,
        WARNING,
        CRITICAL,
        NOT_AVAILABLE
    }
    
    /**
     * Enum representing the category of a KPI.
     */
    public enum KPICategory {
        FINANCIAL,
        OPERATIONAL,
        CUSTOMER,
        GROWTH,
        SUSTAINABILITY,
        EFFICIENCY,
        QUALITY
    }
    
    /**
     * Enum representing the calculation period of a KPI.
     */
    public enum CalculationPeriod {
        HOURLY,
        DAILY,
        WEEKLY,
        MONTHLY,
        QUARTERLY,
        YEARLY
    }
}