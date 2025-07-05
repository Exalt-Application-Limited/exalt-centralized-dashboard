package com.gogidix.centralizeddashboard.reporting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for export request parameters
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExportRequest {
    private String type; // CSV, PDF, Excel, etc.
    private String reportType; // The type of report (sales, inventory, etc.)
    private String dataSource;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<String> metrics;
    private List<String> dimensions;
    private String format;
    private String fileName;
    private String emailTo;
    private boolean scheduled;
    private String scheduleCron;
    
    /**
     * Gets the report type. For backward compatibility with older code.
     * @return The report type, or the type field if reportType is null
     */
    public String getReportType() {
        return reportType != null ? reportType : type;
    }
}
