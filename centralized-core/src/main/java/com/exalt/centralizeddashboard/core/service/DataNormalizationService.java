package com.exalt.centralizeddashboard.core.service;

import com.exalt.centralizeddashboard.core.model.DashboardMetric;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service interface for normalizing data from different domains
 * to ensure consistency in metrics, units, and data formats.
 */
public interface DataNormalizationService {

    /**
     * Normalize a list of metrics from any domain to ensure consistent
     * naming, units, and data formats.
     *
     * @param metrics the raw metrics to normalize
     * @return the normalized metrics
     */
    List<DashboardMetric> normalizeMetrics(List<DashboardMetric> metrics);
    
    /**
     * Convert units for metrics to a standardized unit system.
     * For example, convert all currency to USD, all weights to kg, etc.
     *
     * @param metric the metric to standardize units for
     * @return the metric with standardized units
     */
    DashboardMetric standardizeUnits(DashboardMetric metric);
    
    /**
     * Normalize metric names across domains to use a consistent naming convention.
     *
     * @param metric the metric to normalize names for
     * @return the metric with normalized name
     */
    DashboardMetric normalizeMetricNames(DashboardMetric metric);
    
    /**
     * Validate metric data to ensure it meets quality standards.
     * Metrics that fail validation may be flagged or filtered out.
     *
     * @param metric the metric to validate
     * @return true if the metric is valid, false otherwise
     */
    boolean validateMetric(DashboardMetric metric);
}
