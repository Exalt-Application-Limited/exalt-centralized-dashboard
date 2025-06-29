package com.exalt.centralizeddashboard.core.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Model class for events that occur across domain boundaries.
 * These events can be used for synchronization, notification, or trigger actions
 * in response to changes in different domains.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrossDomainEvent {

    /**
     * Unique identifier for the event
     */
    private String eventId;
    
    /**
     * The domain where the event originated
     */
    private String sourceDomain;
    
    /**
     * The entity or service that generated the event
     */
    private String sourceEntity;
    
    /**
     * Type of event (e.g., CREATED, UPDATED, DELETED, STATUS_CHANGED)
     */
    private EventType eventType;
    
    /**
     * The domain(s) that should receive this event
     */
    private String[] targetDomains;
    
    /**
     * When the event occurred
     */
    private LocalDateTime timestamp;
    
    /**
     * The subject of the event (e.g., "order", "shipment", "user")
     */
    private String subject;
    
    /**
     * The ID of the subject entity
     */
    private String subjectId;
    
    /**
     * Priority level of the event
     */
    private EventPriority priority;
    
    /**
     * Additional event data as key-value pairs
     */
    private Map<String, Object> payload;
    
    /**
     * Whether this event requires acknowledgment from receivers
     */
    private boolean requiresAcknowledgement;
    
    /**
     * Event types for cross-domain communication
     */
    public enum EventType {
        CREATED,
        UPDATED,
        DELETED,
        STATUS_CHANGED,
        THRESHOLD_EXCEEDED,
        ALERT_TRIGGERED,
        DATA_SYNCED,
        HEALTH_STATUS_CHANGED,
        CONFIGURATION_CHANGED,
        SECURITY_EVENT
    }
    
    /**
     * Priority levels for events
     */
    public enum EventPriority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}
