package com.gogidix.centralizeddashboard.core.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents correlation analysis results between different domains and metrics.
 * Used for cross-domain performance analysis and efficiency calculations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorrelationResult {
    
    /**
     * The region or domain identifier for this correlation result
     */
    private String region;
    
    /**
     * Efficiency score calculated from the correlation analysis
     */
    private Double efficiency;
    
    /**
     * Total time measured for the operation
     */
    private Double totalTime;
    
    /**
     * Fulfillment time percentage of total time
     */
    private Double fulfillmentPercentage;
    
    /**
     * Delivery time percentage of total time
     */
    private Double deliveryPercentage;
    
    /**
     * Correlation coefficient between metrics (-1 to 1)
     */
    private Double correlationCoefficient;
    
    /**
     * Additional metadata for the correlation analysis
     */
    private String metadata;
    
    /**
     * Constructor for efficiency calculations
     */
    public CorrelationResult(String region, Double efficiency, Double totalTime, 
                           Double fulfillmentPercentage, Double deliveryPercentage) {
        this.region = region;
        this.efficiency = efficiency;
        this.totalTime = totalTime;
        this.fulfillmentPercentage = fulfillmentPercentage;
        this.deliveryPercentage = deliveryPercentage;
    }
    
    /**
     * Get score value (alias for efficiency for backward compatibility)
     */
    public Double getScore() {
        return efficiency != null ? efficiency : 0.0;
    }
}