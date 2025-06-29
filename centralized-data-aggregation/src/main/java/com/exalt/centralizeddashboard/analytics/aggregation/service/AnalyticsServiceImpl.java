package com.exalt.centralizeddashboard.analytics.aggregation.service;

import com.exalt.centralizeddashboard.analytics.aggregation.model.AnalyticsEvent;
import com.exalt.centralizeddashboard.analytics.aggregation.model.EventType;
import com.exalt.centralizeddashboard.analytics.aggregation.repository.AnalyticsEventRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of the analytics service
 */
@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    private final AnalyticsEventRepository eventRepository;
    
    @Autowired
    public AnalyticsServiceImpl(AnalyticsEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    @Transactional
    public AnalyticsEvent storeEvent(AnalyticsEvent event) {
        logger.debug("Storing analytics event: {}", event.getEventType());
        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public AnalyticsEvent createEvent(EventType eventType, String sourceService, 
            String userId, String sessionId, Map<String, Object> attributes) {
        logger.debug("Creating analytics event: {}", eventType);
        
        AnalyticsEvent event = AnalyticsEvent.builder()
                .eventType(eventType)
                .sourceService(sourceService)
                .userId(userId)
                .sessionId(sessionId)
                .build();
        
        if (attributes != null) {
            event.setAttributes(attributes);
        }
        
        return eventRepository.save(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnalyticsEvent> findEventsByType(EventType eventType) {
        return eventRepository.findByEventType(eventType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnalyticsEvent> findEventsBySourceService(String sourceService) {
        return eventRepository.findBySourceService(sourceService);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnalyticsEvent> findEventsByUser(String userId) {
        return eventRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnalyticsEvent> findEventsByUser(String userId, Pageable pageable) {
        return eventRepository.findByUserId(userId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnalyticsEvent> findEventsBySession(String sessionId) {
        return eventRepository.findBySessionId(sessionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnalyticsEvent> findEventsByTimeRange(LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByTimestampBetween(start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnalyticsEvent> findEventsByTypeAndTimeRange(
            EventType eventType, LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByEventTypeAndTimestampBetween(eventType, start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getEventCountsByType() {
        List<Object[]> results = eventRepository.countByEventTypeGrouped();
        
        Map<String, Long> counts = new HashMap<>();
        for (Object[] result : results) {
            EventType eventType = (EventType) result[0];
            Long count = (Long) result[1];
            counts.put(eventType.name(), count);
        }
        
        return counts;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getEventCountsByService() {
        List<Object[]> results = eventRepository.countBySourceServiceGrouped();
        
        Map<String, Long> counts = new HashMap<>();
        for (Object[] result : results) {
            String service = (String) result[0];
            Long count = (Long) result[1];
            counts.put(service, count);
        }
        
        return counts;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Integer, Long> getHourlyEventCounts(
            EventType eventType, LocalDateTime start, LocalDateTime end) {
        List<Object[]> results = eventRepository.getHourlyEventCounts(eventType, start, end);
        
        Map<Integer, Long> counts = new HashMap<>();
        for (Object[] result : results) {
            Integer hour = ((Number) result[0]).intValue();
            Long count = (Long) result[1];
            counts.put(hour, count);
        }
        
        return counts;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getDailyEventCounts(
            EventType eventType, LocalDateTime start, LocalDateTime end) {
        List<AnalyticsEvent> events = eventRepository.findByEventTypeAndTimestampBetween(
                eventType, start, end);
        
        return events.stream()
                .collect(Collectors.groupingBy(
                        event -> event.getTimestamp().toLocalDate().format(DATE_FORMAT),
                        Collectors.counting()));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getUserEngagementMetrics(LocalDateTime start, LocalDateTime end) {
        Map<String, Object> metrics = new HashMap<>();
        
        // Count total events in the period
        long totalEvents = eventRepository.countByTimestampBetween(start, end);
        metrics.put("totalEvents", totalEvents);
        
        // Count unique users in the period
        List<AnalyticsEvent> events = eventRepository.findByTimestampBetween(start, end);
        long uniqueUsers = events.stream()
                .map(AnalyticsEvent::getUserId)
                .distinct()
                .count();
        metrics.put("uniqueUsers", uniqueUsers);
        
        // Count unique sessions in the period
        long uniqueSessions = events.stream()
                .map(AnalyticsEvent::getSessionId)
                .distinct()
                .count();
        metrics.put("uniqueSessions", uniqueSessions);
        
        // Count events by type
        Map<EventType, Long> eventsByType = events.stream()
                .collect(Collectors.groupingBy(AnalyticsEvent::getEventType, Collectors.counting()));
        
        Map<String, Long> eventCounts = new HashMap<>();
        eventsByType.forEach((type, count) -> eventCounts.put(type.name(), count));
        metrics.put("eventCounts", eventCounts);
        
        // Average events per user
        metrics.put("avgEventsPerUser", uniqueUsers > 0 ? (double) totalEvents / uniqueUsers : 0);
        
        // Average events per session
        metrics.put("avgEventsPerSession", uniqueSessions > 0 ? (double) totalEvents / uniqueSessions : 0);
        
        return metrics;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getConversionMetrics(LocalDateTime start, LocalDateTime end) {
        Map<String, Object> metrics = new HashMap<>();
        
        // Count relevant e-commerce events
        long productViews = eventRepository.countByEventTypeAndTimestampBetween(
                EventType.PRODUCT_VIEW, start, end);
        long addToCarts = eventRepository.countByEventTypeAndTimestampBetween(
                EventType.ADD_TO_CART, start, end);
        long checkoutStarts = eventRepository.countByEventTypeAndTimestampBetween(
                EventType.CHECKOUT_START, start, end);
        long orders = eventRepository.countByEventTypeAndTimestampBetween(
                EventType.CHECKOUT_COMPLETE, start, end);
        
        metrics.put("productViews", productViews);
        metrics.put("addToCarts", addToCarts);
        metrics.put("checkoutStarts", checkoutStarts);
        metrics.put("orders", orders);
        
        // Calculate conversion rates
        metrics.put("addToCartRate", productViews > 0 ? (double) addToCarts / productViews : 0);
        metrics.put("checkoutRate", addToCarts > 0 ? (double) checkoutStarts / addToCarts : 0);
        metrics.put("orderCompletionRate", checkoutStarts > 0 ? (double) orders / checkoutStarts : 0);
        metrics.put("overallConversionRate", productViews > 0 ? (double) orders / productViews : 0);
        
        return metrics;
    }

    @Override
    @Transactional
    public void performDataAggregation(LocalDateTime start, LocalDateTime end) {
        logger.info("Performing data aggregation for period: {} to {}", start, end);
        
        // This would aggregate raw events into summary tables for reporting
        // For MVP, we're just calculating metrics on demand from the raw events
        // In a real implementation, this would create aggregated records for faster dashboard rendering
        
        // Get daily totals by event type
        List<AnalyticsEvent> events = eventRepository.findByTimestampBetween(start, end);
        
        Map<LocalDate, Map<EventType, Long>> dailyEventCounts = events.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getTimestamp().toLocalDate(),
                        Collectors.groupingBy(AnalyticsEvent::getEventType, Collectors.counting())));
        
        // Log aggregation results
        dailyEventCounts.forEach((date, typeCounts) -> {
            typeCounts.forEach((type, count) -> {
                logger.debug("Aggregated count for date {}, event type {}: {}", date, type, count);
            });
        });
        
        // In a real implementation, we would save these aggregated metrics to a separate table
        logger.info("Data aggregation completed");
    }
} 