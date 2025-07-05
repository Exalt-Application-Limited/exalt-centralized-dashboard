package com.gogidix.centralizeddashboard.metrics.controller;

import com.gogidix.centralizeddashboard.metrics.model.MetricType;
import com.gogidix.centralizeddashboard.metrics.model.PerformanceMetric;
import com.gogidix.centralizeddashboard.metrics.service.PerformanceMetricsService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * REST controller for performance metrics operations
 */
@RestController
@RequestMapping("/api/v1/metrics")
public class PerformanceMetricsController {

    private static final Logger logger = LoggerFactory.getLogger(PerformanceMetricsController.class);
    
    private final PerformanceMetricsService metricsService;
    
    @Autowired
    public PerformanceMetricsController(PerformanceMetricsService metricsService) {
        this.metricsService = metricsService;
    }
    
    /**
     * Record a new performance metric
     */
    @PostMapping
    public ResponseEntity<PerformanceMetric> recordMetric(@RequestBody Map<String, Object> metricData) {
        try {
            String serviceName = (String) metricData.get("serviceName");
            String instanceId = (String) metricData.get("instanceId");
            String metricTypeStr = (String) metricData.get("metricType");
            String metricName = (String) metricData.get("metricName");
            Double value = Double.valueOf(metricData.get("value").toString());
            String tags = (String) metricData.get("tags");
            
            // Validate required fields
            if (serviceName == null || instanceId == null || metricTypeStr == null || 
                    metricName == null || metricData.get("value") == null) {
                return ResponseEntity.badRequest().build();
            }
            
            MetricType metricType = MetricType.valueOf(metricTypeStr);
            
            PerformanceMetric metric;
            if (tags != null) {
                metric = metricsService.recordMetricWithTags(
                        serviceName, instanceId, metricType, metricName, value, tags);
            } else {
                metric = metricsService.recordMetric(
                        serviceName, instanceId, metricType, metricName, value);
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(metric);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid metric data: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error recording metric: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by service name
     */
    @GetMapping("/by-service/{serviceName}")
    public ResponseEntity<List<PerformanceMetric>> getMetricsByServiceName(@PathVariable String serviceName) {
        try {
            List<PerformanceMetric> metrics = metricsService.getMetricsByServiceName(serviceName);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting metrics by service name: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by instance ID
     */
    @GetMapping("/by-instance/{instanceId}")
    public ResponseEntity<List<PerformanceMetric>> getMetricsByInstanceId(@PathVariable String instanceId) {
        try {
            List<PerformanceMetric> metrics = metricsService.getMetricsByInstanceId(instanceId);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting metrics by instance ID: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by metric type
     */
    @GetMapping("/by-type/{metricType}")
    public ResponseEntity<List<PerformanceMetric>> getMetricsByMetricType(@PathVariable String metricType) {
        try {
            MetricType type = MetricType.valueOf(metricType.toUpperCase());
            List<PerformanceMetric> metrics = metricsService.getMetricsByMetricType(type);
            return ResponseEntity.ok(metrics);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid metric type: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error getting metrics by type: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by metric name
     */
    @GetMapping("/by-name/{metricName}")
    public ResponseEntity<List<PerformanceMetric>> getMetricsByMetricName(@PathVariable String metricName) {
        try {
            List<PerformanceMetric> metrics = metricsService.getMetricsByMetricName(metricName);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting metrics by name: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by time range
     */
    @GetMapping("/by-time-range")
    public ResponseEntity<List<PerformanceMetric>> getMetricsByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            List<PerformanceMetric> metrics = metricsService.getMetricsByTimeRange(start, end);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting metrics by time range: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get latest metric value
     */
    @GetMapping("/latest")
    public ResponseEntity<PerformanceMetric> getLatestMetric(
            @RequestParam String serviceName, @RequestParam String metricName) {
        try {
            PerformanceMetric metric = metricsService.getLatestMetric(serviceName, metricName);
            
            if (metric == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(metric);
        } catch (Exception e) {
            logger.error("Error getting latest metric: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Double>> getMetricsStatistics(
            @RequestParam String serviceName, 
            @RequestParam String metricName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            Map<String, Double> statistics = metricsService.getMetricsStatistics(
                    serviceName, metricName, start, end);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            logger.error("Error getting metrics statistics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get time series data for a specific metric
     */
    @GetMapping("/time-series")
    public ResponseEntity<List<Map<String, Object>>> getMetricTimeSeries(
            @RequestParam String serviceName, 
            @RequestParam String metricName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            List<Map<String, Object>> timeSeries = metricsService.getMetricTimeSeries(
                    serviceName, metricName, start, end);
            return ResponseEntity.ok(timeSeries);
        } catch (Exception e) {
            logger.error("Error getting metric time series: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics for all services
     */
    @GetMapping("/all-services")
    public ResponseEntity<Map<String, List<PerformanceMetric>>> getAllServicesMetrics() {
        try {
            Map<String, List<PerformanceMetric>> metrics = metricsService.getMetricsGroupedByService();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting all services metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Delete old metrics manually
     */
    @DeleteMapping("/prune")
    public ResponseEntity<Map<String, Integer>> pruneOldMetrics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cutoffTime) {
        try {
            int count = metricsService.pruneOldMetrics(cutoffTime);
            Map<String, Integer> result = new HashMap<>();
            result.put("prunedCount", count);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error pruning old metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 