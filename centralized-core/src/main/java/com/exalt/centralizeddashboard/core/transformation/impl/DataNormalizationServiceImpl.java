package com.exalt.centralizeddashboard.core.transformation.impl;

import com.exalt.centralizeddashboard.core.collection.DomainKPI;
import com.exalt.centralizeddashboard.core.collection.DomainMetric;
import com.exalt.centralizeddashboard.core.collection.DomainMetric.MetricDataType;
import com.exalt.centralizeddashboard.core.transformation.DataNormalizationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * Implementation of the DataNormalizationService.
 * Standardizes and enriches data from different domains for the dashboard.
 */
@Service("transformationDataNormalizationService")
@Slf4j
public class DataNormalizationServiceImpl implements DataNormalizationService {

    // Define standard units for metric categories
    private static final Map<String, String> STANDARD_UNITS = new HashMap<>();
    
    // Define conversion functions for unit transformations
    private static final Map<String, Map<String, Function<Object, Object>>> UNIT_CONVERTERS = new HashMap<>();
    
    static {
        // Initialize standard units
        STANDARD_UNITS.put("Sales", "CURRENCY");
        STANDARD_UNITS.put("Revenue", "CURRENCY");
        STANDARD_UNITS.put("Time", "SECONDS");
        STANDARD_UNITS.put("Efficiency", "PERCENTAGE");
        STANDARD_UNITS.put("Performance", "SCORE");
        STANDARD_UNITS.put("Count", "COUNT");
        
        // Initialize unit converters
        Map<String, Function<Object, Object>> timeConverters = new HashMap<>();
        timeConverters.put("MINUTES_TO_SECONDS", value -> {
            if (value instanceof Number) {
                return ((Number) value).doubleValue() * 60;
            }
            return value;
        });
        timeConverters.put("HOURS_TO_SECONDS", value -> {
            if (value instanceof Number) {
                return ((Number) value).doubleValue() * 3600;
            }
            return value;
        });
        timeConverters.put("DAYS_TO_SECONDS", value -> {
            if (value instanceof Number) {
                return ((Number) value).doubleValue() * 86400;
            }
            return value;
        });
        
        UNIT_CONVERTERS.put("TIME", timeConverters);
    }
    
    @Override
    public List<DomainMetric> normalizeMetrics(List<DomainMetric> metrics) {
        log.debug("Normalizing {} metrics", metrics.size());
        
        List<DomainMetric> normalizedMetrics = new ArrayList<>();
        
        for (DomainMetric metric : metrics) {
            if (!validateMetric(metric)) {
                log.warn("Skipping invalid metric: {}", metric.getMetricId());
                continue;
            }
            
            // Standardize units if needed
            String category = metric.getCategory();
            String currentUnit = metric.getUnit();
            String standardUnit = getStandardUnitForCategory(category);
            
            if (standardUnit != null && !standardUnit.equals(currentUnit)) {
                Object normalizedValue = transformValue(metric.getValue(), currentUnit, standardUnit);
                metric.setValue(normalizedValue);
                metric.setUnit(standardUnit);
            }
            
            // Enrich metric with additional context
            DomainMetric enrichedMetric = enrichMetric(metric);
            normalizedMetrics.add(enrichedMetric);
        }
        
        log.debug("Normalized {} metrics successfully", normalizedMetrics.size());
        return normalizedMetrics;
    }

    @Override
    public List<DomainKPI> normalizeKPIs(List<DomainKPI> kpis) {
        log.debug("Normalizing {} KPIs", kpis.size());
        
        List<DomainKPI> normalizedKPIs = new ArrayList<>();
        
        for (DomainKPI kpi : kpis) {
            if (!validateKPI(kpi)) {
                log.warn("Skipping invalid KPI: {}", kpi.getKpiId());
                continue;
            }
            
            // Standardize units if needed
            String category = kpi.getCategory();
            String currentUnit = kpi.getUnit();
            String standardUnit = getStandardUnitForCategory(category);
            
            if (standardUnit != null && !standardUnit.equals(currentUnit)) {
                Object normalizedValue = transformValue(kpi.getValue(), currentUnit, standardUnit);
                kpi.setValue(normalizedValue);
                kpi.setUnit(standardUnit);
                
                // Also normalize target value
                Object normalizedTarget = transformValue(kpi.getTargetValue(), currentUnit, standardUnit);
                kpi.setTargetValue(normalizedTarget);
            }
            
            // Enrich KPI with additional context
            DomainKPI enrichedKPI = enrichKPI(kpi);
            normalizedKPIs.add(enrichedKPI);
        }
        
        log.debug("Normalized {} KPIs successfully", normalizedKPIs.size());
        return normalizedKPIs;
    }

