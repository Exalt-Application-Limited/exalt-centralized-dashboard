package com.gogidix.centralizeddashboard.analytics.aggregation.service;

import com.gogidix.centralizeddashboard.analytics.aggregation.model.AggregatedMetric;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.MetricType;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.TimeGranularity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Service interface for data aggregation operations
 */
public interface DataAggregationService {

    /**
     * Store a new aggregated metric
     */
    AggregatedMetric storeMetric(AggregatedMetric metric);
    
    /**
     * Create and store a new aggregated metric
     */
    AggregatedMetric createMetric(MetricType metricType, String name, String dimension, 
            Double value, LocalDateTime startTime, LocalDateTime endTime, 
            TimeGranularity granularity);
    
    /**
     * Find metrics by type
     */
    List<AggregatedMetric> findMetricsByType(MetricType metricType);
    
    /**
     * Find metrics by name
     */
    List<AggregatedMetric> findMetricsByName(String name);
    
    /**
     * Find metrics by dimension
     */
    List<AggregatedMetric> findMetricsByDimension(String dimension);
    
    /**
     * Find metrics by name and dimension
     */
    List<AggregatedMetric> findMetricsByNameAndDimension(String name, String dimension);
    
    /**
     * Find metrics by time range
     */
    List<AggregatedMetric> findMetricsByTimeRange(LocalDateTime start, LocalDateTime end);
    
    /**
     * Find metrics by name and time range
     */
    List<AggregatedMetric> findMetricsByNameAndTimeRange(
            String name, LocalDateTime start, LocalDateTime end);
    
    /**
     * Find metrics by name, dimension, and time range
     */
    List<AggregatedMetric> findMetricsByNameDimensionAndTimeRange(
            String name, String dimension, LocalDateTime start, LocalDateTime end);
    
    /**
     * Find metrics by granularity
     */
    List<AggregatedMetric> findMetricsByGranularity(TimeGranularity granularity);
    
    /**
     * Find metrics by name, dimension, and granularity
     */
    List<AggregatedMetric> findMetricsByNameDimensionAndGranularity(
            String name, String dimension, TimeGranularity granularity);
    
    /**
     * Find metrics by time range and granularity
     */
    List<AggregatedMetric> findMetricsByTimeRangeAndGranularity(
            LocalDateTime start, LocalDateTime end, TimeGranularity granularity);
    
    /**
     * Get metrics as a time series (for charting)
     */
    Map<String, List<Object[]>> getMetricsTimeSeries(
            String name, String dimension, LocalDateTime start, LocalDateTime end, 
            TimeGranularity granularity);
    
    /**
     * Aggregate data for a specific time period and granularity
     */
    void aggregateData(LocalDateTime start, LocalDateTime end, TimeGranularity granularity);
    
    /**
     * Aggregate user activity metrics
     */
    void aggregateUserActivityMetrics(LocalDateTime start, LocalDateTime end, TimeGranularity granularity);
    
    /**
     * Aggregate e-commerce metrics
     */
    void aggregateEcommerceMetrics(LocalDateTime start, LocalDateTime end, TimeGranularity granularity);
    
    /**
     * Aggregate performance metrics
     */
    void aggregatePerformanceMetrics(LocalDateTime start, LocalDateTime end, TimeGranularity granularity);
    
    /**
     * Prune old metrics data
     */
    int pruneOldMetrics(LocalDateTime cutoffDate);
} 