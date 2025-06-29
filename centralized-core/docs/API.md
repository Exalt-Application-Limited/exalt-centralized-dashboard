# Centralized Dashboard Core API Documentation

## Core Service API

### CrossDomainDashboardService
- CrossDomainDashboardService(): Default constructor
- generateOverview(): CrossDomainSummaryDto: Generate comprehensive dashboard overview
- generateCrossDomainInsights(domains: List<String>, startDate: LocalDateTime, endDate: LocalDateTime): CrossDomainInsight: Generate insights across multiple domains
- getKPIs(pageable: Pageable): Page<DashboardKPI>: Get paginated list of KPIs
- getKPIsByPerformance(): List<DashboardKPI>: Get KPIs sorted by performance score
- createKPI(kpi: DashboardKPI): DashboardKPI: Create new KPI
- updateKPI(id: UUID, kpi: DashboardKPI): DashboardKPI: Update existing KPI
- deleteKPI(id: UUID): void: Delete KPI by ID
- getMetrics(domain: String, metricType: String): List<DashboardMetric>: Get metrics for specific domain

### MetricCollectorService
- MetricCollectorService(): Default constructor
- collectAllDomainMetrics(): List<DomainMetric>: Collect metrics from all connected domains
- collectDomainMetrics(domain: String): List<DomainMetric>: Collect metrics from specific domain
- scheduleMetricCollection(domain: String, schedule: String): void: Schedule automatic metric collection
- getMetricHistory(metricName: String, days: int): List<DashboardMetric>: Get historical metric data
- calculateMetricTrends(metricName: String, period: TimePeriod): TrendData: Calculate metric trends
- validateMetricData(metrics: List<DomainMetric>): ValidationResult: Validate collected metric data

### KPIService
- KPIService(): Default constructor
- calculateKPI(kpiName: String): DashboardKPI: Calculate specific KPI value
- calculateAllKPIs(): List<DashboardKPI>: Calculate all configured KPIs
- saveKPI(kpi: DashboardKPI): DashboardKPI: Save KPI to database
- getKPIById(id: UUID): Optional<DashboardKPI>: Get KPI by ID
- getKPIsByDomain(domain: String): List<DashboardKPI>: Get KPIs for specific domain
- getKPIsByTarget(targetValue: BigDecimal): List<DashboardKPI>: Get KPIs by target value
- updateKPITarget(id: UUID, targetValue: BigDecimal): DashboardKPI: Update KPI target value
- checkKPIThresholds(): List<DashboardKPI>: Check KPIs against alert thresholds

### DataNormalizationService
- DataNormalizationService(): Default constructor
- normalizeMetrics(metrics: List<DomainMetric>): List<DashboardMetric>: Normalize metrics across domains
- standardizeDataFormat(data: Object, sourceFormat: String, targetFormat: String): Object: Convert data formats
- validateDataConsistency(data: List<Object>): ValidationResult: Validate data consistency
- aggregateMetrics(metrics: List<DashboardMetric>, aggregationType: AggregationType): DashboardMetric: Aggregate multiple metrics
- transformCurrencyValues(value: BigDecimal, fromCurrency: String, toCurrency: String): BigDecimal: Convert currency values

## Domain Integration API

### SocialCommerceClient
- getUserMetrics(): SocialCommerceMetrics: Get user behavior and engagement metrics
- getOrderMetrics(): OrderMetrics: Get order processing and sales metrics
- getRevenueMetrics(): RevenueMetrics: Get revenue and financial metrics
- getMarketplaceMetrics(): MarketplaceMetrics: Get marketplace performance metrics
- getSocialMediaMetrics(): SocialMediaMetrics: Get social media integration metrics
- getCustomerSatisfactionMetrics(): CustomerSatisfactionMetrics: Get customer satisfaction scores

