package com.exalt.centralizeddashboard.dataaggregation.exception;

/**
 * Exception thrown when there is an error during data aggregation.
 */
public class AggregationException extends RuntimeException {
    
    public AggregationException(String message) {
        super(message);
    }
    
    public AggregationException(String message, Throwable cause) {
        super(message, cause);
    }
} 