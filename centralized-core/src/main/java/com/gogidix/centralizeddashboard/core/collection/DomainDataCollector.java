package com.gogidix.centralizeddashboard.core.collection;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Base interface for all domain-specific data collectors.
 * Each domain (Social Commerce, Warehousing, Courier Services) will implement this interface
 * to provide standardized data collection capabilities.
 */
public interface DomainDataCollector {
    
    /**
     * Returns the name of the domain this collector is responsible for.
     * 
     * @return The domain name (e.g., "SOCIAL_COMMERCE", "WAREHOUSING", "COURIER_SERVICES")
     */
    String getDomainName();
    
    /**
     * Collect the latest metrics from this domain.
     * 
     * @return A list of collected metrics
     */
    List<DomainMetric> collectMetrics();
    
    /**
     * Collect metrics for a specific time period.
     * 
     * @param from Start timestamp (inclusive)
     * @param to End timestamp (exclusive)
     * @return A list of collected metrics for the specified time period
     */
    List<DomainMetric> collectMetricsForPeriod(LocalDateTime from, LocalDateTime to);
    
    /**
     * Collect specific metrics by their keys.
     * 
     * @param metricKeys List of metric keys to collect
     * @return A list of collected metrics matching the specified keys
     */
    List<DomainMetric> collectSpecificMetrics(List<String> metricKeys);
    
    /**
     * Collect the latest KPIs from this domain.
     * 
     * @return A list of KPIs
     */
    List<DomainKPI> collectKPIs();
    
    /**
     * Check if this domain collector is currently able to collect data.
     * 
     * @return true if the collector is healthy and can collect data, false otherwise
     */
    boolean isHealthy();
    
    /**
     * Get the health status of this domain collector with details.
     * 
     * @return A map containing health status details
     */
    Map<String, Object> getHealthStatus();
    
    /**
     * Get the timestamp of the last successful data collection.
     * 
     * @return The timestamp of the last successful collection, or null if no successful collection yet
     */
    LocalDateTime getLastCollectionTimestamp();
    
    /**
     * Get the timestamp when data was last updated in the source domain.
     * 
     * @return The timestamp of the last data update in the source domain
     */
    LocalDateTime getLastDataUpdateTimestamp();
}
