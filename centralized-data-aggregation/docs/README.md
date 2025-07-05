# Centralized Data Aggregation Documentation

## Overview
The Centralized Data Aggregation service is responsible for collecting, processing, and aggregating data from all Global HQ dashboards across different business domains in the Social E-commerce Ecosystem. It serves as the data consolidation layer that transforms disparate data sources into unified, analytics-ready datasets for the centralized dashboard.

## Components

### Core Components
- **DataAggregationService**: Main service orchestrating data collection and aggregation processes
- **AnalyticsService**: Advanced analytics processing and event-driven data analysis
- **AnalyticsAggregationScheduler**: Scheduled data aggregation tasks for automated processing
- **DataAggregationScheduler**: Time-based data collection scheduling from domain sources

### Data Processing Components
- **AggregatedMetric**: Core entity representing processed and aggregated metric data
- **AnalyticsEvent**: Event-driven data processing for real-time analytics
- **TimeSeriesData**: Time-series data structure for temporal analytics
- **AggregationRequest**: Request object for custom aggregation operations

### Repository Layer
- **AggregatedMetricRepository**: JPA repository for aggregated metrics storage
- **AnalyticsEventRepository**: Repository for analytics event persistence
- **AggregationCacheRepository**: Redis-based caching for aggregation results

### Configuration Components
- **RedisConfig**: Redis configuration for caching and temporary storage
- **WebClientConfig**: HTTP client configuration for external service communication
- **ServiceProperties**: Configuration properties for aggregation settings

## Getting Started
To use the Centralized Data Aggregation service, follow these steps:

1. Configure data source connections to all Global HQ dashboards
2. Set up Redis cache for performance optimization
3. Configure aggregation schedules and time granularities
4. Initialize database schema for metric storage
5. Set up monitoring and health check endpoints

## Examples

### Creating Custom Data Aggregation
```java
import com.gogidix.centralizeddashboard.dataaggregation.service.DataAggregationService;
import com.gogidix.centralizeddashboard.dataaggregation.dto.AggregationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomAggregationService {
    
    @Autowired
    private DataAggregationService aggregationService;
    
    public AggregationResult aggregateBusinessMetrics() {
        AggregationRequest request = AggregationRequest.builder()
            .dataSources(Arrays.asList(
                "social-commerce-dashboard",
                "warehousing-dashboard", 
                "courier-services-dashboard"
            ))
            .timeRange(TimeRange.LAST_24_HOURS)
            .granularity(TimeGranularity.HOURLY)
            .metrics(Arrays.asList(
                "total_revenue",
                "order_count",
                "inventory_turnover",
                "delivery_success_rate"
            ))
            .build();
            
        return aggregationService.aggregateData(request);
    }
}
```

### Implementing Analytics Event Processing
```java
import com.gogidix.centralizeddashboard.analytics.aggregation.model.AnalyticsEvent;
import com.gogidix.centralizeddashboard.analytics.aggregation.service.AnalyticsService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsEventProcessor {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @EventListener
    public void handleAnalyticsEvent(AnalyticsEvent event) {
        switch (event.getEventType()) {
            case SALES_COMPLETED:
                processSalesEvent(event);
                break;
            case INVENTORY_UPDATED:
                processInventoryEvent(event);
                break;
            case DELIVERY_COMPLETED:
                processDeliveryEvent(event);
                break;
        }
    }
    
    private void processSalesEvent(AnalyticsEvent event) {
        Map<String, Object> data = event.getData();
        BigDecimal revenue = (BigDecimal) data.get("revenue");
        String region = (String) data.get("region");
        
        analyticsService.updateRevenueMetrics(revenue, region, event.getTimestamp());
    }
}
```

### Scheduled Data Aggregation
```java
import com.gogidix.centralizeddashboard.analytics.aggregation.scheduler.DataAggregationScheduler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CustomDataAggregationScheduler {
    
    @Autowired
    private DataAggregationService aggregationService;
    
    @Scheduled(cron = "0 0 * * * *") // Every hour
    public void aggregateHourlyMetrics() {
        List<String> domains = Arrays.asList(
            "social-commerce", 
            "warehousing", 
            "courier-services"
        );
        
        for (String domain : domains) {
            try {
                AggregationResult result = aggregationService.aggregateHourlyData(domain);
                log.info("Aggregated {} metrics for domain: {}", 
                    result.getMetricCount(), domain);
            } catch (Exception e) {
                log.error("Failed to aggregate data for domain: {}", domain, e);
            }
        }
    }
    
    @Scheduled(cron = "0 0 0 * * *") // Daily at midnight
    public void aggregateDailyMetrics() {
        aggregationService.generateDailySummary();
    }
    
    @Scheduled(cron = "0 0 0 1 * *") // Monthly on 1st day
    public void aggregateMonthlyMetrics() {
        aggregationService.generateMonthlySummary();
    }
}
```

