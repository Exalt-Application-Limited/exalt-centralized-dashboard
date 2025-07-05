package com.gogidix.centralizeddashboard.analytics.aggregation.repository;

import com.gogidix.centralizeddashboard.analytics.aggregation.model.AggregatedMetric;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.MetricType;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.TimeGranularity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for aggregated metrics
 */
@Repository
public interface AggregatedMetricRepository extends JpaRepository<AggregatedMetric, String> {

    /**
     * Find metrics by type
     */
    List<AggregatedMetric> findByMetricType(MetricType metricType);
    
    /**
     * Find metrics by name
     */
    List<AggregatedMetric> findByName(String name);
    
    /**
     * Find metrics by dimension
     */
    List<AggregatedMetric> findByDimension(String dimension);
    
    /**
     * Find metrics by granularity
     */
    List<AggregatedMetric> findByGranularity(TimeGranularity granularity);
    
    /**
     * Find metrics with start time in a range
     */
    List<AggregatedMetric> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
    
    /**
     * Find metrics with end time in a range
     */
    List<AggregatedMetric> findByEndTimeBetween(LocalDateTime start, LocalDateTime end);
    
    /**
     * Find metrics by name and dimension
     */
    List<AggregatedMetric> findByNameAndDimension(String name, String dimension);
    
    /**
     * Find metrics by name and time range
     */
    List<AggregatedMetric> findByNameAndStartTimeBetween(String name, LocalDateTime start, LocalDateTime end);
    
    /**
     * Find metrics by name, dimension, and time range
     */
    List<AggregatedMetric> findByNameAndDimensionAndStartTimeBetween(
            String name, String dimension, LocalDateTime start, LocalDateTime end);
    
    /**
     * Find metrics by name, dimension, and granularity
     */
    List<AggregatedMetric> findByNameAndDimensionAndGranularity(
            String name, String dimension, TimeGranularity granularity);
    
    /**
     * Find all metrics for a specific time range and granularity
     */
    List<AggregatedMetric> findByStartTimeBetweenAndGranularity(
            LocalDateTime start, LocalDateTime end, TimeGranularity granularity);
    
    /**
     * Find all metrics for a specific name, time range, and granularity
     */
    List<AggregatedMetric> findByNameAndStartTimeBetweenAndGranularity(
            String name, LocalDateTime start, LocalDateTime end, TimeGranularity granularity);
            
    /**
     * Find metrics by name, dimension, start time between, and granularity
     */
    List<AggregatedMetric> findByNameAndDimensionAndStartTimeBetweenAndGranularity(
            String name, String dimension, LocalDateTime start, LocalDateTime end, TimeGranularity granularity);
            
    /**
     * Find metrics with end time before a given time
     */
    List<AggregatedMetric> findByEndTimeBefore(LocalDateTime end);
} 