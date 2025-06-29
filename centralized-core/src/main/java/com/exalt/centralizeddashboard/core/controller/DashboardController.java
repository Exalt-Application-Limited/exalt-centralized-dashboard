package com.exalt.centralizeddashboard.core.controller;

import com.exalt.centralizeddashboard.core.dto.DashboardKPIDto;
import com.exalt.centralizeddashboard.core.dto.DashboardMetricDto;
import com.exalt.centralizeddashboard.core.model.DashboardKPI;
import com.exalt.centralizeddashboard.core.model.DashboardMetric;
import com.exalt.centralizeddashboard.core.service.KPIService;
import com.exalt.centralizeddashboard.core.service.MetricCollectorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * REST controller for the main dashboard operations.
 * Provides aggregated data from various sources for the dashboard UI.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Dashboard API", description = "Main API endpoints for the centralized dashboard")
public class DashboardController {

    private final KPIService kpiService;
    private final MetricCollectorService metricCollectorService;

    /**
     * Get dashboard summary containing latest KPIs and metrics.
     *
     * @return a response with a map containing the dashboard summary data
     */
    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary", 
               description = "Retrieves a summary of all key metrics and KPIs for the dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        log.info("REST request to get dashboard summary");
        
        Map<String, Object> summary = new HashMap<>();
        
        // Get KPIs needing attention (WARNING or CRITICAL status)
        List<DashboardKPI> attentionKPIs = kpiService.getKPIsNeedingAttention();
        List<DashboardKPIDto> attentionKPIDtos = attentionKPIs.stream()
                .map(DashboardKPIDto::fromEntity)
                .collect(Collectors.toList());
        summary.put("attentionKPIs", attentionKPIDtos);
        
        // Get latest KPIs for each category
        Map<String, List<DashboardKPIDto>> kpisByCategory = new HashMap<>();
        for (DashboardKPI.KPICategory category : DashboardKPI.KPICategory.values()) {
            List<DashboardKPI> kpis = kpiService.getKPIsByCategory(category);
            if (!kpis.isEmpty()) {
                List<DashboardKPIDto> kpiDtos = kpis.stream()
                        .map(DashboardKPIDto::fromEntity)
                        .collect(Collectors.toList());
                kpisByCategory.put(category.toString(), kpiDtos);
            }
        }
        summary.put("kpisByCategory", kpisByCategory);
        
        // Get metrics by domain
        Map<String, List<DashboardMetricDto>> metricsByDomain = new HashMap<>();
        
        // Trigger collection of fresh metrics
        Map<DashboardMetric.SourceDomain, Integer> collectionResult = metricCollectorService.collectAllDomainMetrics();
        summary.put("metricsCollected", collectionResult);
        
