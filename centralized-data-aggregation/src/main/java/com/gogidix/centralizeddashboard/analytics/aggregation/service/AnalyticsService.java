package com.gogidix.centralizeddashboard.analytics.aggregation.service;

import com.gogidix.centralizeddashboard.analytics.aggregation.model.AnalyticsEvent;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.EventType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Service interface for analytics operations
 */
public interface AnalyticsService {

    /**
     * Store a new analytics event
     */
    AnalyticsEvent storeEvent(AnalyticsEvent event);
    
    /**
     * Create and store a new analytics event
     */
    AnalyticsEvent createEvent(EventType eventType, String sourceService, 
            String userId, String sessionId, Map<String, Object> attributes);
    
    /**
     * Find events by type
     */
    List<AnalyticsEvent> findEventsByType(EventType eventType);
    
    /**
     * Find events by source service
     */
    List<AnalyticsEvent> findEventsBySourceService(String sourceService);
    
    /**
     * Find events by user ID
     */
    List<AnalyticsEvent> findEventsByUser(String userId);
    
    /**
     * Find events by user ID with pagination
     */
    Page<AnalyticsEvent> findEventsByUser(String userId, Pageable pageable);
    
    /**
     * Find events by session ID
     */
    List<AnalyticsEvent> findEventsBySession(String sessionId);
    
    /**
     * Find events within a time range
     */
    List<AnalyticsEvent> findEventsByTimeRange(LocalDateTime start, LocalDateTime end);
    
    /**
     * Find events by type within a time range
     */
    List<AnalyticsEvent> findEventsByTypeAndTimeRange(
            EventType eventType, LocalDateTime start, LocalDateTime end);
    
    /**
     * Get event counts by type
     */
    Map<String, Long> getEventCountsByType();
    
    /**
     * Get event counts by source service
     */
    Map<String, Long> getEventCountsByService();
    
    /**
     * Get hourly event counts for a specific event type
     */
    Map<Integer, Long> getHourlyEventCounts(
            EventType eventType, LocalDateTime start, LocalDateTime end);
    
    /**
     * Get daily event counts for a specific event type
     */
    Map<String, Long> getDailyEventCounts(
            EventType eventType, LocalDateTime start, LocalDateTime end);
    
    /**
     * Get user engagement metrics for a specific time period
     */
    Map<String, Object> getUserEngagementMetrics(LocalDateTime start, LocalDateTime end);
    
    /**
     * Get e-commerce conversion metrics for a specific time period
     */
    Map<String, Object> getConversionMetrics(LocalDateTime start, LocalDateTime end);
    
    /**
     * Perform data aggregation for the specified time period
     * This will create aggregated metrics records
     */
    void performDataAggregation(LocalDateTime start, LocalDateTime end);
} 