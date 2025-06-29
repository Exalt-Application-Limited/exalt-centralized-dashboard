package com.exalt.centralizeddashboard.core.service;

import com.exalt.centralizeddashboard.core.dto.CrossDomainSummaryDto;
import com.exalt.centralizeddashboard.core.dto.DashboardMetricDto;
import com.exalt.centralizeddashboard.core.dto.DomainHealthDto;

import java.util.List;
import java.util.Map;

/**
 * Service for aggregating and analyzing data across all domains.
 * Provides methods for generating cross-domain dashboards and insights.
 */
public interface CrossDomainDashboardService {

    /**
     * Get a comprehensive dashboard summary that aggregates data from all domains.
     *
     * @return the aggregated dashboard summary
     */
    CrossDomainSummaryDto getDashboardSummary();
    
    /**
     * Refresh data from all domains and regenerate the dashboard summary.
     *
     * @return the refreshed dashboard summary
     */
    CrossDomainSummaryDto refreshDashboardSummary();
    
    /**
     * Get the health status of all integrated domains.
     *
     * @return list of domain health status
     */
    List<DomainHealthDto> getDomainHealth();
    
    /**
     * Get the health status of a specific domain.
     *
     * @param domain the domain name
     * @return the health status of the domain
     */
    String getDomainHealth(String domain);
    
    /**
     * Get key performance indicators across all domains.
     *
     * @return map of domain to KPI values
     */
    Map<String, List<Map<String, Object>>> getCrossDomainKPIs();
    
    /**
     * Get cross-domain metrics that are relevant for business insights.
     *
     * @return map of insight categories to metric values
     */
    Map<String, List<Map<String, Object>>> getCrossDomainInsights();
    
    /**
     * Get metrics that show correlations across different domains.
     *
     * @return map of correlation types to metric relationships
     */
    Map<String, Object> getMetricCorrelations();
    
    /**
     * Get cross-domain summary information.
     *
     * @return the cross-domain summary
     */
    CrossDomainSummaryDto getCrossDomainSummary();
    
    /**
     * Get domain-specific metrics.
     *
     * @param domain the domain name
     * @return list of domain metrics
     */
    List<DashboardMetricDto> getDomainMetrics(String domain);
}
