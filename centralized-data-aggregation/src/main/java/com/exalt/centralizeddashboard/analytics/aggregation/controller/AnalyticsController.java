package com.exalt.centralizeddashboard.analytics.aggregation.controller;

import com.exalt.centralizeddashboard.analytics.aggregation.model.AnalyticsEvent;
import com.exalt.centralizeddashboard.analytics.aggregation.model.EventType;
import com.exalt.centralizeddashboard.analytics.aggregation.service.AnalyticsService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * REST controller for analytics operations
 */
@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);
    
    private final AnalyticsService analyticsService;
    
    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }
    
    /**
     * Record a new analytics event
     */
    @PostMapping("/events")
    public ResponseEntity<AnalyticsEvent> recordEvent(@RequestBody Map<String, Object> eventData) {
        try {
            String eventTypeStr = (String) eventData.get("eventType");
            String sourceService = (String) eventData.get("sourceService");
            String userId = (String) eventData.get("userId");
            String sessionId = (String) eventData.get("sessionId");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> attributes = (Map<String, Object>) eventData.get("attributes");
            
            if (eventTypeStr == null || sourceService == null || userId == null || sessionId == null) {
                return ResponseEntity.badRequest().build();
            }
            
            EventType eventType = EventType.valueOf(eventTypeStr);
            
            AnalyticsEvent event = analyticsService.createEvent(
                    eventType, sourceService, userId, sessionId, attributes);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(event);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid event data: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error recording event: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get events by type
     */
    @GetMapping("/events/by-type/{eventType}")
    public ResponseEntity<List<AnalyticsEvent>> getEventsByType(@PathVariable String eventType) {
        try {
            EventType type = EventType.valueOf(eventType);
            List<AnalyticsEvent> events = analyticsService.findEventsByType(type);
            return ResponseEntity.ok(events);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid event type: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error getting events: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get events by service
     */
    @GetMapping("/events/by-service/{service}")
    public ResponseEntity<List<AnalyticsEvent>> getEventsByService(@PathVariable String service) {
        try {
            List<AnalyticsEvent> events = analyticsService.findEventsBySourceService(service);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            logger.error("Error getting events: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get events by user
     */
    @GetMapping("/events/by-user/{userId}")
    public ResponseEntity<Page<AnalyticsEvent>> getEventsByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size, Sort.by("timestamp").descending());
            Page<AnalyticsEvent> events = analyticsService.findEventsByUser(userId, pageRequest);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            logger.error("Error getting events: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get events within a time range
     */
    @GetMapping("/events/by-time-range")
    public ResponseEntity<List<AnalyticsEvent>> getEventsByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            List<AnalyticsEvent> events = analyticsService.findEventsByTimeRange(start, end);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            logger.error("Error getting events: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get event counts by type
     */
    @GetMapping("/metrics/event-counts-by-type")
    public ResponseEntity<Map<String, Long>> getEventCountsByType() {
        try {
            Map<String, Long> counts = analyticsService.getEventCountsByType();
            return ResponseEntity.ok(counts);
        } catch (Exception e) {
            logger.error("Error getting event counts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get event counts by service
     */
    @GetMapping("/metrics/event-counts-by-service")
    public ResponseEntity<Map<String, Long>> getEventCountsByService() {
        try {
            Map<String, Long> counts = analyticsService.getEventCountsByService();
            return ResponseEntity.ok(counts);
        } catch (Exception e) {
            logger.error("Error getting event counts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get hourly event counts for a specific event type
     */
    @GetMapping("/metrics/hourly-event-counts/{eventType}")
    public ResponseEntity<Map<Integer, Long>> getHourlyEventCounts(
            @PathVariable String eventType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            EventType type = EventType.valueOf(eventType);
            Map<Integer, Long> counts = analyticsService.getHourlyEventCounts(type, start, end);
            return ResponseEntity.ok(counts);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid event type: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error getting hourly event counts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get daily event counts for a specific event type
     */
    @GetMapping("/metrics/daily-event-counts/{eventType}")
    public ResponseEntity<Map<String, Long>> getDailyEventCounts(
            @PathVariable String eventType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            EventType type = EventType.valueOf(eventType);
            Map<String, Long> counts = analyticsService.getDailyEventCounts(type, start, end);
            return ResponseEntity.ok(counts);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid event type: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error getting daily event counts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get user engagement metrics
     */
    @GetMapping("/metrics/user-engagement")
    public ResponseEntity<Map<String, Object>> getUserEngagementMetrics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            Map<String, Object> metrics = analyticsService.getUserEngagementMetrics(start, end);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting user engagement metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get conversion metrics
     */
    @GetMapping("/metrics/conversion")
    public ResponseEntity<Map<String, Object>> getConversionMetrics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            Map<String, Object> metrics = analyticsService.getConversionMetrics(start, end);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error getting conversion metrics: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Trigger data aggregation for a specific time period
     */
    @PostMapping("/aggregation")
    public ResponseEntity<Void> triggerDataAggregation(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            analyticsService.performDataAggregation(start, end);
            return ResponseEntity.accepted().build();
        } catch (Exception e) {
            logger.error("Error triggering data aggregation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 