        return ResponseEntity.ok(summary);
    }

    /**
     * Get courier services dashboard with relevant KPIs and metrics.
     *
     * @return a response with a map containing courier services data
     */
    @GetMapping("/courier-services")
    @Operation(summary = "Get Courier Services dashboard", 
               description = "Retrieves dashboard data specific to the Courier Services domain")
    public ResponseEntity<Map<String, Object>> getCourierServicesDashboard() {
        log.info("REST request to get Courier Services dashboard");
        
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Collect fresh metrics from Courier Services domain
        List<DashboardMetric> metrics = metricCollectorService.collectCourierServicesMetrics();
        List<DashboardMetricDto> metricDtos = metrics.stream()
                .map(DashboardMetricDto::fromEntity)
                .collect(Collectors.toList());
        
        // Group metrics by service level (HQ Admin, Regional Admin, etc.)
        Map<String, List<DashboardMetricDto>> metricsByService = metricDtos.stream()
                .collect(Collectors.groupingBy(
                        dto -> dto.getSourceService() != null ? dto.getSourceService() : "Unknown"
                ));
        
        dashboardData.put("metricsByService", metricsByService);
        
        // Group metrics by region for regional analysis
        Map<String, List<DashboardMetricDto>> metricsByRegion = metricDtos.stream()
                .filter(dto -> dto.getRegion() != null)
                .collect(Collectors.groupingBy(DashboardMetricDto::getRegion));
        
        dashboardData.put("metricsByRegion", metricsByRegion);
        
        // Get efficiency KPIs for Courier Services
        List<DashboardKPI> efficiencyKPIs = kpiService.getKPIsByCategory(DashboardKPI.KPICategory.EFFICIENCY);
        List<DashboardKPIDto> efficiencyKPIDtos = efficiencyKPIs.stream()
                .map(DashboardKPIDto::fromEntity)
                .collect(Collectors.toList());
        
        dashboardData.put("efficiencyKPIs", efficiencyKPIDtos);
        
        // Get operational KPIs for Courier Services
        List<DashboardKPI> operationalKPIs = kpiService.getKPIsByCategory(DashboardKPI.KPICategory.OPERATIONAL);
        List<DashboardKPIDto> operationalKPIDtos = operationalKPIs.stream()
                .map(DashboardKPIDto::fromEntity)
                .collect(Collectors.toList());
        
        dashboardData.put("operationalKPIs", operationalKPIDtos);
        
        return ResponseEntity.ok(dashboardData);
    }

    /**
     * Get social commerce dashboard with relevant KPIs and metrics.
     *
     * @return a response with a map containing social commerce data
     */
    @GetMapping("/social-commerce")
    @Operation(summary = "Get Social Commerce dashboard", 
               description = "Retrieves dashboard data specific to the Social Commerce domain")
    public ResponseEntity<Map<String, Object>> getSocialCommerceDashboard() {
        log.info("REST request to get Social Commerce dashboard");
        
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Collect fresh metrics from Social Commerce domain
        List<DashboardMetric> metrics = metricCollectorService.collectSocialCommerceMetrics();
        List<DashboardMetricDto> metricDtos = metrics.stream()
                .map(DashboardMetricDto::fromEntity)
                .collect(Collectors.toList());
        
        dashboardData.put("metrics", metricDtos);
        
        // TODO: Add more Social Commerce specific data
        
        return ResponseEntity.ok(dashboardData);
    }

    /**
     * Get warehousing dashboard with relevant KPIs and metrics.
     *
     * @return a response with a map containing warehousing data
     */
    @GetMapping("/warehousing")
    @Operation(summary = "Get Warehousing dashboard", 
               description = "Retrieves dashboard data specific to the Warehousing domain")
    public ResponseEntity<Map<String, Object>> getWarehousingDashboard() {
        log.info("REST request to get Warehousing dashboard");
        
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Collect fresh metrics from Warehousing domain
        List<DashboardMetric> metrics = metricCollectorService.collectWarehousingMetrics();
        List<DashboardMetricDto> metricDtos = metrics.stream()
                .map(DashboardMetricDto::fromEntity)
                .collect(Collectors.toList());
        
        dashboardData.put("metrics", metricDtos);
        
        // TODO: Add more Warehousing specific data
        
        return ResponseEntity.ok(dashboardData);
    }

    /**
     * Get cross-domain analytics for executive dashboard.
     *
     * @return a response with a map containing cross-domain analytics
     */
    @GetMapping("/executive")
    @Operation(summary = "Get executive dashboard", 
               description = "Retrieves dashboard data designed for executive-level overview")
    public ResponseEntity<Map<String, Object>> getExecutiveDashboard() {
        log.info("REST request to get executive dashboard");
        
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Get financial KPIs for executive view
        List<DashboardKPI> financialKPIs = kpiService.getKPIsByCategory(DashboardKPI.KPICategory.FINANCIAL);
        List<DashboardKPIDto> financialKPIDtos = financialKPIs.stream()
                .map(DashboardKPIDto::fromEntity)
                .collect(Collectors.toList());
        
        dashboardData.put("financialKPIs", financialKPIDtos);
        
        // Get metrics collection status
        Map<DashboardMetric.SourceDomain, Integer> collectionStatus = metricCollectorService.collectAllDomainMetrics();
        dashboardData.put("domainMetricsCount", collectionStatus);
        
        // Get all KPIs needing attention
        List<DashboardKPI> attentionKPIs = kpiService.getKPIsNeedingAttention();
        List<DashboardKPIDto> attentionKPIDtos = attentionKPIs.stream()
                .map(DashboardKPIDto::fromEntity)
                .collect(Collectors.toList());
        
        dashboardData.put("attentionItems", attentionKPIDtos);
        
        // TODO: Add more executive-level cross-domain analytics
        
        return ResponseEntity.ok(dashboardData);
    }

    /**
     * Refresh all dashboard data (metrics and KPIs).
     *
     * @return a response with a map containing the refresh results
     */
    @PostMapping("/refresh")
    @Operation(summary = "Refresh dashboard data", 
               description = "Refreshes all dashboard data, including metrics collection and KPI calculation")
    public ResponseEntity<Map<String, Object>> refreshDashboard() {
        log.info("REST request to refresh all dashboard data");
        
        Map<String, Object> refreshResults = new HashMap<>();
        
        // Collect metrics from all domains
        Map<DashboardMetric.SourceDomain, Integer> metricsCollected = metricCollectorService.collectAllDomainMetrics();
        
        // Convert domain enum keys to strings for the response
        Map<String, Integer> metricsResult = metricsCollected.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().toString(),
                        Map.Entry::getValue
                ));
        
        refreshResults.put("metricsCollected", metricsResult);
        
        // Calculate all KPIs
        int kpisCalculated = kpiService.calculateAllKPIs();
        refreshResults.put("kpisCalculated", kpisCalculated);
        
        return ResponseEntity.ok(refreshResults);
    }
    
    /**
     * Get dashboard health status.
     *
     * @return a response with a map containing dashboard health status
     */
    @GetMapping("/health")
    @Operation(summary = "Get dashboard health", 
               description = "Checks the health of the dashboard system and its integrations")
    public ResponseEntity<Map<String, Object>> getDashboardHealth() {
        log.info("REST request to check dashboard health");
        
        Map<String, Object> healthStatus = new HashMap<>();
        
        // Basic system status
        healthStatus.put("status", "UP");
        healthStatus.put("timestamp", new Date());
        
        // Domain integrations status
        Map<String, String> integrations = new HashMap<>();
        integrations.put("socialCommerce", "UP");
        integrations.put("warehousing", "UP");
        integrations.put("courierServices", "UP");
        
        healthStatus.put("integrations", integrations);
        
        return ResponseEntity.ok(healthStatus);
    }
}