### WarehousingClient
- getInventoryMetrics(): InventoryMetrics: Get inventory levels and turnover metrics
- getFulfillmentMetrics(): FulfillmentMetrics: Get order fulfillment performance
- getWarehouseEfficiency(): WarehouseEfficiencyMetrics: Get warehouse operational efficiency
- getShippingMetrics(): ShippingMetrics: Get shipping and logistics metrics
- getSupplierMetrics(): SupplierMetrics: Get supplier performance metrics
- getCostMetrics(): CostMetrics: Get warehouse operational costs

### CourierServiceClient
- getDeliveryMetrics(): DeliveryMetrics: Get delivery performance and timing metrics
- getLogisticsMetrics(): LogisticsMetrics: Get logistics optimization metrics
- getRouteEfficiency(): RouteEfficiencyMetrics: Get route optimization metrics
- getCarrierPerformance(): CarrierPerformanceMetrics: Get carrier performance metrics
- getDeliveryCosts(): DeliveryCostMetrics: Get delivery cost analysis
- getCustomerDeliveryFeedback(): DeliveryFeedbackMetrics: Get customer delivery feedback

### AdminFrameworkClient
- getSecurityMetrics(): SecurityMetrics: Get security and authentication metrics
- getSystemHealth(): SystemHealthMetrics: Get system health and performance metrics
- getUserManagementMetrics(): UserManagementMetrics: Get user management metrics
- getPolicyCompliance(): PolicyComplianceMetrics: Get policy compliance metrics
- getAuditMetrics(): AuditMetrics: Get audit trail and compliance metrics

## Enhanced Analytics API

### EnhancedDomainAnalyticsService
- EnhancedDomainAnalyticsService(): Default constructor
- calculateCorrelation(metric1: String, metric2: String, days: int): CorrelationResult: Calculate correlation between metrics
- generateTrendForecast(metrics: List<String>, forecastDate: LocalDateTime): TrendData: Generate trend forecasts
- performAnomalyDetection(metricName: String, threshold: double): List<AnomalyDetection>: Detect metric anomalies
- generateBusinessInsights(domains: List<String>, analysisType: String): List<BusinessInsight>: Generate business insights
- calculateROI(investment: BigDecimal, returns: BigDecimal, period: TimePeriod): ROIMetrics: Calculate return on investment

### EnhancedSocialCommerceAnalytics
- analyzeSalesConversion(): ConversionAnalytics: Analyze sales conversion funnels
- calculateCustomerLifetimeValue(): CLVAnalytics: Calculate customer lifetime value
- analyzeMarketTrends(): MarketTrendAnalytics: Analyze market trends and opportunities
- segmentCustomers(): CustomerSegmentationAnalytics: Perform customer segmentation analysis
- analyzeSocialInfluence(): SocialInfluenceAnalytics: Analyze social media influence on sales

### EnhancedWarehousingAnalytics
- optimizeInventoryLevels(): InventoryOptimizationAnalytics: Optimize inventory levels
- analyzeDemandForecasting(): DemandForecastAnalytics: Forecast demand patterns
- optimizeWarehouseLayout(): WarehouseLayoutAnalytics: Optimize warehouse layout
- analyzeSeasonalTrends(): SeasonalTrendAnalytics: Analyze seasonal inventory trends
- calculateInventoryTurnover(): InventoryTurnoverAnalytics: Calculate inventory turnover rates

### EnhancedCourierAnalytics
- optimizeDeliveryRoutes(): RouteOptimizationAnalytics: Optimize delivery routes
- analyzeDeliveryPerformance(): DeliveryPerformanceAnalytics: Analyze delivery performance
- forecastDeliveryDemand(): DeliveryDemandAnalytics: Forecast delivery demand
- optimizeCarrierSelection(): CarrierOptimizationAnalytics: Optimize carrier selection
- analyzeLastMileEfficiency(): LastMileAnalytics: Analyze last-mile delivery efficiency

## REST API Endpoints