### Time Series Data Processing
```java
import com.gogidix.centralizeddashboard.dataaggregation.dto.TimeSeriesData;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.TimeGranularity;
import org.springframework.stereotype.Service;

@Service
public class TimeSeriesAnalyticsService {
    
    public TimeSeriesData calculateTrends(String metricName, TimeGranularity granularity) {
        List<DataPoint> dataPoints = getHistoricalData(metricName, granularity);
        
        return TimeSeriesData.builder()
            .metricName(metricName)
            .granularity(granularity)
            .dataPoints(dataPoints)
            .trendDirection(calculateTrendDirection(dataPoints))
            .changePercentage(calculateChangePercentage(dataPoints))
            .forecastPoints(generateForecast(dataPoints))
            .build();
    }
    
    public List<TimeSeriesData> compareAcrossDomains(String metricName) {
        return Arrays.asList("social-commerce", "warehousing", "courier-services")
            .stream()
            .map(domain -> getDomainTimeSeriesData(domain, metricName))
            .collect(Collectors.toList());
    }
    
    private TrendDirection calculateTrendDirection(List<DataPoint> dataPoints) {
        if (dataPoints.size() < 2) return TrendDirection.STABLE;
        
        DataPoint first = dataPoints.get(0);
        DataPoint last = dataPoints.get(dataPoints.size() - 1);
        
        double changePercentage = ((last.getValue() - first.getValue()) / first.getValue()) * 100;
        
        if (changePercentage > 5) return TrendDirection.INCREASING;
        if (changePercentage < -5) return TrendDirection.DECREASING;
        return TrendDirection.STABLE;
    }
}
```

### Cache-Optimized Aggregation
```java
import com.gogidix.centralizeddashboard.dataaggregation.repository.AggregationCacheRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class CachedAggregationService {
    
    @Autowired
    private AggregationCacheRepository cacheRepository;
    
    @Cacheable(value = "aggregation-results", key = "#domain + '_' + #metricType + '_' + #timeRange")
    public AggregationResult getAggregatedData(String domain, String metricType, String timeRange) {
        return performExpensiveAggregation(domain, metricType, timeRange);
    }
    
    @CacheEvict(value = "aggregation-results", key = "#domain + '_*'")
    public void evictDomainCache(String domain) {
        log.info("Evicted cache for domain: {}", domain);
    }
    
    @CacheEvict(value = "aggregation-results", allEntries = true)
    @Scheduled(fixedRate = 3600000) // Every hour
    public void evictExpiredCache() {
        log.debug("Clearing expired aggregation cache");
    }
    
    public void warmUpCache() {
        List<String> domains = Arrays.asList("social-commerce", "warehousing", "courier-services");
        List<String> metrics = Arrays.asList("revenue", "orders", "inventory", "deliveries");
        
        domains.parallelStream().forEach(domain -> {
            metrics.forEach(metric -> {
                getAggregatedData(domain, metric, "24h");
                getAggregatedData(domain, metric, "7d");
                getAggregatedData(domain, metric, "30d");
            });
        });
    }
}
```

## Best Practices
1. **Data Quality**: Implement data validation and cleansing before aggregation
2. **Performance**: Use Redis caching for frequently accessed aggregations
3. **Scalability**: Design aggregation jobs to be horizontally scalable
4. **Error Handling**: Implement robust error handling for data source failures
5. **Monitoring**: Set up comprehensive monitoring for aggregation pipeline health
6. **Data Retention**: Implement proper data retention policies for aggregated metrics
7. **Schema Evolution**: Design flexible schemas to accommodate new data sources
8. **Real-time Processing**: Balance batch and real-time aggregation based on requirements

## Technology Stack
- **Framework**: Spring Boot 3.x with Java 17
- **Data Processing**: Spring Batch for large-scale data processing
- **Database**: PostgreSQL for persistent storage
- **Caching**: Redis for aggregation result caching
- **Scheduling**: Spring Scheduler for automated aggregation tasks
- **Web Client**: WebFlux WebClient for reactive HTTP communications
- **Monitoring**: Spring Boot Actuator with custom metrics
- **Testing**: JUnit 5, Testcontainers for integration testing

## Integration Points
The Centralized Data Aggregation service integrates with:
- **Social Commerce Dashboard**: E-commerce metrics, user analytics, sales data
- **Warehousing Dashboard**: Inventory levels, fulfillment metrics, warehouse operations
- **Courier Services Dashboard**: Delivery performance, logistics data, shipping analytics
- **Centralized Core**: Processed aggregations for dashboard consumption
- **Real-Time Data Service**: Live data streams for immediate aggregation
- **Performance Metrics Service**: System performance data aggregation