    @Override
    public Object transformValue(Object value, String sourceUnit, String targetUnit) {
        if (value == null) {
            return null;
        }
        
        // Check for direct unit match
        if (sourceUnit.equals(targetUnit)) {
            return value;
        }
        
        // Find conversion category and function
        String conversionKey = sourceUnit + "_TO_" + targetUnit;
        
        for (Map.Entry<String, Map<String, Function<Object, Object>>> entry : UNIT_CONVERTERS.entrySet()) {
            Map<String, Function<Object, Object>> converters = entry.getValue();
            if (converters.containsKey(conversionKey)) {
                Function<Object, Object> converter = converters.get(conversionKey);
                return converter.apply(value);
            }
        }
        
        // If no converter found, return original value and log warning
        log.warn("No converter found for {} to {}", sourceUnit, targetUnit);
        return value;
    }

    @Override
    public DomainMetric enrichMetric(DomainMetric metric) {
        // Ensure metric has all required fields
        if (metric.getCollectionTimestamp() == null) {
            metric.setCollectionTimestamp(java.time.LocalDateTime.now());
        }
        
        if (metric.getSourceTimestamp() == null) {
            metric.setSourceTimestamp(metric.getCollectionTimestamp());
        }
        
        // Add enrichment logic here
        // For example, add derived attributes based on metric value
        if (metric.getCategory() != null && metric.getCategory().equals("Sales")) {
            Map<String, Object> attributes = metric.getAttributes();
            if (attributes == null) {
                attributes = new HashMap<>();
                metric.setAttributes(attributes);
            }
            
            // Add quarter information
            int month = metric.getSourceTimestamp().getMonthValue();
            int quarter = (month - 1) / 3 + 1;
            attributes.put("quarter", "Q" + quarter);
            
            // Add fiscal year
            int year = metric.getSourceTimestamp().getYear();
            attributes.put("fiscalYear", String.valueOf(year));
        }
        
        return metric;
    }

    @Override
    public DomainKPI enrichKPI(DomainKPI kpi) {
        // Ensure KPI has all required fields
        if (kpi.getCollectionTimestamp() == null) {
            kpi.setCollectionTimestamp(java.time.LocalDateTime.now());
        }
        
        if (kpi.getSourceTimestamp() == null) {
            kpi.setSourceTimestamp(kpi.getCollectionTimestamp());
        }
        
        // Add enrichment logic for KPIs
        // For example, calculate status based on thresholds if not already set
        if (kpi.getStatus() == null && kpi.getThresholds() != null && 
            kpi.getValue() instanceof Number && kpi.getTargetValue() instanceof Number) {
            
            double value = ((Number) kpi.getValue()).doubleValue();
            double target = ((Number) kpi.getTargetValue()).doubleValue();
            DomainKPI.KPIThresholds thresholds = kpi.getThresholds();
            
            DomainKPI.KPIStatus status;
            if (thresholds.isHigherIsBetter()) {
                // For higher is better metrics
                double excellentThreshold = thresholds.getExcellentThreshold() instanceof Number ? 
                        ((Number) thresholds.getExcellentThreshold()).doubleValue() : Double.MAX_VALUE;
                double goodThreshold = thresholds.getGoodThreshold() instanceof Number ? 
                        ((Number) thresholds.getGoodThreshold()).doubleValue() : Double.MAX_VALUE;
                double warningThreshold = thresholds.getWarningThreshold() instanceof Number ? 
                        ((Number) thresholds.getWarningThreshold()).doubleValue() : 0;
                
                if (value >= excellentThreshold) {
                    status = DomainKPI.KPIStatus.EXCELLENT;
                } else if (value >= goodThreshold) {
                    status = DomainKPI.KPIStatus.GOOD;
                } else if (value >= warningThreshold) {
                    status = DomainKPI.KPIStatus.WARNING;
                } else {
                    status = DomainKPI.KPIStatus.CRITICAL;
                }
            } else {
                // For lower is better metrics
                double excellentThreshold = thresholds.getExcellentThreshold() instanceof Number ? 
                        ((Number) thresholds.getExcellentThreshold()).doubleValue() : 0;
                double goodThreshold = thresholds.getGoodThreshold() instanceof Number ? 
                        ((Number) thresholds.getGoodThreshold()).doubleValue() : 0;
                double warningThreshold = thresholds.getWarningThreshold() instanceof Number ? 
                        ((Number) thresholds.getWarningThreshold()).doubleValue() : Double.MAX_VALUE;
                
                if (value <= excellentThreshold) {
                    status = DomainKPI.KPIStatus.EXCELLENT;
                } else if (value <= goodThreshold) {
                    status = DomainKPI.KPIStatus.GOOD;
                } else if (value <= warningThreshold) {
                    status = DomainKPI.KPIStatus.WARNING;
                } else {
                    status = DomainKPI.KPIStatus.CRITICAL;
                }
            }
            
            kpi.setStatus(status);
        }
        
        // Add trend information if not already set
        if (kpi.getTrend() == null && kpi.getChangePercentage() != null) {
            double changePercentage = kpi.getChangePercentage();
            if (changePercentage > 0) {
                kpi.setTrend(DomainMetric.TrendDirection.UP);
            } else if (changePercentage < 0) {
                kpi.setTrend(DomainMetric.TrendDirection.DOWN);
            } else {
                kpi.setTrend(DomainMetric.TrendDirection.UNCHANGED);
            }
        }
        
        return kpi;
    }

