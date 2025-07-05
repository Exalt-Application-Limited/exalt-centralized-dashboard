package com.gogidix.centralizeddashboard.reporting.exception;

/**
 * Exception thrown during export operations
 */
public class ExportException extends RuntimeException {
    
    public ExportException(String message) {
        super(message);
    }
    
    public ExportException(String message, Throwable cause) {
        super(message, cause);
    }
}
