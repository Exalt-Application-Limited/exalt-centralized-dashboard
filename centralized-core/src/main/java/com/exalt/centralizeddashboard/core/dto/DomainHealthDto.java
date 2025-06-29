package com.exalt.centralizeddashboard.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for domain health status information.
 * Provides details about the operational status of a domain.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainHealthDto {
    
    /**
     * The name of the domain
     */
    private String domainName;
    
    /**
     * The current status (UP, DOWN, DEGRADED)
     */
    private String status;
    
    /**
     * Timestamp of last successful data sync
     */
    private LocalDateTime lastSyncTime;
    
    /**
     * Number of metrics currently available from this domain
     */
    private Integer metricCount;
    
    /**
     * Health score (0-100) representing overall domain health
     */
    private Integer healthScore;
    
    /**
     * Additional details about domain health
     */
    private String details;
}