    @Override
    public boolean validateMetric(DomainMetric metric) {
        // Check for required fields
        if (metric.getMetricId() == null || metric.getMetricId().trim().isEmpty()) {
            log.error("Metric missing required field: metricId");
            return false;
        }
        
        if (metric.getDomain() == null || metric.getDomain().trim().isEmpty()) {
            log.error("Metric missing required field: domain - {}", metric.getMetricId());
            return false;
        }
        
        if (metric.getName() == null || metric.getName().trim().isEmpty()) {
            log.error("Metric missing required field: name - {}", metric.getMetricId());
            return false;
        }
        
        if (metric.getValue() == null) {
            log.error("Metric missing required field: value - {}", metric.getMetricId());
            return false;
        }
        
        // Validate data type
        if (metric.getDataType() != null) {
            boolean isValid = validateDataType(metric.getValue(), metric.getDataType());
            if (!isValid) {
                log.error("Metric has invalid data type: {} - {}", 
                        metric.getDataType(), metric.getMetricId());
                return false;
            }
        }
        
        return true;
    }

    @Override
    public boolean validateKPI(DomainKPI kpi) {
        // Check for required fields
        if (kpi.getKpiId() == null || kpi.getKpiId().trim().isEmpty()) {
            log.error("KPI missing required field: kpiId");
            return false;
        }
        
        if (kpi.getDomain() == null || kpi.getDomain().trim().isEmpty()) {
            log.error("KPI missing required field: domain - {}", kpi.getKpiId());
            return false;
        }
        
        if (kpi.getName() == null || kpi.getName().trim().isEmpty()) {
            log.error("KPI missing required field: name - {}", kpi.getKpiId());
            return false;
        }
        
        if (kpi.getValue() == null) {
            log.error("KPI missing required field: value - {}", kpi.getKpiId());
            return false;
        }
        
        // Validate data type
        if (kpi.getDataType() != null) {
            boolean isValid = validateDataType(kpi.getValue(), kpi.getDataType());
            if (!isValid) {
                log.error("KPI has invalid data type: {} - {}", 
                        kpi.getDataType(), kpi.getKpiId());
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Get the standard unit for a category.
     * 
     * @param category The metric/KPI category
     * @return The standard unit for the category, or null if no standard defined
     */
    private String getStandardUnitForCategory(String category) {
        return STANDARD_UNITS.get(category);
    }
    
    /**
     * Validate that a value matches the expected data type.
     * 
     * @param value The value to validate
     * @param dataType The expected data type
     * @return true if valid, false otherwise
     */
    private boolean validateDataType(Object value, MetricDataType dataType) {
        if (value == null) {
            return false;
        }
        
        switch (dataType) {
            case INTEGER:
                return value instanceof Integer || value instanceof Long;
            case DOUBLE:
                return value instanceof Double || value instanceof Float || 
                       value instanceof Integer || value instanceof Long;
            case STRING:
                return value instanceof String;
            case BOOLEAN:
                return value instanceof Boolean;
            case TIMESTAMP:
                return value instanceof java.time.temporal.Temporal;
            case DURATION:
                return value instanceof java.time.Duration;
            case JSON:
                return value instanceof Map || value instanceof String;
            case ARRAY:
                return value instanceof List || value instanceof Object[];
            default:
                return false;
        }
    }
}