# Centralized Data Aggregation API Documentation

## Core Service API

### DataAggregationService
- DataAggregationService(): Default constructor
- aggregateData(request: AggregationRequest): AggregationResult: Execute data aggregation
- aggregateHourlyData(domain: String): AggregationResult: Aggregate hourly domain data
- aggregateDailyData(domain: String): AggregationResult: Aggregate daily domain data
- generateDailySummary(): void: Generate daily summary across all domains
- generateMonthlySummary(): void: Generate monthly summary report
- getAggregationHistory(domain: String, days: int): List<AggregationResult>: Get historical aggregations

### AnalyticsService
- AnalyticsService(): Default constructor
- processAnalyticsEvent(event: AnalyticsEvent): void: Process analytics events
- updateRevenueMetrics(revenue: BigDecimal, region: String, timestamp: LocalDateTime): void: Update revenue metrics
- calculateTrends(metricName: String, granularity: TimeGranularity): TimeSeriesData: Calculate metric trends
- generateBusinessInsights(domains: List<String>): List<BusinessInsight>: Generate business insights
- detectAnomalies(metricName: String, threshold: double): List<Anomaly>: Detect metric anomalies

## REST API Endpoints

### Data Aggregation
- POST /api/v1/aggregation/execute: Execute custom aggregation
- GET /api/v1/aggregation/results/{domain}: Get aggregation results for domain
- GET /api/v1/aggregation/history: Get aggregation history
- POST /api/v1/aggregation/schedule: Schedule recurring aggregation
- DELETE /api/v1/aggregation/schedule/{scheduleId}: Remove aggregation schedule

### Analytics Processing
- POST /api/v1/analytics/events: Submit analytics event
- GET /api/v1/analytics/trends/{metricName}: Get metric trends
- GET /api/v1/analytics/insights: Get business insights
- GET /api/v1/analytics/anomalies: Get detected anomalies
- POST /api/v1/analytics/forecast: Generate forecasts

### Cache Management
- POST /api/v1/cache/warm-up: Warm up aggregation cache
- DELETE /api/v1/cache/evict/{domain}: Evict domain cache
- GET /api/v1/cache/stats: Get cache statistics

## Data Models

### AggregationRequest
```java
public class AggregationRequest {
    private List<String> dataSources;
    private TimeRange timeRange;
    private TimeGranularity granularity;
    private List<String> metrics;
    private Map<String, Object> filters;
    private AggregationType aggregationType;
}
```

### AggregationResult
```java
public class AggregationResult {
    private String aggregationId;
    private LocalDateTime timestamp;
    private List<AggregatedMetric> metrics;
    private int metricCount;
    private Duration processingTime;
    private AggregationStatus status;
    private String domain;
}
```

### AnalyticsEvent
```java
public class AnalyticsEvent {
    private String eventId;
    private EventType eventType;
    private String domain;
    private LocalDateTime timestamp;
    private Map<String, Object> data;
    private String source;
}
```