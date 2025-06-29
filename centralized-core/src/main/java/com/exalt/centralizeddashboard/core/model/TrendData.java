package com.exalt.centralizeddashboard.core.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents trend analysis data for metrics over time.
 * Used for calculating trends, slopes, and forecasting.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendData {
    
    /**
     * Current value of the metric
     */
    private Double value;
    
    /**
     * Slope of the trend line (rate of change)
     */
    private Double slope;
    
    /**
     * R-squared value indicating trend reliability (0-1)
     */
    private Double correlation;
    
    /**
     * Direction of the trend
     */
    private TrendDirection direction;
    
    /**
     * Number of data points used for trend calculation
     */
    private Integer dataPointCount;
    
    /**
     * Time period for the trend analysis
     */
    private String timePeriod;
    
    /**
     * Timestamp when trend was calculated
     */
    private LocalDateTime calculatedAt;
    
    /**
     * Historical data points used for trend calculation
     */
    private List<Double> historicalValues;
    
    /**
     * Constructor for basic trend data
     */
    public TrendData(Double value, Double slope) {
        this.value = value;
        this.slope = slope;
        this.direction = determineTrendDirection(slope);
        this.calculatedAt = LocalDateTime.now();
    }
    
    /**
     * Determine trend direction based on slope
     */
    private TrendDirection determineTrendDirection(Double slope) {
        if (slope == null) return TrendDirection.STABLE;
        if (slope > 0.1) return TrendDirection.INCREASING;
        if (slope < -0.1) return TrendDirection.DECREASING;
        return TrendDirection.STABLE;
    }
    
    /**
     * Get slope value safely
     */
    public Double getSlope() {
        return slope != null ? slope : 0.0;
    }
    
    /**
     * Get value safely
     */
    public Double getValue() {
        return value != null ? value : 0.0;
    }
    
    /**
     * Trend direction enumeration
     */
    public enum TrendDirection {
        INCREASING,
        DECREASING,
        STABLE,
        VOLATILE
    }
}