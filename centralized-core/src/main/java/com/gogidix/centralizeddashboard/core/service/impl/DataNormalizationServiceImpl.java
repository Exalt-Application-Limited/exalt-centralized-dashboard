package com.gogidix.centralizeddashboard.core.service.impl;

import com.gogidix.centralizeddashboard.core.model.DashboardMetric;
import com.gogidix.centralizeddashboard.core.service.DataNormalizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of the DataNormalizationService.
 * Provides functionality for normalizing metrics from different domains
 * to ensure consistency across the dashboard.
 */
@Service("metricDataNormalizationService")
@RequiredArgsConstructor
@Slf4j
public class DataNormalizationServiceImpl implements DataNormalizationService {

    @Override
    public List<DashboardMetric> normalizeMetrics(List<DashboardMetric> metrics) {
        log.info("Normalizing {} metrics", metrics.size());
        List<DashboardMetric> normalizedMetrics = new ArrayList<>();
        
        for (DashboardMetric metric : metrics) {
            if (!validateMetric(metric)) {
                log.warn("Skipping invalid metric: {}", metric.getMetricName());
                continue;
            }
            
            // Normalize the metric name first
            DashboardMetric metricWithNormalizedName = normalizeMetricNames(metric);
            
            // Then standardize the units
            DashboardMetric normalizedMetric = standardizeUnits(metricWithNormalizedName);
            
            normalizedMetrics.add(normalizedMetric);
        }
        
        log.info("Successfully normalized {} metrics", normalizedMetrics.size());
        return normalizedMetrics;
    }

    @Override
    public DashboardMetric standardizeUnits(DashboardMetric metric) {
        // TO BE IMPLEMENTED
        return metric;
    }

    @Override
    public DashboardMetric normalizeMetricNames(DashboardMetric metric) {
        // TO BE IMPLEMENTED
        return metric;
    }

    @Override
    public boolean validateMetric(DashboardMetric metric) {
        // Check for null metric
        if (metric == null) {
            log.warn("Null metric encountered during validation");
            return false;
        }
        
        // Validate metric name
        if (metric.getMetricName() == null || metric.getMetricName().trim().isEmpty()) {
            log.warn("Metric has null or empty name");
            return false;
        }
        
        // Validate source domain
        if (metric.getSourceDomain() == null) {
            log.warn("Metric {} has null source domain", metric.getMetricName());
            return false;
        }
        
        // Validate metric value
        if (metric.getMetricValue() == null) {
            log.warn("Metric {} has null value", metric.getMetricName());
            return false;
        }
        
        // Additional validation for specific metric types could be added here
        
        return true;
    }
}
