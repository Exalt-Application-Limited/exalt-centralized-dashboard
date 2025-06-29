package com.exalt.centralizeddashboard.core.events;

import com.exalt.centralizeddashboard.core.integration.CourierServiceClient;
import com.exalt.centralizeddashboard.core.integration.SocialCommerceClient;
import com.exalt.centralizeddashboard.core.integration.WarehousingClient;
import com.exalt.centralizeddashboard.core.model.DashboardMetric;
import com.exalt.centralizeddashboard.core.service.KPIService;
import com.exalt.centralizeddashboard.core.service.MetricCollectorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Handles cross-domain events and manages event routing, processing, and acknowledgment.
 * This component serves as the central hub for event-driven communication between domains.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CrossDomainEventHandler {

    private final MetricCollectorService metricCollectorService;
    private final KPIService kpiService;
    private final CourierServiceClient courierServiceClient;
    private final SocialCommerceClient socialCommerceClient;
    private final WarehousingClient warehousingClient;
    private final CrossDomainEventPublisher eventPublisher;
    
    // Track events that have been processed to avoid duplicates
    private final Set<String> processedEvents = ConcurrentHashMap.newKeySet();
    
    // Track events that require acknowledgment
    private final Set<String> pendingAcknowledgments = new HashSet<>();
    
    /**
     * Process an incoming cross-domain event.
     * This is the main entry point for handling events from other domains.
     *
     * @param event the cross-domain event to process
     * @return true if the event was processed successfully, false otherwise
     */
    @EventListener
    @Async
    public boolean handleEvent(CrossDomainEvent event) {
        String eventId = event.getEventId();
        
        // Check for duplicate events
        if (processedEvents.contains(eventId)) {
            log.info("Duplicate event received and ignored: {}", eventId);
            return true;
        }
        
        log.info("Handling cross-domain event: {} from {} [{}]", 
                event.getEventType(), event.getSourceDomain(), eventId);
        
        try {
            // Process the event based on its type
            boolean processed = processEventByType(event);
            
            if (processed) {
                // Mark as processed to avoid duplicates
                processedEvents.add(eventId);
                
                // Send acknowledgment if required
                if (event.isRequiresAcknowledgement()) {
                    sendAcknowledgment(event);
                }
                
                return true;
            } else {
                log.warn("Failed to process event: {}", eventId);
                return false;
            }
        } catch (Exception e) {
            log.error("Error processing cross-domain event: {}", eventId, e);
            return false;
        }
    }
    
    /**
     * Process an event based on its type.
     *
     * @param event the event to process
     * @return true if processed successfully, false otherwise
     */
    private boolean processEventByType(CrossDomainEvent event) {
        switch (event.getEventType()) {
            case CREATED:
            case UPDATED:
            case DELETED:
                return handleEntityChangeEvent(event);
                
            case STATUS_CHANGED:
                return handleStatusChangeEvent(event);
                
            case THRESHOLD_EXCEEDED:
                return handleThresholdEvent(event);
                
            case ALERT_TRIGGERED:
                return handleAlertEvent(event);
                
            case DATA_SYNCED:
                return handleDataSyncEvent(event);
                
            case HEALTH_STATUS_CHANGED:
                return handleHealthStatusChangeEvent(event);
                
            case CONFIGURATION_CHANGED:
                return handleConfigurationChangeEvent(event);
                
            case SECURITY_EVENT:
                return handleSecurityEvent(event);
                
            default:
                log.warn("Unhandled event type: {}", event.getEventType());
                return false;
        }
    }
    
    /**
     * Handle entity change events (creation, update, deletion).
     *
     * @param event the entity change event
     * @return true if handled successfully
     */
    private boolean handleEntityChangeEvent(CrossDomainEvent event) {
        // Refresh relevant metrics based on entity changes
        metricCollectorService.refreshMetricsForDomain(convertToDomainEnum(event.getSourceDomain()));
        
        // Recalculate KPIs that depend on the changed entity
        if (event.getSubject() != null && event.getSubjectId() != null) {
            kpiService.recalculateKPIsForEntity(event.getSubject(), event.getSubjectId());
        }
        
        return true;
    }
    
    /**
     * Handle status change events (e.g., order status, delivery status).
     *
     * @param event the status change event
     * @return true if handled successfully
     */
    private boolean handleStatusChangeEvent(CrossDomainEvent event) {
        // Update status-related metrics
        metricCollectorService.refreshMetricsForDomain(convertToDomainEnum(event.getSourceDomain()));
        
        // Potentially trigger other events based on status changes
        if (shouldGenerateFollowUpEvent(event)) {
            generateFollowUpEvent(event);
        }
        
        return true;
    }
    
    /**
     * Handle threshold exceeded events.
     *
     * @param event the threshold event
     * @return true if handled successfully
     */
    private boolean handleThresholdEvent(CrossDomainEvent event) {
        // Update KPIs affected by the threshold
        kpiService.updateKPIStatus(
                event.getPayload().get("kpiName").toString(),
                event.getSourceDomain(),
                event.getPayload().get("thresholdValue").toString()
        );
        
        return true;
    }
    
    /**
     * Handle alert events.
     *
     * @param event the alert event
     * @return true if handled successfully
     */
    private boolean handleAlertEvent(CrossDomainEvent event) {
        // Log the alert
        log.warn("Alert from {}: {} [Priority: {}]", 
                event.getSourceDomain(), 
                event.getPayload().get("alertMessage"), 
                event.getPriority());
        
        // Store the alert for dashboard display
        // In a real implementation, this would be stored in a database
        
        return true;
    }
    
    /**
     * Handle data synchronization events.
     *
     * @param event the data sync event
     * @return true if handled successfully
     */
    private boolean handleDataSyncEvent(CrossDomainEvent event) {
        // Trigger a refresh of metrics for the domain
        metricCollectorService.refreshMetricsForDomain(convertToDomainEnum(event.getSourceDomain()));
        
        return true;
    }
    
    /**
     * Handle health status change events.
     *
     * @param event the health status event
     * @return true if handled successfully
     */
    private boolean handleHealthStatusChangeEvent(CrossDomainEvent event) {
        // Update domain health status tracking
        String status = event.getPayload().get("status").toString();
        log.info("Domain {} health status changed to {}", event.getSourceDomain(), status);
        
        // In a real implementation, update health status in a repository
        
        return true;
    }
    
    /**
     * Handle configuration change events.
     *
     * @param event the configuration change event
     * @return true if handled successfully
     */
    private boolean handleConfigurationChangeEvent(CrossDomainEvent event) {
        // Refresh any cached configuration
        log.info("Configuration changed in domain {}: {}", 
                event.getSourceDomain(), 
                event.getPayload().get("configKey"));
        
        // In a real implementation, refresh relevant configuration
        
        return true;
    }
    
    /**
     * Handle security events.
     *
     * @param event the security event
     * @return true if handled successfully
     */
    private boolean handleSecurityEvent(CrossDomainEvent event) {
        // Log security events with high visibility
        log.warn("SECURITY EVENT from {}: {} [{}]", 
                event.getSourceDomain(),
                event.getPayload().get("securityMessage"),
                event.getPriority());
        
        // In a real implementation, take appropriate security measures
        
        return true;
    }
    
    /**
     * Send an acknowledgment for an event.
     *
     * @param event the event to acknowledge
     */
    private void sendAcknowledgment(CrossDomainEvent event) {
        CrossDomainEvent ackEvent = CrossDomainEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .sourceDomain("CENTRALIZED_DASHBOARD")
                .sourceEntity("CrossDomainEventHandler")
                .eventType(CrossDomainEvent.EventType.DATA_SYNCED)
                .targetDomains(new String[]{event.getSourceDomain()})
                .timestamp(java.time.LocalDateTime.now())
                .subject("EventAcknowledgment")
                .subjectId(event.getEventId())
                .priority(CrossDomainEvent.EventPriority.LOW)
                .requiresAcknowledgement(false)
                .build();
        
        // Publish the acknowledgment event
        eventPublisher.publishEvent(ackEvent);
        
        log.debug("Sent acknowledgment for event: {}", event.getEventId());
    }
    
    /**
     * Determine if a follow-up event should be generated.
     *
     * @param event the original event
     * @return true if a follow-up event should be generated
     */
    private boolean shouldGenerateFollowUpEvent(CrossDomainEvent event) {
        // Example: Generate follow-up events for high-priority status changes
        return event.getPriority() == CrossDomainEvent.EventPriority.HIGH ||
               event.getPriority() == CrossDomainEvent.EventPriority.CRITICAL;
    }
    
    /**
     * Generate a follow-up event based on the original event.
     *
     * @param originalEvent the original event
     */
    private void generateFollowUpEvent(CrossDomainEvent originalEvent) {
        // Example: Create an alert event for high-priority status changes
        CrossDomainEvent followUpEvent = CrossDomainEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .sourceDomain("CENTRALIZED_DASHBOARD")
                .sourceEntity("CrossDomainEventHandler")
                .eventType(CrossDomainEvent.EventType.ALERT_TRIGGERED)
                .targetDomains(new String[]{"ALL"})
                .timestamp(java.time.LocalDateTime.now())
                .subject("StatusChangeAlert")
                .subjectId(originalEvent.getSubjectId())
                .priority(originalEvent.getPriority())
                .requiresAcknowledgement(false)
                .build();
        
        // Publish the follow-up event
        eventPublisher.publishEvent(followUpEvent);
        
        log.info("Generated follow-up alert event for: {}", originalEvent.getEventId());
    }
    
    /**
     * Clean up old processed events to prevent memory leaks.
     * This would typically be scheduled to run periodically.
     */
    public void cleanupProcessedEvents() {
        // In a real implementation, this would be more sophisticated,
        // perhaps keeping events for a certain time window
        if (processedEvents.size() > 10000) {
            log.info("Cleaning up processed events cache");
            processedEvents.clear();
        }
    }
    
    /**
     * Helper method to convert String domain to SourceDomain enum
     * 
     * @param domain the domain as a string
     * @return the corresponding SourceDomain enum value
     */
    private DashboardMetric.SourceDomain convertToDomainEnum(String domain) {
        if (domain == null) {
            return DashboardMetric.SourceDomain.SOCIAL_COMMERCE; // Default domain
        }
        
        try {
            return DashboardMetric.SourceDomain.valueOf(domain.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle case when string doesn't match any enum value
            switch (domain.toLowerCase()) {
                case "social":
                case "social_commerce":
                case "social commerce":
                    return DashboardMetric.SourceDomain.SOCIAL_COMMERCE;
                case "warehouse":
                case "warehousing":
                    return DashboardMetric.SourceDomain.WAREHOUSING;
                case "courier":
                case "courier_services":
                case "courier services":
                    return DashboardMetric.SourceDomain.COURIER_SERVICES;
                default:
                    return DashboardMetric.SourceDomain.SOCIAL_COMMERCE; // Default fallback
            }
        }
    }
}
