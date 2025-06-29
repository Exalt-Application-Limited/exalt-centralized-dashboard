package com.exalt.centralizeddashboard.dataaggregation.dto;

import java.util.Objects;

/**
 * Data Transfer Object representing metadata about a data source.
 * Each data source is defined by a service name and an endpoint.
 */
public class DataSourceMetadata {
    private String serviceName;
    private String endpoint;
    private boolean timeRangeRequired;
    private String metricName;
    private String metricType;

    public DataSourceMetadata() {
        // Default constructor for deserialization
    }

    public DataSourceMetadata(
            String serviceName,
            String endpoint,
            boolean timeRangeRequired,
            String metricName,
            String metricType) {
        this.serviceName = serviceName;
        this.endpoint = endpoint;
        this.timeRangeRequired = timeRangeRequired;
        this.metricName = metricName;
        this.metricType = metricType;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public boolean isTimeRangeRequired() {
        return timeRangeRequired;
    }

    public void setTimeRangeRequired(boolean timeRangeRequired) {
        this.timeRangeRequired = timeRangeRequired;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public String getMetricType() {
        return metricType;
    }

    public void setMetricType(String metricType) {
        this.metricType = metricType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DataSourceMetadata that = (DataSourceMetadata) o;
        return timeRangeRequired == that.timeRangeRequired &&
                Objects.equals(serviceName, that.serviceName) &&
                Objects.equals(endpoint, that.endpoint) &&
                Objects.equals(metricName, that.metricName) &&
                Objects.equals(metricType, that.metricType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(serviceName, endpoint, timeRangeRequired, metricName, metricType);
    }

    @Override
    public String toString() {
        return "DataSourceMetadata{" +
                "serviceName='" + serviceName + '\'' +
                ", endpoint='" + endpoint + '\'' +
                ", timeRangeRequired=" + timeRangeRequired +
                ", metricName='" + metricName + '\'' +
                ", metricType='" + metricType + '\'' +
                '}';
    }
} 