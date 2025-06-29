package com.exalt.centralizeddashboard.core.transformation;

import com.exalt.centralizeddashboard.core.collection.DomainKPI;
import com.exalt.centralizeddashboard.core.collection.DomainMetric;

import java.util.List;

/**
 * Service responsible for normalizing data from different domains 
 * into a consistent format for the dashboard.
 */
public interface DataNormalizationService {
    
    /**
     * Normalize a list of domain metrics to ensure consistency.
     * This includes standardizing units, formats, and enriching with additional context.
     * 
     * @param metrics List of metrics to normalize
     * @return List of normalized metrics
     */
    List<DomainMetric> normalizeMetrics(List<DomainMetric> metrics);
    
    /**
     * Normalize a list of domain KPIs to ensure consistency.
     * This includes standardizing units, formats, and enriching with additional context.
     * 
     * @param kpis List of KPIs to normalize
     * @return List of normalized KPIs
     */
    List<DomainKPI> normalizeKPIs(List<DomainKPI> kpis);
    
    /**
     * Transform a metric value to a standardized format or unit.
     * 
     * @param value The original value
     * @param sourceUnit The source unit
     * @param targetUnit The target unit
     * @return The transformed value
     */
    Object transformValue(Object value, String sourceUnit, String targetUnit);
    
    /**
     * Enrich a metric with additional context or derived values.
     * 
     * @param metric The metric to enrich
     * @return The enriched metric
     */
    DomainMetric enrichMetric(DomainMetric metric);
    
    /**
     * Enrich a KPI with additional context or derived values.
     * 
     * @param kpi The KPI to enrich
     * @return The enriched KPI
     */
    DomainKPI enrichKPI(DomainKPI kpi);
    
    /**
     * Validate if a metric meets the normalization standards.
     * 
     * @param metric The metric to validate
     * @return true if the metric is valid, false otherwise
     */
    boolean validateMetric(DomainMetric metric);
    
    /**
     * Validate if a KPI meets the normalization standards.
     * 
     * @param kpi The KPI to validate
     * @return true if the KPI is valid, false otherwise
     */
    boolean validateKPI(DomainKPI kpi);
}