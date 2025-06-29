package com.exalt.centralizeddashboard.metrics.model;

/**
 * Enum representing different types of performance metrics
 */
public enum MetricType {
    COUNTER,        // A metric that represents a single numerical value that only ever goes up
    GAUGE,          // A metric that represents a single numerical value that can go up and down
    HISTOGRAM,      // A metric that samples observations and counts them in configurable buckets
    SUMMARY,        // Similar to a histogram, but also calculates quantiles over a sliding time window
    TIMER,          // A metric that measures timing (latency, processing time)
    METER,          // A metric that measures the rate at which events occur
    TASK            // A metric that tracks task execution
} 