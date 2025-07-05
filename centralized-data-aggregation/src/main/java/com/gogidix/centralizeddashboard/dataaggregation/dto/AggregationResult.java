package com.gogidix.centralizeddashboard.dataaggregation.dto;

import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Data Transfer Object representing the result of a data aggregation operation.
 */
public class AggregationResult {
    private String id;
    private String timestamp;
    private List<DataSourceMetadata> dataSources;
    private String startDate;
    private String endDate;
    private Map<String, Object> data;

    public AggregationResult() {
        // Default constructor for deserialization
    }

    public AggregationResult(
            String id,
            String timestamp,
            List<DataSourceMetadata> dataSources,
            String startDate,
            String endDate,
            Map<String, Object> data) {
        this.id = id;
        this.timestamp = timestamp;
        this.dataSources = dataSources;
        this.startDate = startDate;
        this.endDate = endDate;
        this.data = data;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public List<DataSourceMetadata> getDataSources() {
        return dataSources;
    }

    public void setDataSources(List<DataSourceMetadata> dataSources) {
        this.dataSources = dataSources;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AggregationResult that = (AggregationResult) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(timestamp, that.timestamp) &&
                Objects.equals(dataSources, that.dataSources) &&
                Objects.equals(startDate, that.startDate) &&
                Objects.equals(endDate, that.endDate) &&
                Objects.equals(data, that.data);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, timestamp, dataSources, startDate, endDate, data);
    }

    @Override
    public String toString() {
        return "AggregationResult{" +
                "id='" + id + '\'' +
                ", timestamp='" + timestamp + '\'' +
                ", dataSources=" + dataSources +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", data=" + data +
                '}';
    }
} 