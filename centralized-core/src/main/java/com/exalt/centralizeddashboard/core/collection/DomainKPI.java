package com.exalt.centralizeddashboard.core.collection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Represents a Key Performance Indicator (KPI) collected from a specific domain.
 * KPIs are strategic metrics that measure the success of key business objectives.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainKPI {
    
    /**
     * Unique identifier for the KPI
     */
    private String kpiId;
    
    /**
     * The domain this KPI belongs to
     */
    private String domain;
    
    /**
     * Name of the KPI
     */
    private String name;
    
    /**
     * Description of what this KPI represents and its significance
     */
    private String description;
    
    /**
     * Category of the KPI (e.g., "Sales", "Operations", "Customer Satisfaction")
     */
    private String category;
    
    /**
     * The current value of the KPI
     */
    private Object value;
    
    /**
     * Data type of the value
     */
    private DomainMetric.MetricDataType dataType;
    
    /**
     * Unit of measurement
     */
    private String unit;
    
    /**
     * Target value for this KPI
     */
    private Object targetValue;
    
    /**
     * Status of this KPI based on current value vs target
     */
    private KPIStatus status;
    
    /**
     * When this KPI was collected
     */
    private LocalDateTime collectionTimestamp;
    
    /**
     * When this KPI was last updated in the source system
     */
    private LocalDateTime sourceTimestamp;
    
    /**
     * List of metric IDs that contribute to this KPI
     */
    private List<String> relatedMetricIds;
    
    /**
     * Trend direction compared to previous period
     */
    private DomainMetric.TrendDirection trend;
    
    /**
     * Percentage change from previous period
     */
    private Double changePercentage;
    
    /**
     * Additional attributes specific to this KPI
     */
    private Map<String, Object> attributes;
    
    /**
     * Status thresholds for determining the KPI status
     */
    private KPIThresholds thresholds;
    
    /**
     * Time period this KPI represents (e.g., "DAILY", "WEEKLY", "MONTHLY")
     */
    private String timePeriod;
    
    /**
     * Possible KPI status values
     */
    public enum KPIStatus {
        EXCELLENT,
        GOOD,
        WARNING,
        CRITICAL,
        UNKNOWN
    }
    
    /**
     * Thresholds for determining KPI status
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KPIThresholds {
        private Object excellentThreshold;
        private Object goodThreshold;
        private Object warningThreshold;
        private Object criticalThreshold;
        private boolean higherIsBetter; // Indicates if higher values are better
    }
}
