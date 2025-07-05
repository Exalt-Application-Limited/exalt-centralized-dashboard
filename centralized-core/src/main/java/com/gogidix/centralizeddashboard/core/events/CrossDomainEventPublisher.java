package com.gogidix.centralizeddashboard.core.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Publishes cross-domain events to both internal event listeners and external domains.
 * This service handles the routing and delivery of events across domain boundaries.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CrossDomainEventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    // Domain service endpoints for event delivery
    private static final Map<String, String> DOMAIN_EVENT_ENDPOINTS = new HashMap<>();
    
    static {
        DOMAIN_EVENT_ENDPOINTS.put("SOCIAL_COMMERCE", "http://social-commerce-service/api/events");
        DOMAIN_EVENT_ENDPOINTS.put("WAREHOUSING", "http://warehousing-service/api/events");
        DOMAIN_EVENT_ENDPOINTS.put("COURIER_SERVICES", "http://courier-services/api/events");
    }
    
    /**
     * Publish an event to both internal listeners and external domains.
     *
     * @param event the event to publish
     */
    @Async
    public void publishEvent(CrossDomainEvent event) {
        // Publish internally first
        publishInternally(event);
        
        // Then publish to external domains if specified
        publishExternally(event);
    }
    
    /**
     * Publish an event to internal event listeners.
     *
     * @param event the event to publish
     */
    private void publishInternally(CrossDomainEvent event) {
        try {
            log.debug("Publishing event internally: {} [{}]", event.getEventType(), event.getEventId());
            applicationEventPublisher.publishEvent(event);
        } catch (Exception e) {
            log.error("Error publishing event internally: {}", event.getEventId(), e);
        }
    }
    
    /**
     * Publish an event to external domains.
     *
     * @param event the event to publish
     */
    private void publishExternally(CrossDomainEvent event) {
        String[] targetDomains = event.getTargetDomains();
        
        // If targeting all domains, publish to all known domains except the source
        if (targetDomains.length == 1 && "ALL".equals(targetDomains[0])) {
            DOMAIN_EVENT_ENDPOINTS.keySet().stream()
                    .filter(domain -> !domain.equals(event.getSourceDomain()))
                    .forEach(domain -> sendEventToDomain(event, domain));
        } else {
            // Otherwise, publish only to the specified domains
            Arrays.stream(targetDomains)
                    .forEach(domain -> sendEventToDomain(event, domain));
        }
    }
    
    /**
     * Send an event to a specific domain.
     *
     * @param event the event to send
     * @param targetDomain the domain to send to
     */
    private void sendEventToDomain(CrossDomainEvent event, String targetDomain) {
        String endpoint = DOMAIN_EVENT_ENDPOINTS.get(targetDomain);
        
        if (endpoint == null) {
            log.warn("Unknown domain for event delivery: {}", targetDomain);
            return;
        }
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<CrossDomainEvent> request = new HttpEntity<>(event, headers);
            
            // Attempt to deliver the event
            log.debug("Sending event to domain {}: {} [{}]", 
                    targetDomain, event.getEventType(), event.getEventId());
            
            restTemplate.postForEntity(endpoint, request, Void.class);
            
            log.debug("Successfully delivered event to domain {}: {}", 
                    targetDomain, event.getEventId());
        } catch (Exception e) {
            log.error("Failed to deliver event to domain {}: {}", 
                    targetDomain, event.getEventId(), e);
            // In a production system, we might queue this for retry later
        }
    }
    
    /**
     * Create and publish a status change event when a domain's status changes.
     *
     * @param domain the domain whose status changed
     * @param status the new status
     * @param details additional details about the status change
     */
    public void publishDomainStatusChangeEvent(String domain, String status, String details) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("status", status);
        payload.put("details", details);
        
        CrossDomainEvent event = CrossDomainEvent.builder()
                .eventId(java.util.UUID.randomUUID().toString())
                .sourceDomain("CENTRALIZED_DASHBOARD")
                .sourceEntity("DomainStatusMonitor")
                .eventType(CrossDomainEvent.EventType.HEALTH_STATUS_CHANGED)
                .targetDomains(new String[]{"ALL"})
                .timestamp(java.time.LocalDateTime.now())
                .subject("DomainHealth")
                .subjectId(domain)
                .priority(CrossDomainEvent.EventPriority.HIGH)
                .payload(payload)
                .requiresAcknowledgement(false)
                .build();
        
        publishEvent(event);
    }
    
    /**
     * Create and publish a metric threshold event when a metric exceeds its threshold.
     *
     * @param metricName the name of the metric
     * @param domain the domain the metric belongs to
     * @param value the current value
     * @param threshold the threshold value
     */
    public void publishMetricThresholdEvent(String metricName, String domain, 
                                           double value, double threshold) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("metricName", metricName);
        payload.put("currentValue", value);
        payload.put("thresholdValue", threshold);
        
        CrossDomainEvent event = CrossDomainEvent.builder()
                .eventId(java.util.UUID.randomUUID().toString())
                .sourceDomain("CENTRALIZED_DASHBOARD")
                .sourceEntity("MetricMonitor")
                .eventType(CrossDomainEvent.EventType.THRESHOLD_EXCEEDED)
                .targetDomains(new String[]{"ALL"})
                .timestamp(java.time.LocalDateTime.now())
                .subject("MetricThreshold")
                .subjectId(metricName)
                .priority(CrossDomainEvent.EventPriority.MEDIUM)
                .payload(payload)
                .requiresAcknowledgement(false)
                .build();
        
        publishEvent(event);
    }
    
    /**
     * Create and publish a KPI status change event.
     *
     * @param kpiName the name of the KPI
     * @param domain the domain the KPI belongs to
     * @param oldStatus the old status
     * @param newStatus the new status
     */
    public void publishKpiStatusChangeEvent(String kpiName, String domain, 
                                           String oldStatus, String newStatus) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("kpiName", kpiName);
        payload.put("oldStatus", oldStatus);
        payload.put("newStatus", newStatus);
        
        CrossDomainEvent.EventPriority priority = "CRITICAL".equals(newStatus) ? 
                CrossDomainEvent.EventPriority.CRITICAL : CrossDomainEvent.EventPriority.HIGH;
        
        CrossDomainEvent event = CrossDomainEvent.builder()
                .eventId(java.util.UUID.randomUUID().toString())
                .sourceDomain("CENTRALIZED_DASHBOARD")
                .sourceEntity("KPIMonitor")
                .eventType(CrossDomainEvent.EventType.STATUS_CHANGED)
                .targetDomains(new String[]{"ALL"})
                .timestamp(java.time.LocalDateTime.now())
                .subject("KPIStatus")
                .subjectId(kpiName)
                .priority(priority)
                .payload(payload)
                .requiresAcknowledgement(false)
                .build();
        
        publishEvent(event);
    }
}
