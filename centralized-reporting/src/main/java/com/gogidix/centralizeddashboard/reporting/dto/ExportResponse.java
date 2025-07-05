package com.gogidix.centralizeddashboard.reporting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for export response
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExportResponse {
    // Original fields
    private String id;
    private String status;
    private String fileUrl;
    private String fileType;
    private long fileSize;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String message;
    
    // Additional fields needed by ExportService
    private String exportId;
    private String downloadUrl;
    private String filename;
    private String contentType;
    
    /**
     * Builder method for exportId to maintain compatibility
     * @param exportId The export ID
     * @return The builder instance
     */
    public static class ExportResponseBuilder {
        public ExportResponseBuilder exportId(String exportId) {
            this.exportId = exportId;
            this.id = exportId; // For backward compatibility
            return this;
        }
        
        public ExportResponseBuilder downloadUrl(String downloadUrl) {
            this.downloadUrl = downloadUrl;
            this.fileUrl = downloadUrl; // For backward compatibility
            return this;
        }
    }
}
