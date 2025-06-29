package com.exalt.centralizeddashboard.core.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.exalt.centralizeddashboard.core.model.DashboardKPI;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for DashboardKPI.
 * Used for API responses related to dashboard KPIs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardKPIDto {
    
    private Long id;
    private String kpiName;
    private Double kpiValue;
    private String kpiUnit;
    private Double targetValue;
    private Double minThreshold;
    private Double maxThreshold;
    private String kpiStatus;
    private String kpiCategory;
    private String calculationFormula;
    private String calculationPeriod;
    private String sourceDomain;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    private String region;
    private String description;
    private LocalDateTime lastUpdated;
    
    /**
     * Convert a DashboardKPI entity to a DashboardKPIDto.
     *
     * @param kpi the dashboard KPI entity
     * @return the dashboard KPI DTO
     */
    public static DashboardKPIDto fromEntity(DashboardKPI kpi) {
        return DashboardKPIDto.builder()
                .id(kpi.getId())
                .kpiName(kpi.getKpiName())
                .kpiValue(kpi.getKpiValue())
                .kpiUnit(kpi.getKpiUnit())
                .targetValue(kpi.getTargetValue())
                .minThreshold(kpi.getMinThreshold())
                .maxThreshold(kpi.getMaxThreshold())
                .kpiStatus(kpi.getKpiStatus() != null ? kpi.getKpiStatus().toString() : null)
                .kpiCategory(kpi.getKpiCategory() != null ? kpi.getKpiCategory().toString() : null)
                .calculationFormula(kpi.getCalculationFormula())
                .calculationPeriod(kpi.getCalculationPeriod() != null ? kpi.getCalculationPeriod().toString() : null)
                .timestamp(kpi.getTimestamp())
                .region(kpi.getRegion())
                .description(kpi.getDescription())
                .build();
    }
}