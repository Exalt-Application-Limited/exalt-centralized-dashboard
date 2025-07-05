package com.gogidix.centralizeddashboard.metrics.service;

import com.gogidix.centralizeddashboard.metrics.model.MetricType;
import com.gogidix.centralizeddashboard.metrics.model.PerformanceMetric;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Service interface for performance metrics operations
 */
public interface PerformanceMetricsService {

    /**
     * Record a new performance metric
     */
    PerformanceMetric recordMetric(String serviceName, String instanceId, MetricType metricType, 
            String metricName, Double value);
    
    /**
     * Record a new performance metric with tags
     */
    PerformanceMetric recordMetricWithTags(String serviceName, String instanceId, MetricType metricType, 
            String metricName, Double value, String tags);
    
    /**
     * Get metrics by service name
     */
    List<PerformanceMetric> getMetricsByServiceName(String serviceName);
    
    /**
     * Get metrics by instance ID
     */
    List<PerformanceMetric> getMetricsByInstanceId(String instanceId);
    
    /**
     * Get metrics by metric type
     */
    List<PerformanceMetric> getMetricsByMetricType(MetricType metricType);
    
    /**
     * Get metrics by metric name
     */
    List<PerformanceMetric> getMetricsByMetricName(String metricName);
    
    /**
     * Get metrics by service name and metric name
     */
    List<PerformanceMetric> getMetricsByServiceNameAndMetricName(String serviceName, String metricName);
    
    /**
     * Get metrics by time range
     */
    List<PerformanceMetric> getMetricsByTimeRange(LocalDateTime start, LocalDateTime end);
    
    /**
     * Get metrics by service name and time range
     */
    List<PerformanceMetric> getMetricsByServiceNameAndTimeRange(
            String serviceName, LocalDateTime start, LocalDateTime end);
    
    /**
     * Get metrics by service name, metric name, and time range
     */
    List<PerformanceMetric> getMetricsByServiceNameMetricNameAndTimeRange(
            String serviceName, String metricName, LocalDateTime start, LocalDateTime end);
    
    /**
     * Get the latest metric value for a service name and metric name
     */
    PerformanceMetric getLatestMetric(String serviceName, String metricName);
    
    /**
     * Get metrics statistics (min, max, avg) for a service name and metric name
     */
    Map<String, Double> getMetricsStatistics(
            String serviceName, String metricName, LocalDateTime start, LocalDateTime end);
    
    /**
     * Get metrics for all services grouped by service name
     */
    Map<String, List<PerformanceMetric>> getMetricsGroupedByService();
    
    /**
     * Get time series data for a specific metric
     */
    List<Map<String, Object>> getMetricTimeSeries(
            String serviceName, String metricName, LocalDateTime start, LocalDateTime end);
    
    /**
     * Prune old metrics to maintain database size
     */
    int pruneOldMetrics(LocalDateTime cutoffTime);
} 