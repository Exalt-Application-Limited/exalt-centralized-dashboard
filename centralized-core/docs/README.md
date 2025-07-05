# Centralized Dashboard Core Documentation

## Overview
The Centralized Dashboard Core is the main backend service providing comprehensive business intelligence aggregation and cross-domain analytics for the Social E-commerce Ecosystem. It serves as the central orchestration layer that collects, normalizes, and exposes data from all Global HQ dashboards across different business domains (Social Commerce, Warehousing, and Courier Services).

## Components

### Core Components
- **CrossDomainDashboardService**: Central service orchestrating data collection from all domains
- **MetricCollectorService**: Service responsible for collecting and processing metrics from domain services
- **KPIService**: Business Key Performance Indicator management and calculation service
- **DataNormalizationService**: Service for standardizing data formats across different domains

### Domain Data Collectors
- **SocialCommerceDataCollector**: Collects analytics data from social commerce platforms
- **WarehouseDataCollector**: Aggregates warehouse and inventory management metrics
- **CourierServiceDataCollector**: Gathers logistics and delivery performance data
- **DomainDataCollector**: Abstract base collector providing common collection functionality

### Integration Services
- **CrossDomainIntegrationService**: Manages communication between different domain services
- **AdminFrameworkClient**: Integration with shared admin framework components
- **SocialCommerceClient**: Feign client for social commerce service communication
- **WarehousingClient**: Feign client for warehousing service integration
- **CourierServiceClient**: Feign client for courier services data retrieval

### Enhanced Analytics
- **EnhancedDomainAnalyticsService**: Advanced analytics engine for cross-domain insights
- **EnhancedSocialCommerceAnalytics**: Deep analytics for social commerce metrics
- **EnhancedWarehousingAnalytics**: Advanced warehouse performance analysis
- **EnhancedCourierAnalytics**: Comprehensive logistics and delivery analytics

### Data Models
- **DashboardKPI**: Core KPI entity with calculation logic and thresholds
- **DashboardMetric**: Standard metric entity for storing numerical data points
- **CrossDomainInsight**: Advanced insights derived from cross-domain correlation analysis
- **TrendData**: Time-series data structure for trend analysis

## Getting Started
To use the Centralized Dashboard Core service, follow these steps:

1. Configure database connection and Redis cache settings
2. Set up integration endpoints for all domain services (Social Commerce, Warehousing, Courier Services)
3. Configure authentication and security settings for cross-domain communication
4. Initialize data collection schedules and KPI calculation intervals
5. Set up monitoring and health check endpoints

## Examples

### Creating a Custom Domain Data Collector
```java
import com.gogidix.centralizeddashboard.core.collection.DomainDataCollector;
import com.gogidix.centralizeddashboard.core.collection.DomainMetric;
import org.springframework.stereotype.Component;

@Component
public class CustomDomainDataCollector extends DomainDataCollector {
    
    @Override
    protected String getDomainName() {
        return "custom-domain";
    }
    
    @Override
    protected List<DomainMetric> collectDomainMetrics() {
        return Arrays.asList(
            DomainMetric.builder()
                .metricName("total_transactions")
                .value(BigDecimal.valueOf(calculateTotalTransactions()))
                .timestamp(LocalDateTime.now())
                .domain(getDomainName())
                .build(),
            DomainMetric.builder()
                .metricName("average_response_time")
                .value(BigDecimal.valueOf(getAverageResponseTime()))
                .timestamp(LocalDateTime.now())
                .domain(getDomainName())
                .build()
        );
    }
    
    @Override
    protected boolean isHealthy() {
        // Implement health check logic
        return pingDomainService() && validateDataIntegrity();
    }
}
```

### Implementing Cross-Domain Analytics
```java
import com.gogidix.centralizeddashboard.core.service.CrossDomainDashboardService;
import com.gogidix.centralizeddashboard.core.model.CrossDomainInsight;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BusinessIntelligenceService {
    
    @Autowired
    private CrossDomainDashboardService crossDomainService;
    
    public CrossDomainInsight generateExecutiveSummary() {
        return crossDomainService.generateCrossDomainInsights(
            Arrays.asList("social-commerce", "warehousing", "courier-services"),
            LocalDateTime.now().minusDays(30),
            LocalDateTime.now()
        );
    }
    
    public List<DashboardKPI> getTopPerformingKPIs() {
        return crossDomainService.getKPIsByPerformance()
            .stream()
            .filter(kpi -> kpi.getPerformanceScore() > 80.0)
            .sorted((a, b) -> b.getPerformanceScore().compareTo(a.getPerformanceScore()))
            .limit(10)
            .collect(Collectors.toList());
    }
}
```

### Custom KPI Implementation
```java
import com.gogidix.centralizeddashboard.core.service.KPIService;
import com.gogidix.centralizeddashboard.core.model.DashboardKPI;
import org.springframework.stereotype.Service;

@Service
public class RevenueKPIService {
    
    @Autowired
    private KPIService kpiService;
    
    public DashboardKPI calculateCrossChannelRevenue() {
        DashboardKPI revenueKPI = DashboardKPI.builder()
            .name("cross_channel_revenue")
            .displayName("Cross-Channel Revenue")
            .description("Total revenue across all sales channels")
            .targetValue(BigDecimal.valueOf(1000000))
            .alertThreshold(BigDecimal.valueOf(800000))
            .calculationPeriod("MONTHLY")
            .build();
            
        // Custom calculation logic
        BigDecimal socialCommerceRevenue = getSocialCommerceRevenue();
        BigDecimal directSalesRevenue = getDirectSalesRevenue();
        BigDecimal marketplaceRevenue = getMarketplaceRevenue();
        
        BigDecimal totalRevenue = socialCommerceRevenue
            .add(directSalesRevenue)
            .add(marketplaceRevenue);
            
        revenueKPI.setCurrentValue(totalRevenue);
        revenueKPI.setPerformanceScore(calculatePerformanceScore(totalRevenue, revenueKPI.getTargetValue()));
        
        return kpiService.saveKPI(revenueKPI);
    }
}
```