### Dashboard Management
- GET /api/v1/dashboard/overview: Get dashboard overview
- GET /api/v1/dashboard/health: Get system health status
- GET /api/v1/dashboard/domains: Get available domains list
- POST /api/v1/dashboard/refresh: Trigger dashboard data refresh
- GET /api/v1/dashboard/version: Get API version information

### KPI Management
- GET /api/v1/kpis: Get all KPIs with pagination
- GET /api/v1/kpis/{id}: Get KPI by ID
- POST /api/v1/kpis: Create new KPI
- PUT /api/v1/kpis/{id}: Update existing KPI
- DELETE /api/v1/kpis/{id}: Delete KPI
- GET /api/v1/kpis/domain/{domain}: Get KPIs by domain
- GET /api/v1/kpis/performance: Get KPIs sorted by performance
- POST /api/v1/kpis/{id}/calculate: Trigger KPI calculation

### Metrics Management
- GET /api/v1/metrics: Get all metrics with filtering
- GET /api/v1/metrics/{domain}: Get metrics by domain
- GET /api/v1/metrics/{domain}/{type}: Get specific metric type for domain
- POST /api/v1/metrics/collect: Trigger metric collection
- GET /api/v1/metrics/history/{metricName}: Get metric history
- GET /api/v1/metrics/trends/{metricName}: Get metric trends
- POST /api/v1/metrics/normalize: Normalize metrics data

### Cross-Domain Analytics
- GET /api/v1/analytics/insights: Get cross-domain insights
- POST /api/v1/analytics/correlations: Calculate metric correlations
- GET /api/v1/analytics/forecasts: Get trend forecasts
- POST /api/v1/analytics/anomalies: Detect anomalies
- GET /api/v1/analytics/business-insights: Get business insights
- POST /api/v1/analytics/roi: Calculate ROI metrics

### Domain Integration
- GET /api/v1/integration/social-commerce: Get social commerce data
- GET /api/v1/integration/warehousing: Get warehousing data
- GET /api/v1/integration/courier-services: Get courier services data
- GET /api/v1/integration/status: Get integration status for all domains
- POST /api/v1/integration/sync: Trigger data synchronization
- GET /api/v1/integration/health: Get integration health status

### Enhanced Analytics
- GET /api/v1/enhanced/social-commerce/conversion: Get conversion analytics
- GET /api/v1/enhanced/social-commerce/clv: Get customer lifetime value
- GET /api/v1/enhanced/warehousing/optimization: Get inventory optimization
- GET /api/v1/enhanced/warehousing/forecasting: Get demand forecasting
- GET /api/v1/enhanced/courier/route-optimization: Get route optimization
- GET /api/v1/enhanced/courier/performance: Get delivery performance analytics

### Event Management
- POST /api/v1/events/publish: Publish cross-domain event
- GET /api/v1/events/history: Get event history
- GET /api/v1/events/subscriptions: Get active event subscriptions
- POST /api/v1/events/subscribe: Subscribe to events
- DELETE /api/v1/events/unsubscribe/{subscriptionId}: Unsubscribe from events

## Data Transfer Objects (DTOs)

### CrossDomainSummaryDto
```java
public class CrossDomainSummaryDto {
    private LocalDateTime timestamp;
    private Map<String, DomainHealthDto> domainHealth;
    private List<DashboardKPIDto> topKPIs;
    private List<DashboardMetricDto> keyMetrics;
    private List<String> alerts;
    private BigDecimal overallPerformanceScore;
}
```

