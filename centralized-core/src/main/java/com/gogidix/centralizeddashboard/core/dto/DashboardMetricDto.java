package com.gogidix.centralizeddashboard.core.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.gogidix.centralizeddashboard.core.model.DashboardMetric;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for DashboardMetric.
 * Used for API responses related to dashboard metrics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricDto {
    
    private Long id;
    private String metricName;
    private Double metricValue;
    private String metricUnit;
    private String sourceDomain;
    private String sourceService;
    private String region;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    private String dataPointType;
    private String tags;
    
    /**
     * Convert a DashboardMetric entity to a DashboardMetricDto.
     *
     * @param metric the dashboard metric entity
     * @return the dashboard metric DTO
     */
    public static DashboardMetricDto fromEntity(DashboardMetric metric) {
        return DashboardMetricDto.builder()
                .id(metric.getId())
                .metricName(metric.getMetricName())
                .metricValue(metric.getMetricValue())
                .metricUnit(metric.getMetricUnit())
                .sourceDomain(metric.getSourceDomain().toString())
                .sourceService(metric.getSourceService())
                .region(metric.getRegion())
                .timestamp(metric.getTimestamp())
                .dataPointType(metric.getDataPointType() != null ? metric.getDataPointType().toString() : null)
                .tags(metric.getTags())
                .build();
    }
}