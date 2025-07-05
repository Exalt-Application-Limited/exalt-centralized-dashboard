package com.gogidix.centralizeddashboard.core.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents insights generated from cross-domain analysis.
 * These insights help identify optimization opportunities and risks across domains.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrossDomainInsight {
    
    /**
     * Type of the insight
     */
    private InsightType insightType;
    
    /**
     * Title/summary of the insight
     */
    private String title;
    
    /**
     * Detailed description of the insight
     */
    private String description;
    
    /**
     * Severity level of the insight
     */
    private Severity severity;
    
    /**
     * List of domains involved in this insight
     */
    private List<DashboardMetric.SourceDomain> sourceDomains;
    
    /**
     * Timestamp when the insight was generated
     */
    private LocalDateTime timestamp;
    
    /**
     * List of related metric identifiers
     */
    private List<String> relatedMetrics;
    
    /**
     * Additional metadata or context
     */
    private String metadata;
    
    /**
     * Recommended actions to address the insight
     */
    private List<String> recommendedActions;
    
    /**
     * Types of cross-domain insights
     */
    public enum InsightType {
        INVENTORY_RISK,
        LOGISTICS_BOTTLENECK,
        CUSTOMER_EXPERIENCE_GAP,
        SUPPLY_CHAIN_RISK,
        END_TO_END_OPTIMIZATION,
        PERFORMANCE_CORRELATION,
        EFFICIENCY_OPPORTUNITY,
        DEMAND_SUPPLY_MISMATCH
    }
    
    /**
     * Severity levels for insights
     */
    public enum Severity {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}