### DashboardKPIDto
```java
public class DashboardKPIDto {
    private UUID id;
    private String name;
    private String displayName;
    private String description;
    private BigDecimal currentValue;
    private BigDecimal targetValue;
    private BigDecimal alertThreshold;
    private Double performanceScore;
    private String domain;
    private String calculationPeriod;
    private LocalDateTime lastCalculated;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### DashboardMetricDto
```java
public class DashboardMetricDto {
    private UUID id;
    private String metricName;
    private String displayName;
    private BigDecimal value;
    private String unit;
    private String domain;
    private LocalDateTime timestamp;
    private Map<String, Object> metadata;
    private String dataType;
    private String source;
}
```

### DomainHealthDto
```java
public class DomainHealthDto {
    private String domainName;
    private String status; // HEALTHY, DEGRADED, DOWN
    private LocalDateTime lastUpdated;
    private Long responseTime;
    private Double healthScore;
    private List<String> healthChecks;
    private Map<String, Object> additionalInfo;
}
```

## Model Classes

### DashboardKPI
```java
@Entity
@Table(name = "dashboard_kpis")
public class DashboardKPI {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private String displayName;
    
    private String description;
    
    @Column(precision = 19, scale = 4)
    private BigDecimal currentValue;
    
    @Column(precision = 19, scale = 4)
    private BigDecimal targetValue;
    
    @Column(precision = 19, scale = 4)
    private BigDecimal alertThreshold;
    
    private Double performanceScore;
    
    private String domain;
    
    @Enumerated(EnumType.STRING)
    private CalculationPeriod calculationPeriod;
    
    private LocalDateTime lastCalculated;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### DashboardMetric
```java
@Entity
@Table(name = "dashboard_metrics")
public class DashboardMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String metricName;
    
    private String displayName;
    
    @Column(precision = 19, scale = 4, nullable = false)
    private BigDecimal value;
    
    private String unit;
    
    @Column(nullable = false)
    private String domain;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata;
    
    @Enumerated(EnumType.STRING)
    private DataType dataType;
    
    private String source;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

### CrossDomainInsight
```java
@Entity
@Table(name = "cross_domain_insights")
public class CrossDomainInsight {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String insightType;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "insight_domains")
    private List<String> involvedDomains;
    
    private Double confidenceScore;
    
    @Enumerated(EnumType.STRING)
    private InsightPriority priority;
    
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> data;
    
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "CORE_ERROR_001",
    "message": "Cross-domain data synchronization failed",
    "details": "Unable to collect data from warehousing domain",
    "timestamp": "2024-06-25T10:30:00Z",
    "requestId": "req_123456789",
    "domain": "warehousing"
  }
}
```

### Common Error Codes
- CORE_ERROR_001: Cross-domain synchronization failure
- CORE_ERROR_002: KPI calculation failed
- CORE_ERROR_003: Metric collection timeout
- CORE_ERROR_004: Data normalization error
- CORE_ERROR_005: Integration service unavailable
- CORE_ERROR_006: Invalid analytics request
- CORE_ERROR_007: Database transaction failed
- CORE_ERROR_008: Authentication failed
- CORE_ERROR_009: Insufficient permissions
- CORE_ERROR_010: Rate limit exceeded

## Security and Authentication

### Authentication Methods
- JWT Bearer tokens for API access
- OAuth2 resource server configuration
- Service-to-service authentication via client credentials
- API key authentication for external integrations

### Authorization Levels
- **ADMIN**: Full access to all dashboard and analytics features
- **ANALYST**: Read access to all data, limited write access to custom KPIs
- **VIEWER**: Read-only access to dashboard data
- **DOMAIN_ADMIN**: Full access within specific domain
- **INTEGRATION**: Service-to-service access with limited scope

### Security Headers
All API responses include appropriate security headers:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Cache-Control: no-cache, no-store, must-revalidate

## Rate Limiting

### API Rate Limits
- Dashboard Overview API: 60 requests per minute per user
- KPI Management API: 120 requests per minute per user
- Metrics Collection API: 30 requests per minute per user
- Analytics API: 20 requests per minute per user
- Integration API: 100 requests per minute per service

### Circuit Breaker Configuration
- Failure threshold: 50% failure rate over 10 requests
- Open circuit timeout: 60 seconds
- Half-open circuit test requests: 3
- Slow call threshold: 5 seconds