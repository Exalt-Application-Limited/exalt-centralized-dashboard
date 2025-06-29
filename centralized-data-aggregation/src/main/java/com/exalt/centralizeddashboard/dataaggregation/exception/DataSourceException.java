package com.exalt.centralizeddashboard.dataaggregation.exception;

/**
 * Exception thrown when there is an error with a data source during aggregation.
 */
public class DataSourceException extends RuntimeException {
    
    public DataSourceException(String message) {
        super(message);
    }
    
    public DataSourceException(String message, Throwable cause) {
        super(message, cause);
    }
} 