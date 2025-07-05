package com.gogidix.centralizeddashboard.core.controller;

import com.gogidix.centralizeddashboard.core.dto.DashboardKPIDto;
import com.gogidix.centralizeddashboard.core.model.DashboardKPI;
import com.gogidix.centralizeddashboard.core.service.KPIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for KPI-related operations.
 */
@RestController
@RequestMapping("/api/dashboard/kpis")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "KPI API", description = "API endpoints for KPI management and retrieval")
public class KPIController {

    private final KPIService kpiService;

    /**
     * Calculate all KPIs based on the latest metrics.
     *
     * @return a response with the number of KPIs calculated
     */
    @PostMapping("/calculate/all")
    @Operation(summary = "Calculate all KPIs", 
               description = "Triggers calculation of all KPIs based on the latest metrics")
    public ResponseEntity<Integer> calculateAllKPIs() {
        log.info("REST request to calculate all KPIs");
        
        int count = kpiService.calculateAllKPIs();
        
        return ResponseEntity.ok(count);
    }

    /**
     * Calculate KPIs for a specific category.
     *
     * @param category the KPI category
     * @return a response with the list of KPIs calculated
     */
    @PostMapping("/calculate/category/{category}")
    @Operation(summary = "Calculate KPIs by category", 
               description = "Triggers calculation of KPIs for a specific category")
    public ResponseEntity<List<DashboardKPIDto>> calculateKPIsByCategory(
            @PathVariable @Parameter(description = "KPI category: FINANCIAL, OPERATIONAL, CUSTOMER, GROWTH, SUSTAINABILITY, EFFICIENCY, QUALITY") 
            String category) {
        
        log.info("REST request to calculate KPIs for category {}", category);
        
        try {
            DashboardKPI.KPICategory kpiCategory = DashboardKPI.KPICategory.valueOf(category.toUpperCase());
            List<DashboardKPI> kpis = kpiService.calculateKPIsByCategory(kpiCategory);
            List<DashboardKPIDto> dtos = kpis.stream()
                    .map(DashboardKPIDto::fromEntity)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            log.error("Invalid KPI category: {}", category, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get the latest value for a specific KPI.
     *
     * @param kpiName the name of the KPI
     * @return a response containing the KPI if found
     */
    @GetMapping("/latest/{kpiName}")
    @Operation(summary = "Get latest KPI value", 
               description = "Retrieves the latest value for a specific KPI")
    public ResponseEntity<DashboardKPIDto> getLatestKPI(
            @PathVariable @Parameter(description = "Name of the KPI") String kpiName) {
        
        log.info("REST request to get latest KPI for name: {}", kpiName);
        
        Optional<DashboardKPI> kpiOpt = kpiService.getLatestKPI(kpiName);
        
        return kpiOpt.map(kpi -> ResponseEntity.ok(DashboardKPIDto.fromEntity(kpi)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get KPIs by category.
     *
     * @param category the KPI category
     * @return a response with a list of KPIs in the specified category
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "Get KPIs by category", 
               description = "Retrieves KPIs for a specific category")
    public ResponseEntity<List<DashboardKPIDto>> getKPIsByCategory(
            @PathVariable @Parameter(description = "KPI category: FINANCIAL, OPERATIONAL, CUSTOMER, GROWTH, SUSTAINABILITY, EFFICIENCY, QUALITY") 
            String category) {
        
        log.info("REST request to get KPIs for category: {}", category);
        
        try {
            DashboardKPI.KPICategory kpiCategory = DashboardKPI.KPICategory.valueOf(category.toUpperCase());
            List<DashboardKPI> kpis = kpiService.getKPIsByCategory(kpiCategory);
            List<DashboardKPIDto> dtos = kpis.stream()
                    .map(DashboardKPIDto::fromEntity)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            log.error("Invalid KPI category: {}", category, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get KPIs for a specific region.
     *
     * @param region the region
     * @return a response with a list of KPIs for the specified region
     */
    @GetMapping("/region/{region}")
    @Operation(summary = "Get KPIs by region", 
               description = "Retrieves KPIs for a specific region")
    public ResponseEntity<List<DashboardKPIDto>> getKPIsByRegion(
            @PathVariable @Parameter(description = "Region name") String region) {
        
        log.info("REST request to get KPIs for region: {}", region);
        
        List<DashboardKPI> kpis = kpiService.getKPIsByRegion(region);
        List<DashboardKPIDto> dtos = kpis.stream()
                .map(DashboardKPIDto::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get KPIs with warning or critical status.
     *
     * @return a response with a list of KPIs that need attention
     */
    @GetMapping("/attention")
    @Operation(summary = "Get KPIs needing attention", 
               description = "Retrieves KPIs with warning or critical status that need attention")
    public ResponseEntity<List<DashboardKPIDto>> getKPIsNeedingAttention() {
        log.info("REST request to get KPIs needing attention");
        
        List<DashboardKPI> kpis = kpiService.getKPIsNeedingAttention();
        List<DashboardKPIDto> dtos = kpis.stream()
                .map(DashboardKPIDto::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get KPI trend over time.
     *
     * @param kpiName the name of the KPI
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return a response with a map of timestamps and KPI values
     */
    @GetMapping("/trend/{kpiName}")
    @Operation(summary = "Get KPI trend over time", 
               description = "Retrieves trend data for a specific KPI over a time period")
    public ResponseEntity<Map<String, Double>> getKPITrend(
            @PathVariable @Parameter(description = "Name of the KPI") String kpiName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            @Parameter(description = "Start time (ISO format)") LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            @Parameter(description = "End time (ISO format)") LocalDateTime endTime) {
        
        log.info("REST request to get trend for KPI {} from {} to {}", kpiName, startTime, endTime);
        
        Map<LocalDateTime, Double> trend = kpiService.getKPITrend(kpiName, startTime, endTime);
        
        // Convert LocalDateTime keys to ISO strings for JSON serialization
        Map<String, Double> responseMap = trend.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().toString(),
                        Map.Entry::getValue
                ));
        
        return ResponseEntity.ok(responseMap);
    }

    /**
     * Compare KPI values between regions.
     *
     * @param kpiName the name of the KPI
     * @param regions the list of regions to compare
     * @return a response with a map of regions and KPI values
     */
    @GetMapping("/compare/{kpiName}")
    @Operation(summary = "Compare KPI across regions", 
               description = "Compares KPI values between different regions")
    public ResponseEntity<Map<String, Double>> compareKPIAcrossRegions(
            @PathVariable @Parameter(description = "Name of the KPI") String kpiName,
            @RequestParam @Parameter(description = "List of regions to compare") List<String> regions) {
        
        log.info("REST request to compare KPI {} across regions: {}", kpiName, regions);
        
        Map<String, Double> comparison = kpiService.compareKPIAcrossRegions(kpiName, regions);
        
        return ResponseEntity.ok(comparison);
    }

    /**
     * Create or update a KPI definition.
     *
     * @param kpiDto the KPI data to save
     * @return a response with the saved KPI
     */
    @PostMapping
    @Operation(summary = "Create or update a KPI definition", 
               description = "Creates a new KPI or updates an existing one")
    public ResponseEntity<DashboardKPIDto> saveKPI(@RequestBody DashboardKPIDto kpiDto) {
        log.info("REST request to save KPI: {}", kpiDto.getKpiName());
        
        // Convert DTO to entity
        DashboardKPI kpi = convertDtoToEntity(kpiDto);
        
        // Save KPI
        DashboardKPI savedKpi = kpiService.saveKPI(kpi);
        
        // Convert saved entity back to DTO
        DashboardKPIDto savedDto = DashboardKPIDto.fromEntity(savedKpi);
        
        return ResponseEntity.ok(savedDto);
    }

    /**
     * Delete a KPI by ID.
     *
     * @param kpiId the ID of the KPI to delete
     * @return a response indicating success or failure
     */
    @DeleteMapping("/{kpiId}")
    @Operation(summary = "Delete a KPI", 
               description = "Deletes a KPI by its ID")
    public ResponseEntity<Boolean> deleteKPI(
            @PathVariable @Parameter(description = "ID of the KPI to delete") Long kpiId) {
        
        log.info("REST request to delete KPI with ID: {}", kpiId);
        
        boolean success = kpiService.deleteKPI(kpiId);
        
        if (success) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Convert a DTO to entity.
     *
     * @param dto the dashboard KPI DTO
     * @return the dashboard KPI entity
     */
    private DashboardKPI convertDtoToEntity(DashboardKPIDto dto) {
        DashboardKPI.KPIStatus status = null;
        if (dto.getKpiStatus() != null) {
            status = DashboardKPI.KPIStatus.valueOf(dto.getKpiStatus());
        }
        
        DashboardKPI.KPICategory category = null;
        if (dto.getKpiCategory() != null) {
            category = DashboardKPI.KPICategory.valueOf(dto.getKpiCategory());
        }
        
        DashboardKPI.CalculationPeriod period = null;
        if (dto.getCalculationPeriod() != null) {
            period = DashboardKPI.CalculationPeriod.valueOf(dto.getCalculationPeriod());
        }
        
        return DashboardKPI.builder()
                .id(dto.getId())
                .kpiName(dto.getKpiName())
                .kpiValue(dto.getKpiValue())
                .kpiUnit(dto.getKpiUnit())
                .targetValue(dto.getTargetValue())
                .minThreshold(dto.getMinThreshold())
                .maxThreshold(dto.getMaxThreshold())
                .kpiStatus(status)
                .kpiCategory(category)
                .calculationFormula(dto.getCalculationFormula())
                .calculationPeriod(period)
                .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now())
                .region(dto.getRegion())
                .description(dto.getDescription())
                .build();
    }
}