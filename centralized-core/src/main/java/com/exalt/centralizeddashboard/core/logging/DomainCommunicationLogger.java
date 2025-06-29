package com.exalt.centralizeddashboard.core.logging;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Logs all communication between domains for auditing, debugging, and monitoring purposes.
 * Provides structured logging with correlation IDs to trace requests across domain boundaries.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DomainCommunicationLogger {

    private final ObjectMapper objectMapper;
    
    // Track active communications by correlation ID
    private final ConcurrentMap<String, CommunicationContext> activeCommunications = new ConcurrentHashMap<>();
    
    /**
     * Logs the beginning of a communication between domains.
     *
     * @param sourceDomain the source domain
     * @param targetDomain the target domain
     * @param operationType the type of operation (e.g., "MetricCollection", "KPICalculation")
     * @param details additional details about the communication
     * @return a correlation ID to use for subsequent logs related to this communication
     */
    public String logCommunicationStart(String sourceDomain, String targetDomain, 
                                       String operationType, String details) {
        String correlationId = generateCorrelationId();
        
        // Set MDC context for structured logging
        MDC.put("correlationId", correlationId);
        MDC.put("sourceDomain", sourceDomain);
        MDC.put("targetDomain", targetDomain);
        MDC.put("operationType", operationType);
        
        try {
            // Create communication context
            CommunicationContext context = new CommunicationContext(
                    correlationId,
                    sourceDomain,
                    targetDomain,
                    operationType,
                    details,
                    LocalDateTime.now(),
                    null,
                    CommunicationStatus.IN_PROGRESS,
                    null
            );
            
            // Store in active communications
            activeCommunications.put(correlationId, context);
            
            // Log the start of communication
            log.info("DOMAIN_COMM_START - From: {} To: {} Op: {} Details: {}", 
                    sourceDomain, targetDomain, operationType, details);
            
            return correlationId;
        } finally {
            // Clear MDC context
            MDC.clear();
        }
    }
    
    /**
     * Logs the successful completion of a communication between domains.
     *
     * @param correlationId the correlation ID from logCommunicationStart
     * @param responseDetails details about the response
     */
    public void logCommunicationSuccess(String correlationId, String responseDetails) {
        CommunicationContext context = activeCommunications.get(correlationId);
        
        if (context == null) {
            log.warn("Attempted to log success for unknown correlation ID: {}", correlationId);
            return;
        }
        
        // Set MDC context for structured logging
        MDC.put("correlationId", correlationId);
        MDC.put("sourceDomain", context.getSourceDomain());
        MDC.put("targetDomain", context.getTargetDomain());
        MDC.put("operationType", context.getOperationType());
        
        try {
            // Update context
            context.setEndTime(LocalDateTime.now());
            context.setStatus(CommunicationStatus.COMPLETED);
            context.setResponseDetails(responseDetails);
            
            // Calculate duration
            long durationMs = java.time.Duration.between(
                    context.getStartTime(), context.getEndTime()).toMillis();
            
            // Log the success
            log.info("DOMAIN_COMM_SUCCESS - From: {} To: {} Op: {} Duration: {}ms Response: {}", 
                    context.getSourceDomain(), context.getTargetDomain(), 
                    context.getOperationType(), durationMs, responseDetails);
            
            // Remove from active communications
            activeCommunications.remove(correlationId);
            
            // Store in history (in a real implementation, this would be persisted to a database)
            storeInHistory(context);
        } finally {
            // Clear MDC context
            MDC.clear();
        }
    }
    
    /**
     * Logs the failure of a communication between domains.
     *
     * @param correlationId the correlation ID from logCommunicationStart
     * @param errorDetails details about the error
     * @param exception the exception that occurred, if any
     */
    public void logCommunicationFailure(String correlationId, String errorDetails, Throwable exception) {
        CommunicationContext context = activeCommunications.get(correlationId);
        
        if (context == null) {
            log.warn("Attempted to log failure for unknown correlation ID: {}", correlationId);
            return;
        }
        
        // Set MDC context for structured logging
        MDC.put("correlationId", correlationId);
        MDC.put("sourceDomain", context.getSourceDomain());
        MDC.put("targetDomain", context.getTargetDomain());
        MDC.put("operationType", context.getOperationType());
        
        try {
            // Update context
            context.setEndTime(LocalDateTime.now());
            context.setStatus(CommunicationStatus.FAILED);
            context.setResponseDetails(errorDetails);
            
            // Calculate duration
            long durationMs = java.time.Duration.between(
                    context.getStartTime(), context.getEndTime()).toMillis();
            
            // Log the failure
            if (exception != null) {
                log.error("DOMAIN_COMM_FAILURE - From: {} To: {} Op: {} Duration: {}ms Error: {}", 
                        context.getSourceDomain(), context.getTargetDomain(), 
                        context.getOperationType(), durationMs, errorDetails, exception);
            } else {
                log.error("DOMAIN_COMM_FAILURE - From: {} To: {} Op: {} Duration: {}ms Error: {}", 
                        context.getSourceDomain(), context.getTargetDomain(), 
                        context.getOperationType(), durationMs, errorDetails);
            }
            
            // Remove from active communications
            activeCommunications.remove(correlationId);
            
            // Store in history (in a real implementation, this would be persisted to a database)
            storeInHistory(context);
        } finally {
            // Clear MDC context
            MDC.clear();
        }
    }
    
    /**
     * Logs a message as part of an ongoing communication.
     *
     * @param correlationId the correlation ID from logCommunicationStart
     * @param message the message to log
     */
    public void logCommunicationMessage(String correlationId, String message) {
        CommunicationContext context = activeCommunications.get(correlationId);
        
        if (context == null) {
            log.warn("Attempted to log message for unknown correlation ID: {}", correlationId);
            return;
        }
        
        // Set MDC context for structured logging
        MDC.put("correlationId", correlationId);
        MDC.put("sourceDomain", context.getSourceDomain());
        MDC.put("targetDomain", context.getTargetDomain());
        MDC.put("operationType", context.getOperationType());
        
        try {
            // Log the message
            log.info("DOMAIN_COMM_MESSAGE - From: {} To: {} Op: {} Message: {}", 
                    context.getSourceDomain(), context.getTargetDomain(), 
                    context.getOperationType(), message);
        } finally {
            // Clear MDC context
            MDC.clear();
        }
    }
    
    /**
     * Generate a unique correlation ID.
     *
     * @return a unique correlation ID
     */
    private String generateCorrelationId() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Store a communication context in the history.
     * In a real implementation, this would persist to a database.
     *
     * @param context the communication context to store
     */
    private void storeInHistory(CommunicationContext context) {
        // In a real implementation, this would persist to a database
        try {
            String json = objectMapper.writeValueAsString(context);
            log.debug("Stored communication in history: {}", json);
        } catch (Exception e) {
            log.error("Error storing communication in history", e);
        }
    }
    
    /**
     * Clean up stale communications.
     * This would typically be scheduled to run periodically.
     */
    public void cleanupStaleCommunications() {
        log.info("Cleaning up stale communications");
        
        LocalDateTime threshold = LocalDateTime.now().minusHours(1);
        
        activeCommunications.entrySet().removeIf(entry -> {
            CommunicationContext context = entry.getValue();
            if (context.getStartTime().isBefore(threshold)) {
                log.warn("Found stale communication: {} From: {} To: {} Op: {}", 
                        context.getCorrelationId(), context.getSourceDomain(), 
                        context.getTargetDomain(), context.getOperationType());
                
                // Update context and store in history
                context.setEndTime(LocalDateTime.now());
                context.setStatus(CommunicationStatus.TIMED_OUT);
                context.setResponseDetails("Communication timed out");
                
                storeInHistory(context);
                
                return true;
            }
            return false;
        });
    }
    
    /**
     * Represents the context of a domain communication.
     */
    private static class CommunicationContext {
        private final String correlationId;
        private final String sourceDomain;
        private final String targetDomain;
        private final String operationType;
        private final String requestDetails;
        private final LocalDateTime startTime;
        private LocalDateTime endTime;
        private CommunicationStatus status;
        private String responseDetails;
        
        public CommunicationContext(String correlationId, String sourceDomain, String targetDomain,
                                  String operationType, String requestDetails, LocalDateTime startTime,
                                  LocalDateTime endTime, CommunicationStatus status, String responseDetails) {
            this.correlationId = correlationId;
            this.sourceDomain = sourceDomain;
            this.targetDomain = targetDomain;
            this.operationType = operationType;
            this.requestDetails = requestDetails;
            this.startTime = startTime;
            this.endTime = endTime;
            this.status = status;
            this.responseDetails = responseDetails;
        }
        
        public String getCorrelationId() { return correlationId; }
        public String getSourceDomain() { return sourceDomain; }
        public String getTargetDomain() { return targetDomain; }
        public String getOperationType() { return operationType; }
        public String getRequestDetails() { return requestDetails; }
        public LocalDateTime getStartTime() { return startTime; }
        public LocalDateTime getEndTime() { return endTime; }
        public CommunicationStatus getStatus() { return status; }
        public String getResponseDetails() { return responseDetails; }
        
        public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
        public void setStatus(CommunicationStatus status) { this.status = status; }
        public void setResponseDetails(String responseDetails) { this.responseDetails = responseDetails; }
    }
    
    /**
     * Enum representing the status of a domain communication.
     */
    private enum CommunicationStatus {
        IN_PROGRESS,
        COMPLETED,
        FAILED,
        TIMED_OUT
    }
}
