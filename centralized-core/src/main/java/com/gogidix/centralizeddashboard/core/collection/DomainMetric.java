package com.gogidix.centralizeddashboard.core.collection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Represents a metric collected from a specific domain.
 * A metric is a quantifiable measurement used to track and assess the status of a specific business process.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainMetric {
    
    /**
     * Unique identifier for the metric
     */
    private String metricId;
    
    /**
     * The domain this metric belongs to
     */
    private String domain;
    
    /**
     * Name of the metric
     */
    private String name;
    
    /**
     * Description of what this metric represents
     */
    private String description;
    
    /**
     * The category this metric belongs to
     */
    private String category;
    
    /**
     * The actual value of the metric
     */
    private Object value;
    
    /**
     * Data type of the value (e.g., INTEGER, DOUBLE, STRING, BOOLEAN)
     */
    private MetricDataType dataType;
    
    /**
     * Unit of measurement (e.g., COUNT, PERCENTAGE, CURRENCY, TIME)
     */
    private String unit;
    
    /**
     * When this metric was collected
     */
    private LocalDateTime collectionTimestamp;
    
    /**
     * When this metric was last updated in the source system
     */
    private LocalDateTime sourceTimestamp;
    
    /**
     * Additional attributes specific to this metric
     */
    private Map<String, Object> attributes;
    
    /**
     * Trend indicator compared to previous period
     */
    private TrendDirection trend;
    
    /**
     * Percentage change from previous period
     */
    private Double changePercentage;
    
    /**
     * Possible data types for metric values
     */
    public enum MetricDataType {
        INTEGER,
        DOUBLE,
        STRING,
        BOOLEAN,
        TIMESTAMP,
        DURATION,
        JSON,
        ARRAY
    }
    
    /**
     * Possible trend directions
     */
    public enum TrendDirection {
        UP,
        DOWN,
        UNCHANGED,
        UNKNOWN
    }
}
