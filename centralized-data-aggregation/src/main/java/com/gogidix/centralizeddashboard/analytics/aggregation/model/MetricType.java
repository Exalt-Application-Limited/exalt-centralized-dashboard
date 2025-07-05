package com.gogidix.centralizeddashboard.analytics.aggregation.model;

/**
 * Enum representing different types of metrics
 */
public enum MetricType {
    COUNT,          // Simple count metric (e.g., number of orders)
    SUM,            // Sum of values (e.g., total revenue)
    AVERAGE,        // Average value (e.g., average order value)
    MIN,            // Minimum value
    MAX,            // Maximum value
    MEDIAN,         // Median value
    PERCENTILE,     // Percentile value (e.g., 95th percentile)
    RATE,           // Rate of change (e.g., conversion rate)
    RATIO,          // Ratio between two values (e.g., return rate)
    UNIQUE_COUNT,   // Count of unique values (e.g., unique users)
    HISTOGRAM,      // Distribution of values
    CUSTOM          // Custom metric type
} 