### Enhanced Analytics Integration
```java
import com.gogidix.centralizeddashboard.core.integration.enhanced.EnhancedDomainAnalyticsService;
import com.gogidix.centralizeddashboard.core.model.CorrelationResult;
import org.springframework.stereotype.Service;

@Service
public class PredictiveAnalyticsService {
    
    @Autowired
    private EnhancedDomainAnalyticsService analyticsService;
    
    public CorrelationResult analyzeSalesWarehouseCorrelation() {
        return analyticsService.calculateCorrelation(
            "social-commerce.daily_sales",
            "warehousing.inventory_turnover",
            30 // days
        );
    }
    
    public TrendData predictNextQuarterPerformance() {
        List<String> metrics = Arrays.asList(
            "social-commerce.revenue",
            "warehousing.efficiency_score",
            "courier-services.delivery_rate"
        );
        
        return analyticsService.generateTrendForecast(
            metrics,
            LocalDateTime.now().plusDays(90)
        );
    }
}
```

### REST Controller Implementation
```java
import com.gogidix.centralizeddashboard.core.controller.DashboardController;
import com.gogidix.centralizeddashboard.core.dto.DashboardKPIDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private CrossDomainDashboardService dashboardService;
    
    @GetMapping("/overview")
    public ResponseEntity<CrossDomainSummaryDto> getDashboardOverview() {
        CrossDomainSummaryDto overview = dashboardService.generateOverview();
        return ResponseEntity.ok(overview);
    }
    
    @GetMapping("/kpis")
    public ResponseEntity<List<DashboardKPIDto>> getAllKPIs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<DashboardKPI> kpiPage = dashboardService.getKPIs(pageable);
        
        List<DashboardKPIDto> kpiDtos = kpiPage.getContent()
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(kpiDtos);
    }
    
    @PostMapping("/kpis")
    public ResponseEntity<DashboardKPIDto> createKPI(@Valid @RequestBody DashboardKPIDto kpiDto) {
        DashboardKPI kpi = convertToEntity(kpiDto);
        DashboardKPI savedKPI = dashboardService.createKPI(kpi);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(convertToDto(savedKPI));
    }
}
```

### Event-Driven Architecture
```java
import com.gogidix.centralizeddashboard.core.events.CrossDomainEvent;
import com.gogidix.centralizeddashboard.core.events.CrossDomainEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class DashboardEventHandler {
    
    @Autowired
    private CrossDomainEventPublisher eventPublisher;
    
    @EventListener
    public void handleDataCollectionEvent(CrossDomainEvent event) {
        if (event.getEventType().equals("DATA_COLLECTION_COMPLETED")) {
            // Trigger KPI recalculation
            eventPublisher.publishEvent(
                CrossDomainEvent.builder()
                    .eventType("KPI_RECALCULATION_REQUEST")
                    .domain(event.getDomain())
                    .timestamp(LocalDateTime.now())
                    .data(event.getData())
                    .build()
            );
        }
    }
    
    @EventListener
    public void handleKPIThresholdBreach(CrossDomainEvent event) {
        if (event.getEventType().equals("KPI_THRESHOLD_BREACHED")) {
            // Send alert notification
            sendAlertNotification(event);
            
            // Log critical event
            logCriticalEvent(event);
        }
    }
}
```

## Best Practices
1. **Data Collection**: Implement proper error handling and retry mechanisms for domain service integration
2. **Caching**: Use Redis for frequently accessed metrics and KPIs to improve performance
3. **Security**: Implement proper authentication and authorization for cross-domain communications
4. **Monitoring**: Set up comprehensive health checks and monitoring for all integration points
5. **Data Quality**: Implement data validation and consistency checks across domain boundaries
6. **Performance**: Use asynchronous processing for heavy analytics calculations
7. **Scalability**: Design for horizontal scaling with proper load balancing
8. **Circuit Breakers**: Implement circuit breaker patterns for external service calls

## Technology Stack
- **Framework**: Spring Boot 3.x with Java 17
- **Database**: PostgreSQL with Flyway migrations
- **Caching**: Redis for distributed caching, Caffeine for local caching
- **API Documentation**: SpringDoc OpenAPI 3.0
- **Security**: Spring Security with OAuth2 resource server
- **Service Communication**: OpenFeign clients with Resilience4j circuit breakers
- **Monitoring**: Spring Boot Actuator with Micrometer metrics
- **Testing**: JUnit 5, Testcontainers, Spring Boot Test

## Integration Points
The Centralized Dashboard Core integrates with:
- **Social Commerce Domain**: User analytics, order processing metrics, sales performance
- **Warehousing Domain**: Inventory levels, fulfillment metrics, warehouse efficiency
- **Courier Services Domain**: Delivery performance, logistics optimization, shipping analytics
- **Admin Framework**: Shared administrative functionality and policy management
- **Real-Time Data Service**: WebSocket connections for live dashboard updates
- **Performance Metrics Service**: Detailed performance analysis and optimization
- **Reporting Service**: Report generation and scheduled analytics