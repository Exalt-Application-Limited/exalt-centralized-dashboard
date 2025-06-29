package com.exalt.centralizeddashboard.core.controller;

import com.exalt.centralizeddashboard.core.dto.DashboardMetricDto;
import com.exalt.centralizeddashboard.core.model.DashboardMetric;
import com.exalt.centralizeddashboard.core.service.MetricCollectorService;
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
import java.util.stream.Collectors;

/**
 * REST controller for metrics-related operations.
 */
@RestController
@RequestMapping("/api/dashboard/metrics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Metrics API", description = "API endpoints for metrics data collection and retrieval")
public class MetricsController {

    private final MetricCollectorService metricCollectorService;

    /**
     * Collect metrics from all domains.
     *
     * @return a response with the count of metrics collected from each domain
     */
    @PostMapping("/collect/all")
    @Operation(summary = "Collect metrics from all domains", 
               description = "Triggers collection of metrics from all integrated domains (Social Commerce, Warehousing, Courier Services)")
    public ResponseEntity<Map<String, Integer>> collectAllDomainMetrics() {
        log.info("REST request to collect metrics from all domains");
        
        Map<DashboardMetric.SourceDomain, Integer> result = metricCollectorService.collectAllDomainMetrics();
        
        // Convert domain enum keys to strings for the response
        Map<String, Integer> responseMap = result.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().toString(),
                        Map.Entry::getValue
                ));
        
        return ResponseEntity.ok(responseMap);
    }

    /**
     * Collect metrics from the Social Commerce domain.
     *
     * @return a response with the collected metrics
     */
    @PostMapping("/collect/social-commerce")
    @Operation(summary = "Collect Social Commerce metrics", 
               description = "Triggers collection of metrics from the Social Commerce domain")
    public ResponseEntity<List<DashboardMetricDto>> collectSocialCommerceMetrics() {
        log.info("REST request to collect metrics from Social Commerce domain");
        
        List<DashboardMetric> metrics = metricCollectorService.collectSocialCommerceMetrics();
        List<DashboardMetricDto> dtos = metrics.stream()
                .map(DashboardMetricDto::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    /**
     * Collect metrics from the Warehousing domain.
     *
     * @return a response with the collected metrics
     */
    @PostMapping("/collect/warehousing")
    @Operation(summary = "Collect Warehousing metrics", 
               description = "Triggers collection of metrics from the Warehousing domain")
    public ResponseEntity<List<DashboardMetricDto>> collectWarehousingMetrics() {
        log.info("REST request to collect metrics from Warehousing domain");
        
        List<DashboardMetric> metrics = metricCollectorService.collectWarehousingMetrics();
        List<DashboardMetricDto> dtos = metrics.stream()
                .map(DashboardMetricDto::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    /**
     * Collect metrics from the Courier Services domain.
     *
     * @return a response with the collected metrics
     */
    @PostMapping("/collect/courier-services")
    @Operation(summary = "Collect Courier Services metrics", 
               description = "Triggers collection of metrics from the Courier Services domain")
    public ResponseEntity<List<DashboardMetricDto>> collectCourierServicesMetrics() {
        log.info("REST request to collect metrics from Courier Services domain");
        
        List<DashboardMetric> metrics = metricCollectorService.collectCourierServicesMetrics();
        List<DashboardMetricDto> dtos = metrics.stream()
                .map(DashboardMetricDto::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    /**
     * Collect metrics for a specific domain and time range.
     *
     * @param domain the source domain
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return a response with the collected metrics
     */
    @PostMapping("/collect/{domain}")
    @Operation(summary = "Collect metrics for a specific domain and time range", 
               description = "Triggers collection of historical metrics for a specific domain within a time range")
    public ResponseEntity<List<DashboardMetricDto>> collectMetricsForDomainAndTimeRange(
            @PathVariable @Parameter(description = "Domain name: SOCIAL_COMMERCE, WAREHOUSING, or COURIER_SERVICES") String domain,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            @Parameter(description = "Start time (ISO format)") LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            @Parameter(description = "End time (ISO format)") LocalDateTime endTime) {
        
        log.info("REST request to collect metrics for domain {} from {} to {}", domain, startTime, endTime);
        
        try {
            DashboardMetric.SourceDomain sourceDomain = DashboardMetric.SourceDomain.valueOf(domain.toUpperCase());
            List<DashboardMetric> metrics = metricCollectorService.collectMetricsForDomainAndTimeRange(sourceDomain, startTime, endTime);
            List<DashboardMetricDto> dtos = metrics.stream()
                    .map(DashboardMetricDto::fromEntity)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            log.error("Invalid domain name: {}", domain, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Schedule metric collection for all domains.
     *
     * @param cronExpression the cron expression for scheduling
     * @return a response indicating success or failure
     */
    @PostMapping("/schedule")
    @Operation(summary = "Schedule metric collection", 
               description = "Sets up a scheduled task for metric collection using a cron expression")
    public ResponseEntity<Boolean> scheduleMetricCollection(
            @RequestParam @Parameter(description = "Cron expression for scheduling (e.g., '0 */15 * * * *' for every 15 minutes)") 
            String cronExpression) {
        
        log.info("REST request to schedule metric collection with cron expression: {}", cronExpression);
        
        boolean success = metricCollectorService.scheduleMetricCollection(cronExpression);
        
        if (success) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }
    }

    /**
     * Manually refresh metrics for a specific domain.
     *
     * @param domain the source domain to refresh
     * @return a response with the number of metrics refreshed
     */
    @PostMapping("/refresh/{domain}")
    @Operation(summary = "Refresh metrics for a domain", 
               description = "Manually triggers a refresh of metrics for a specific domain")
    public ResponseEntity<Integer> refreshMetricsForDomain(
            @PathVariable @Parameter(description = "Domain name: SOCIAL_COMMERCE, WAREHOUSING, or COURIER_SERVICES") String domain) {
        
        log.info("REST request to refresh metrics for domain {}", domain);
        
        try {
            DashboardMetric.SourceDomain sourceDomain = DashboardMetric.SourceDomain.valueOf(domain.toUpperCase());
            int count = metricCollectorService.refreshMetricsForDomain(sourceDomain);
            
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            log.error("Invalid domain name: {}", domain, e);
            return ResponseEntity.badRequest().build();
        }
    }
}