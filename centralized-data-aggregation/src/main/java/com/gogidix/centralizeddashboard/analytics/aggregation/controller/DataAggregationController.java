package com.gogidix.centralizeddashboard.analytics.aggregation.controller;

import com.gogidix.centralizeddashboard.analytics.aggregation.model.AggregatedMetric;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.MetricType;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.TimeGranularity;
import com.gogidix.centralizeddashboard.analytics.aggregation.service.DataAggregationService;

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

/**
 * REST controller for data aggregation operations
 */
@RestController
@RequestMapping("/api/v1/metrics")
public class DataAggregationController {

    private static final Logger logger = LoggerFactory.getLogger(DataAggregationController.class);
    
    private final DataAggregationService dataAggregationService;
    
    @Autowired
    public DataAggregationController(DataAggregationService dataAggregationService) {
        this.dataAggregationService = dataAggregationService;
    }
    
    /**
     * Get metrics by type
     */
    @GetMapping("/by-type/{metricType}")
    public ResponseEntity<List<AggregatedMetric>> getMetricsByType(@PathVariable String metricType) {
        try {
            MetricType type = MetricType.valueOf(metricType.toUpperCase());
            List<AggregatedMetric> metrics = dataAggregationService.findMetricsByType(type);
            return ResponseEntity.ok(metrics);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid metric type: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error getting metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by name
     */
    @GetMapping("/by-name/{name}")
    public ResponseEntity<List<AggregatedMetric>> getMetricsByName(@PathVariable String name) {
        try {
            List<AggregatedMetric> metrics = dataAggregationService.findMetricsByName(name);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by dimension
     */
    @GetMapping("/by-dimension/{dimension}")
    public ResponseEntity<List<AggregatedMetric>> getMetricsByDimension(@PathVariable String dimension) {
        try {
            List<AggregatedMetric> metrics = dataAggregationService.findMetricsByDimension(dimension);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by name and dimension
     */
    @GetMapping("/by-name-dimension")
    public ResponseEntity<List<AggregatedMetric>> getMetricsByNameAndDimension(
            @RequestParam String name, @RequestParam String dimension) {
        try {
            List<AggregatedMetric> metrics = dataAggregationService.findMetricsByNameAndDimension(name, dimension);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by time range
     */
    @GetMapping("/by-time-range")
    public ResponseEntity<List<AggregatedMetric>> getMetricsByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            List<AggregatedMetric> metrics = dataAggregationService.findMetricsByTimeRange(start, end);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by name and time range
     */
    @GetMapping("/by-name-time-range")
    public ResponseEntity<List<AggregatedMetric>> getMetricsByNameAndTimeRange(
            @RequestParam String name,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            List<AggregatedMetric> metrics = dataAggregationService.findMetricsByNameAndTimeRange(name, start, end);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by name, dimension, and time range
     */
    @GetMapping("/by-name-dimension-time-range")
    public ResponseEntity<List<AggregatedMetric>> getMetricsByNameDimensionAndTimeRange(
            @RequestParam String name,
            @RequestParam String dimension,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            List<AggregatedMetric> metrics = dataAggregationService.findMetricsByNameDimensionAndTimeRange(
                    name, dimension, start, end);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics by granularity
     */
    @GetMapping("/by-granularity/{granularity}")
    public ResponseEntity<List<AggregatedMetric>> getMetricsByGranularity(@PathVariable String granularity) {
        try {
            TimeGranularity timeGranularity = TimeGranularity.valueOf(granularity.toUpperCase());
            List<AggregatedMetric> metrics = dataAggregationService.findMetricsByGranularity(timeGranularity);
            return ResponseEntity.ok(metrics);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid granularity: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error getting metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get metrics as a time series (for charting)
     */
    @GetMapping("/time-series")
    public ResponseEntity<Map<String, List<Object[]>>> getMetricsTimeSeries(
            @RequestParam String name,
            @RequestParam(required = false) String dimension,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam String granularity) {
        try {
            TimeGranularity timeGranularity = TimeGranularity.valueOf(granularity.toUpperCase());
            Map<String, List<Object[]>> timeSeries = dataAggregationService.getMetricsTimeSeries(
                    name, dimension, start, end, timeGranularity);
            return ResponseEntity.ok(timeSeries);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid parameters: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error getting metrics time series: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Trigger data aggregation manually
     */
    @PostMapping("/aggregate")
    public ResponseEntity<Void> triggerDataAggregation(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam String granularity) {
        try {
            TimeGranularity timeGranularity = TimeGranularity.valueOf(granularity.toUpperCase());
            dataAggregationService.aggregateData(start, end, timeGranularity);
            return ResponseEntity.accepted().build();
        } catch (IllegalArgumentException e) {
            logger.error("Invalid parameters: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error triggering data aggregation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Trigger pruning of old metrics manually
     */
    @PostMapping("/prune")
    public ResponseEntity<Map<String, Integer>> triggerMetricsPruning(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cutoffDate) {
        try {
            int prunedCount = dataAggregationService.pruneOldMetrics(cutoffDate);
            Map<String, Integer> result = Map.of("prunedCount", prunedCount);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error pruning metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 