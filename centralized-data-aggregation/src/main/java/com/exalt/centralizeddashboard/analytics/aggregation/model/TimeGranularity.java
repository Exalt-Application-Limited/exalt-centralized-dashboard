package com.exalt.centralizeddashboard.analytics.aggregation.model;

/**
 * Enum representing different time granularities for aggregated metrics
 */
public enum TimeGranularity {
    MINUTE,    // Per-minute granularity
    HOUR,      // Hourly granularity
    DAY,       // Daily granularity
    WEEK,      // Weekly granularity
    MONTH,     // Monthly granularity
    QUARTER,   // Quarterly granularity
    YEAR,      // Yearly granularity
    CUSTOM     // Custom granularity
} 