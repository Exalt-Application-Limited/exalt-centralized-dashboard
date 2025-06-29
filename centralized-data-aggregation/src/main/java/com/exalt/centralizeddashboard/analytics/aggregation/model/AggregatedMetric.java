package com.exalt.centralizeddashboard.analytics.aggregation.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.data.annotation.CreatedDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing an aggregated metric
 */
@Entity
@Table(name = "aggregated_metrics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AggregatedMetric {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MetricType metricType;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String dimension;
    
    @Column(nullable = false)
    private Double value;
    
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @Column(nullable = false)
    private LocalDateTime endTime;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TimeGranularity granularity;
    
    @Column(nullable = false)
    @CreatedDate
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonAttributeConverter.class)
    @Builder.Default
    private Map<String, Object> attributes = new HashMap<>();

    /**
     * Add an attribute to the metrics attributes map
     * 
     * @param key the attribute key
     * @param value the attribute value
     */
    public void addAttribute(String key, Object value) {
        this.attributes.put(key, value);
    }
}