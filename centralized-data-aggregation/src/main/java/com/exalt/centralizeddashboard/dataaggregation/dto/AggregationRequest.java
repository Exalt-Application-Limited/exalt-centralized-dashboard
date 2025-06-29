package com.exalt.centralizeddashboard.dataaggregation.dto;

import java.util.List;
import java.util.Objects;

/**
 * Data Transfer Object representing a request for data aggregation.
 */
public class AggregationRequest {
    private List<DataSourceMetadata> dataSources;
    private String startDate;
    private String endDate;
    private List<String> aggregationFunctions;
    private boolean cacheable;
    private String cacheKey;

    public AggregationRequest() {
        // Default constructor for deserialization
    }

    public AggregationRequest(
            List<DataSourceMetadata> dataSources,
            String startDate,
            String endDate,
            List<String> aggregationFunctions,
            boolean cacheable) {
        this.dataSources = dataSources;
        this.startDate = startDate;
        this.endDate = endDate;
        this.aggregationFunctions = aggregationFunctions;
        this.cacheable = cacheable;
        
        // Generate a cache key based on the request parameters
        this.cacheKey = generateCacheKey();
    }

    /**
     * Generates a cache key based on the request parameters.
     * This key is used to cache and retrieve aggregation results.
     * 
     * @return A unique cache key string
     */
    private String generateCacheKey() {
        StringBuilder keyBuilder = new StringBuilder();
        
        if (dataSources != null) {
            for (DataSourceMetadata source : dataSources) {
                keyBuilder.append(source.getServiceName())
                        .append(":")
                        .append(source.getEndpoint())
                        .append(";");
            }
        }
        
        keyBuilder.append(startDate != null ? startDate : "")
                .append(":")
                .append(endDate != null ? endDate : "");
        
        if (aggregationFunctions != null) {
            keyBuilder.append(":");
            for (String function : aggregationFunctions) {
                keyBuilder.append(function).append(",");
            }
        }
        
        return keyBuilder.toString();
    }

    public List<DataSourceMetadata> getDataSources() {
        return dataSources;
    }

    public void setDataSources(List<DataSourceMetadata> dataSources) {
        this.dataSources = dataSources;
        this.cacheKey = generateCacheKey(); // Update cache key when data sources change
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
        this.cacheKey = generateCacheKey(); // Update cache key when start date changes
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
        this.cacheKey = generateCacheKey(); // Update cache key when end date changes
    }

    public List<String> getAggregationFunctions() {
        return aggregationFunctions;
    }

    public void setAggregationFunctions(List<String> aggregationFunctions) {
        this.aggregationFunctions = aggregationFunctions;
        this.cacheKey = generateCacheKey(); // Update cache key when aggregation functions change
    }

    public boolean isCacheable() {
        return cacheable;
    }

    public void setCacheable(boolean cacheable) {
        this.cacheable = cacheable;
    }

    public String getCacheKey() {
        return cacheKey;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AggregationRequest that = (AggregationRequest) o;
        return cacheable == that.cacheable &&
                Objects.equals(dataSources, that.dataSources) &&
                Objects.equals(startDate, that.startDate) &&
                Objects.equals(endDate, that.endDate) &&
                Objects.equals(aggregationFunctions, that.aggregationFunctions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dataSources, startDate, endDate, aggregationFunctions, cacheable);
    }

    @Override
    public String toString() {
        return "AggregationRequest{" +
                "dataSources=" + dataSources +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", aggregationFunctions=" + aggregationFunctions +
                ", cacheable=" + cacheable +
                '}';
    }
} 