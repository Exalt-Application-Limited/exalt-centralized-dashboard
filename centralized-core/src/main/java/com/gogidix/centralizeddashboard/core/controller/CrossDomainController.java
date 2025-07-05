package com.gogidix.centralizeddashboard.core.controller;

import com.gogidix.centralizeddashboard.core.dto.CrossDomainSummaryDto;
import com.gogidix.centralizeddashboard.core.dto.DashboardMetricDto;
import com.gogidix.centralizeddashboard.core.dto.DomainHealthDto;
import com.gogidix.centralizeddashboard.core.repository.DashboardMetricRepository;
import com.gogidix.centralizeddashboard.core.integration.CrossDomainIntegrationService;
import com.gogidix.centralizeddashboard.core.model.DashboardMetric;
import com.gogidix.centralizeddashboard.core.service.CrossDomainDashboardService;
import com.gogidix.centralizeddashboard.core.service.MetricCollectorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST controller for cross-domain integration endpoints.
 * Provides APIs for fetching and managing data across all domains.
 */
@RestController
@RequestMapping("/api/dashboard/cross-domain")
@RequiredArgsConstructor
@Slf4j
public class CrossDomainController {

    private final CrossDomainIntegrationService crossDomainIntegrationService;
    private final MetricCollectorService metricCollectorService;
    private final CrossDomainDashboardService crossDomainDashboardService;
    private final DashboardMetricRepository dashboardMetricRepository;

    /**
     * Fetch metrics from all domains.
     * This endpoint triggers data collection from all integrated domains
     * and returns the collected metrics.
     *
     * @return a list of dashboard metrics from all domains
     */
    @PostMapping("/metrics/collect")
    public ResponseEntity<List<DashboardMetricDto>> collectAllDomainMetrics() {
        log.info("API request to collect metrics from all domains");
        List<DashboardMetric> metrics = crossDomainIntegrationService.fetchAllDomainMetrics();
        
        // Save metrics to database
        dashboardMetricRepository.saveAll(metrics);
        
        // Convert entities to DTOs
        List<DashboardMetricDto> dtos = metrics.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get the current status of all integrated domains.
     *
     * @return a map of domain names to their status (UP/DOWN)
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> getDomainStatus() {
        log.info("API request to check domain status");
        Map<String, String> statusMap = crossDomainIntegrationService.getDomainStatus();
        return ResponseEntity.ok(statusMap);
    }

    /**
     * Fetch metrics from a specific domain.
     *
     * @param domain the domain to fetch metrics from (courier, social, warehousing)
     * @return a list of dashboard metrics from the specified domain
     */
    @PostMapping("/metrics/collect/{domain}")
    public ResponseEntity<List<DashboardMetricDto>> collectDomainMetrics(@PathVariable String domain) {
        log.info("API request to collect metrics from domain: {}", domain);
        
        List<DashboardMetric> metrics;
        switch (domain.toLowerCase()) {
            case "courier":
                metrics = crossDomainIntegrationService.fetchCourierServicesMetrics();
                break;
            case "social":
                metrics = crossDomainIntegrationService.fetchSocialCommerceMetrics();
                break;
            case "warehousing":
                metrics = crossDomainIntegrationService.fetchWarehousingMetrics();
                break;
            default:
                return ResponseEntity.badRequest().build();
        }
        
        // Save metrics to database
        dashboardMetricRepository.saveAll(metrics);
        
        // Convert entities to DTOs
        List<DashboardMetricDto> dtos = metrics.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    /**
     * Convert a DashboardMetric entity to a DashboardMetricDto.
     *
     * @param metric the entity to convert
     * @return the converted DTO
     */
    private DashboardMetricDto convertToDto(DashboardMetric metric) {
        return DashboardMetricDto.builder()
                .id(metric.getId())
                .metricName(metric.getMetricName())
                .metricValue(metric.getMetricValue())
                .metricUnit(metric.getMetricUnit())
                .sourceDomain(metric.getSourceDomain().name())
                .sourceService(metric.getSourceService())
                .region(metric.getRegion())
                .timestamp(metric.getTimestamp())
                .dataPointType(metric.getDataPointType().name())
                .build();
    }
    
    /**
     * Get the complete cross-domain dashboard summary.
     * This provides a comprehensive view of data across all domains.
     *
     * @return the cross-domain dashboard summary
     */
    @GetMapping("/summary")
    public ResponseEntity<CrossDomainSummaryDto> getDashboardSummary() {
        log.info("API request to get cross-domain dashboard summary");
        CrossDomainSummaryDto summary = crossDomainDashboardService.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }
    
    /**
     * Refresh the cross-domain dashboard summary by collecting fresh data.
     *
     * @return the refreshed cross-domain dashboard summary
     */
    @PostMapping("/summary/refresh")
    public ResponseEntity<CrossDomainSummaryDto> refreshDashboardSummary() {
        log.info("API request to refresh cross-domain dashboard summary");
        CrossDomainSummaryDto summary = crossDomainDashboardService.refreshDashboardSummary();
        return ResponseEntity.ok(summary);
    }
    
    /**
     * Get the health status of all integrated domains.
     *
     * @return list of domain health status
     */
    @GetMapping("/health")
    public ResponseEntity<List<DomainHealthDto>> getDomainHealth() {
        log.info("API request to get domain health status");
        List<DomainHealthDto> healthStatus = crossDomainDashboardService.getDomainHealth();
        return ResponseEntity.ok(healthStatus);
    }
    
    /**
     * Get key performance indicators across all domains.
     *
     * @return map of domain to KPI values
     */
    @GetMapping("/kpis")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> getCrossDomainKPIs() {
        log.info("API request to get cross-domain KPIs");
        Map<String, List<Map<String, Object>>> kpis = crossDomainDashboardService.getCrossDomainKPIs();
        return ResponseEntity.ok(kpis);
    }
    
    /**
     * Get cross-domain metrics that are relevant for business insights.
     *
     * @return map of insight categories to metric values
     */
    @GetMapping("/insights")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> getCrossDomainInsights() {
        log.info("API request to get cross-domain insights");
        Map<String, List<Map<String, Object>>> insights = crossDomainDashboardService.getCrossDomainInsights();
        return ResponseEntity.ok(insights);
    }
    
    /**
     * Get metrics that show correlations across different domains.
     *
     * @return map of correlation types to metric relationships
     */
    @GetMapping("/correlations")
    public ResponseEntity<Map<String, Object>> getMetricCorrelations() {
        log.info("API request to get metric correlations");
        Map<String, Object> correlations = crossDomainDashboardService.getMetricCorrelations();
        return ResponseEntity.ok(correlations);
    }
}