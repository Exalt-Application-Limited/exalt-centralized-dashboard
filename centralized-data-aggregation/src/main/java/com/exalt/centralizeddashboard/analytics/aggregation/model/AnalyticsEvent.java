package com.exalt.centralizeddashboard.analytics.aggregation.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.Convert;

import org.springframework.data.annotation.CreatedDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Base entity for all analytics events collected in the system
 */
@Entity
@Table(name = "analytics_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsEvent {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EventType eventType;
    
    @Column(nullable = false)
    private String sourceService;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    @CreatedDate
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    
    @Column(nullable = false)
    private String sessionId;
    
    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonAttributeConverter.class)
    @Builder.Default
    private Map<String, Object> attributes = new HashMap<>();
    
    @Transient
    @Builder.Default
    private Map<String, Object> transientData = new HashMap<>();

    /**
     * Add an attribute to the event attributes map
     * 
     * @param key the attribute key
     * @param value the attribute value
     */
    public void addAttribute(String key, Object value) {
        this.attributes.put(key, value);
    }
    
    /**
     * Add transient data that is not persisted
     * 
     * @param key the data key
     * @param value the data value
     */
    public void addTransientData(String key, Object value) {
        this.transientData.put(key, value);
    }
    
    /**
     * Returns a client-safe representation of the event,
     * suitable for sending to frontends
     */
    public Map<String, Object> toPublicMap() {
        Map<String, Object> publicView = new HashMap<>();
        publicView.put("id", id);
        publicView.put("eventType", eventType.name());
        publicView.put("sourceService", sourceService);
        publicView.put("timestamp", timestamp);
        publicView.put("attributes", attributes);
        return publicView;
    }
} 