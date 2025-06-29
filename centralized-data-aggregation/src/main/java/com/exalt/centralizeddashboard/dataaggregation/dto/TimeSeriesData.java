package com.exalt.centralizeddashboard.dataaggregation.dto;

import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Data Transfer Object representing time series data for a specific metric.
 */
public class TimeSeriesData {
    private String metricName;
    private String startDate;
    private String endDate;
    private String interval;
    private List<String> services;
    private Map<String, Object> data;

    public TimeSeriesData() {
        // Default constructor for deserialization
    }

    public TimeSeriesData(
            String metricName,
            String startDate,
            String endDate,
            String interval,
            List<String> services,
            Map<String, Object> data) {
        this.metricName = metricName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.interval = interval;
        this.services = services;
        this.data = data;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
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

    public String getInterval() {
        return interval;
    }

    public void setInterval(String interval) {
        this.interval = interval;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services;
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
        TimeSeriesData that = (TimeSeriesData) o;
        return Objects.equals(metricName, that.metricName) &&
                Objects.equals(startDate, that.startDate) &&
                Objects.equals(endDate, that.endDate) &&
                Objects.equals(interval, that.interval) &&
                Objects.equals(services, that.services) &&
                Objects.equals(data, that.data);
    }

    @Override
    public int hashCode() {
        return Objects.hash(metricName, startDate, endDate, interval, services, data);
    }

    @Override
    public String toString() {
        return "TimeSeriesData{" +
                "metricName='" + metricName + '\'' +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", interval='" + interval + '\'' +
                ", services=" + services +
                ", data=" + data +
                '}';
    }
} 