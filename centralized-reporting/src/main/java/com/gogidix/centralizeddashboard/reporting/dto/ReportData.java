package com.gogidix.centralizeddashboard.reporting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object for report data
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReportData {
    private String reportId;
    private String reportName;
    private String dataSource;
    private List<String> headers;
    private List<Map<String, Object>> rows;
    private Map<String, Object> metadata;
    
    // The following fields/methods are needed by ExportService
    private List<String> columns;
    private List<Map<String, Object>> data;
    
    /**
     * Returns the data rows for this report
     * @return List of data rows as maps
     */
    public List<Map<String, Object>> getData() {
        return data != null ? data : rows;
    }
    
    /**
     * Returns the column names for this report
     * @return List of column names
     */
    public List<String> getColumns() {
        return columns != null ? columns : headers != null ? headers : new ArrayList<>();
    }
}
