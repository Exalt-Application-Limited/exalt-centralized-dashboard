package com.gogidix.centralizeddashboard.analytics.aggregation.repository;

import com.gogidix.centralizeddashboard.analytics.aggregation.model.AnalyticsEvent;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.EventType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for analytics events
 */
@Repository
public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, String> {

    /**
     * Find events by type
     */
    List<AnalyticsEvent> findByEventType(EventType eventType);
    
    /**
     * Find events by source service
     */
    List<AnalyticsEvent> findBySourceService(String sourceService);
    
    /**
     * Find events by user ID
     */
    List<AnalyticsEvent> findByUserId(String userId);
    
    /**
     * Find events by session ID
     */
    List<AnalyticsEvent> findBySessionId(String sessionId);
    
    /**
     * Find events within a time range
     */
    List<AnalyticsEvent> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    /**
     * Find events by type within a time range
     */
    List<AnalyticsEvent> findByEventTypeAndTimestampBetween(
            EventType eventType, LocalDateTime start, LocalDateTime end);
    
    /**
     * Find events by user within a time range
     */
    List<AnalyticsEvent> findByUserIdAndTimestampBetween(
            String userId, LocalDateTime start, LocalDateTime end);
    
    /**
     * Find events by session within a time range
     */
    List<AnalyticsEvent> findBySessionIdAndTimestampBetween(
            String sessionId, LocalDateTime start, LocalDateTime end);
    
    /**
     * Count events by type
     */
    long countByEventType(EventType eventType);
    
    /**
     * Count events by source service
     */
    long countBySourceService(String sourceService);
    
    /**
     * Count events by type within a time range
     */
    long countByEventTypeAndTimestampBetween(
            EventType eventType, LocalDateTime start, LocalDateTime end);
    
    /**
     * Count events within a time range
     */
    long countByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    /**
     * Get events with pagination
     */
    Page<AnalyticsEvent> findByEventType(EventType eventType, Pageable pageable);
    
    /**
     * Get events by source service with pagination
     */
    Page<AnalyticsEvent> findBySourceService(String sourceService, Pageable pageable);
    
    /**
     * Get events by user with pagination
     */
    Page<AnalyticsEvent> findByUserId(String userId, Pageable pageable);
    
    /**
     * Get event counts grouped by event type
     */
    @Query("SELECT e.eventType, COUNT(e) FROM AnalyticsEvent e GROUP BY e.eventType")
    List<Object[]> countByEventTypeGrouped();
    
    /**
     * Get event counts grouped by source service
     */
    @Query("SELECT e.sourceService, COUNT(e) FROM AnalyticsEvent e GROUP BY e.sourceService")
    List<Object[]> countBySourceServiceGrouped();
    
    /**
     * Get hourly event counts for a specific event type
     */
    @Query("SELECT FUNCTION('HOUR', e.timestamp) as hour, COUNT(e) " +
           "FROM AnalyticsEvent e " +
           "WHERE e.eventType = ?1 AND " +
           "e.timestamp BETWEEN ?2 AND ?3 " +
           "GROUP BY FUNCTION('HOUR', e.timestamp)")
    List<Object[]> getHourlyEventCounts(EventType eventType, LocalDateTime start, LocalDateTime end);
} 