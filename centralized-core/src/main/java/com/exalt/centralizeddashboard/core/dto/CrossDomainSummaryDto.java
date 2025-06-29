package com.exalt.centralizeddashboard.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO for cross-domain dashboard summary.
 * Contains aggregated data from all domains for a comprehensive view.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrossDomainSummaryDto {
    
    /**
     * Timestamp when the summary was generated
     */
    private LocalDateTime timestamp;
    
    /**
     * Total number of metrics across all domains
     */
    private Integer totalMetrics;
    
    /**
     * Last updated timestamp as string
     */
    private String lastUpdated;
    
    /**
     * Health status of all domains
     */
    private List<DomainHealthDto> domainHealth;
    
    /**
     * Top metrics from Courier Services domain
     */
    private List<DashboardMetricDto> courierMetrics;
    
    /**
     * Top metrics from Social Commerce domain
     */
    private List<DashboardMetricDto> socialCommerceMetrics;
    
    /**
     * Top metrics from Warehousing domain
     */
    private List<DashboardMetricDto> warehousingMetrics;
    
    /**
     * Top KPIs across all domains
     */
    private List<DashboardKPIDto> topKPIs;
    
    /**
     * Insights derived from cross-domain analysis
     */
    private Map<String, Object> insights;
    
    /**
     * Alerts and notifications
     */
    private List<Map<String, Object>> alerts;
    
    /**
     * Overall system health score (0-100)
     */
    private Integer systemHealthScore;
}
