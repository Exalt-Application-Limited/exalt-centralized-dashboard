package com.gogidix.centralizeddashboard.metrics.repository;

import com.gogidix.centralizeddashboard.metrics.model.MetricType;
import com.gogidix.centralizeddashboard.metrics.model.PerformanceMetric;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for performance metrics
 */
@Repository
public interface PerformanceMetricRepository extends JpaRepository<PerformanceMetric, String> {

    /**
     * Find metrics by service name
     */
    List<PerformanceMetric> findByServiceName(String serviceName);
    
    /**
     * Find metrics by instance ID
     */
    List<PerformanceMetric> findByInstanceId(String instanceId);
    
    /**
     * Find metrics by metric type
     */
    List<PerformanceMetric> findByMetricType(MetricType metricType);
    
    /**
     * Find metrics by metric name
     */
    List<PerformanceMetric> findByMetricName(String metricName);
    
    /**
     * Find metrics by service name and metric name
     */
    List<PerformanceMetric> findByServiceNameAndMetricName(String serviceName, String metricName);
    
    /**
     * Find metrics by service name and instance ID
     */
    List<PerformanceMetric> findByServiceNameAndInstanceId(String serviceName, String instanceId);
    
    /**
     * Find metrics by service name and metric type
     */
    List<PerformanceMetric> findByServiceNameAndMetricType(String serviceName, MetricType metricType);
    
    /**
     * Find metrics by time range
     */
    List<PerformanceMetric> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    /**
     * Find metrics by service name and time range
     */
    List<PerformanceMetric> findByServiceNameAndTimestampBetween(
            String serviceName, LocalDateTime start, LocalDateTime end);
    
    /**
     * Find metrics by service name, metric name, and time range
     */
    List<PerformanceMetric> findByServiceNameAndMetricNameAndTimestampBetween(
            String serviceName, String metricName, LocalDateTime start, LocalDateTime end);
    
    /**
     * Find the latest metric values for a service name and metric name
     */
    @Query("SELECT m FROM PerformanceMetric m WHERE m.serviceName = ?1 AND m.metricName = ?2 " +
           "ORDER BY m.timestamp DESC")
    List<PerformanceMetric> findLatestByServiceNameAndMetricName(
            String serviceName, String metricName, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Get average metric value for a service name and metric name within a time range
     */
    @Query("SELECT AVG(m.value) FROM PerformanceMetric m WHERE m.serviceName = ?1 " +
           "AND m.metricName = ?2 AND m.timestamp BETWEEN ?3 AND ?4")
    Double getAverageValueByServiceNameAndMetricNameWithinTimeRange(
            String serviceName, String metricName, LocalDateTime start, LocalDateTime end);
    
    /**
     * Get maximum metric value for a service name and metric name within a time range
     */
    @Query("SELECT MAX(m.value) FROM PerformanceMetric m WHERE m.serviceName = ?1 " +
           "AND m.metricName = ?2 AND m.timestamp BETWEEN ?3 AND ?4")
    Double getMaxValueByServiceNameAndMetricNameWithinTimeRange(
            String serviceName, String metricName, LocalDateTime start, LocalDateTime end);
    
    /**
     * Get minimum metric value for a service name and metric name within a time range
     */
    @Query("SELECT MIN(m.value) FROM PerformanceMetric m WHERE m.serviceName = ?1 " +
           "AND m.metricName = ?2 AND m.timestamp BETWEEN ?3 AND ?4")
    Double getMinValueByServiceNameAndMetricNameWithinTimeRange(
            String serviceName, String metricName, LocalDateTime start, LocalDateTime end);
    
    /**
     * Delete metrics older than a specific time
     */
    void deleteByTimestampBefore(LocalDateTime timestamp);
} 