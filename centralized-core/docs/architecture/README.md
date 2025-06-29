# Architecture Documentation - Centralized Core Service

## Overview

The Centralized Core Service serves as the backbone of the Centralized Business Intelligence Dashboard, providing essential core services, data orchestration, and cross-domain integration capabilities. Built with Java and Spring Boot, it acts as the central coordinator for all dashboard operations and manages the complex interactions between different business domains.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Component Overview](#component-overview)
3. [Data Flow](#data-flow)
4. [Technology Stack](#technology-stack)
5. [Architectural Patterns](#architectural-patterns)
6. [Security Architecture](#security-architecture)
7. [Scalability Design](#scalability-design)
8. [Integration Points](#integration-points)

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   Centralized Core Service                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   REST API  │  │  Dashboard  │  │   Cross-Domain          │  │
│  │ Controllers │  │   Services  │  │   Integration           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Domain    │  │    KPI      │  │     Enhanced            │  │
│  │ Data Colect │  │  Services   │  │    Analytics            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │    Data     │  │   Event     │  │      Security &         │  │
│  │Normalization│  │ Publishing  │  │   Authorization         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼────┐ ┌────▼────┐ ┌───▼─────────┐
            │   Social   │ │Warehouse│ │   Courier   │
            │  Commerce  │ │Services │ │  Services   │
            │    API     │ │   API   │ │     API     │
            └────────────┘ └─────────┘ └─────────────┘
```

### Architecture Principles

1. **Microservices Architecture**: Independent, loosely coupled service design
2. **Domain-Driven Design**: Clear separation of business domain concerns
3. **Event-Driven Communication**: Asynchronous messaging for scalability
4. **API-First Design**: Well-defined REST APIs with OpenAPI documentation
5. **Circuit Breaker Pattern**: Resilient external service integration
6. **CQRS Pattern**: Separated read and write operations for optimal performance

## Component Overview

### Core Services

#### Domain Data Collectors
| Component | Purpose | Technology | Location |
|-----------|---------|------------|----------|
| SocialCommerceDataCollector | E-commerce data aggregation | Spring Boot | /collection/impl/ |
| WarehouseDataCollector | Warehousing metrics collection | Spring Boot | /collection/impl/ |
| CourierServiceDataCollector | Courier service data gathering | Spring Boot | /collection/impl/ |
| DomainDataCollector | Abstract base collector | Spring Boot | /collection/ |

#### API Controllers
| Controller | Purpose | Endpoints | Security |
|------------|---------|-----------|----------|
| DashboardController | Main dashboard operations | `/api/v1/dashboard/*` | JWT Required |
| KPIController | Key Performance Indicators | `/api/v1/kpi/*` | JWT Required |
| MetricsController | System metrics | `/api/v1/metrics/*` | JWT Required |
| CrossDomainController | Cross-domain operations | `/api/v1/cross-domain/*` | JWT Required |

#### Business Services
| Service | Purpose | Dependencies | Async |
|---------|---------|--------------|-------|
| CrossDomainDashboardService | Multi-domain orchestration | External APIs | Yes |
| KPIService | KPI calculation and management | Database, Cache | No |
| MetricCollectorService | Metrics aggregation | External APIs | Yes |
| DataNormalizationService | Data standardization | None | No |

### Infrastructure Components

#### Configuration Services
- **OpenApiConfig**: API documentation configuration
- **SecurityConfig**: Authentication and authorization setup
- **RedisCacheConfig**: Caching layer configuration
- **CircuitBreakerConfig**: Resilience patterns

#### Integration Components
- **RestTemplateConfig**: HTTP client configuration
- **AdminFrameworkClient**: Admin framework integration
- **CrossDomainEventPublisher**: Event messaging system

## Data Flow

### Synchronous Data Flow

```
Frontend Request -> API Gateway -> Core Service Controller -> 
Business Service -> External Domain API -> Data Processing -> 
Cache Update -> Response to Frontend
```

### Asynchronous Event Flow

```
Domain Event -> Event Handler -> Core Service Processing -> 
KPI Calculation -> Database Update -> Event Publishing -> 
Real-time Dashboard Update
```

### Cross-Domain Integration Flow

```
Core Service -> Circuit Breaker -> Domain API Call -> 
Data Validation -> Normalization -> Aggregation -> 
Enhanced Analytics -> Dashboard Metrics
```

## Technology Stack

### Backend Technologies

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Language** | Java | 17 LTS | Primary development language |
| **Framework** | Spring Boot | 3.1.x | Application framework |
| **Security** | Spring Security | 6.x | Authentication & authorization |
| **Data Access** | Spring Data JPA | 3.x | Database operations |
| **Cache** | Spring Cache + Redis | 6.2+ | Performance optimization |
| **Build Tool** | Maven | 3.8+ | Dependency management |

### Data Technologies

| Type | Technology | Use Case | Configuration |
|------|------------|----------|---------------|
| **Primary DB** | PostgreSQL | Transactional data | High consistency |
| **Cache** | Redis | Session & temp data | High performance |
| **Message Queue** | Apache Kafka | Event streaming | Async processing |
| **Search** | Elasticsearch | Full-text search | Optional feature |

### DevOps Stack

- **Container**: Docker with multi-stage builds
- **Orchestration**: Kubernetes with Helm charts
- **CI/CD**: GitHub Actions
- **Monitoring**: Micrometer + Prometheus
- **Logging**: Logback + ELK Stack
- **Tracing**: Spring Cloud Sleuth + Jaeger

## Architectural Patterns

### Design Patterns

1. **Repository Pattern**
   ```java
   @Repository
   public interface DashboardKPIRepository extends JpaRepository<DashboardKPI, Long> {
       List<DashboardKPI> findByDomainAndTimestampBetween(
           String domain, LocalDateTime start, LocalDateTime end);
   }
   ```

2. **Service Layer Pattern**
   ```java
   @Service
   @Transactional
   public class KPIServiceImpl implements KPIService {
       
       @Cacheable("kpi-metrics")
       public List<DashboardKPIDto> getKPIsByDomain(String domain) {
           return repository.findByDomain(domain)
               .stream()
               .map(mapper::toDto)
               .collect(Collectors.toList());
       }
   }
   ```

3. **Circuit Breaker Pattern**
   ```java
   @Component
   public class SocialCommerceClient {
       
       @CircuitBreaker(name = "social-commerce", fallbackMethod = "fallbackData")
       @TimeLimiter(name = "social-commerce")
       public CompletableFuture<DomainMetric> getMetrics() {
           return CompletableFuture.supplyAsync(() -> 
               restTemplate.getForObject("/api/metrics", DomainMetric.class));
       }
       
       public CompletableFuture<DomainMetric> fallbackData(Exception ex) {
           return CompletableFuture.completedFuture(DomainMetric.createDefault());
       }
   }
   ```

4. **Event-Driven Pattern**
   ```java
   @EventListener
   @Async
   public void handleCrossDomainEvent(CrossDomainEvent event) {
       log.info("Processing cross-domain event: {}", event.getType());
       // Process event and update metrics
       metricCollectorService.processEvent(event);
   }
   ```

### Communication Patterns

- **Synchronous**: REST APIs for immediate responses
- **Asynchronous**: Kafka events for cross-domain updates
- **Request-Reply**: Correlation IDs for async request tracking
- **Publish-Subscribe**: Domain events for real-time updates

## Security Architecture

### Authentication & Authorization

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/**").hasRole("USER")
                .anyRequest().authenticated())
            .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .build();
    }
}
```

### Security Layers

1. **API Security**
   - JWT token validation
   - Role-based access control
   - Request rate limiting
   - API key management

2. **Data Security**
   - Database encryption at rest
   - Sensitive data masking
   - Audit logging
   - Data retention policies

3. **Network Security**
   - TLS/SSL encryption
   - VPC network isolation
   - Service mesh security
   - Firewall rules

### Cross-Domain Authorization

```java
@Component
public class CrossDomainAuthorizationManager {
    
    public boolean hasAccessToDomain(Authentication auth, String domain) {
        return auth.getAuthorities().stream()
            .anyMatch(authority -> 
                authority.getAuthority().equals("DOMAIN_" + domain.toUpperCase()));
    }
}
```

## Scalability Design

### Horizontal Scaling

```yaml
# Kubernetes HPA configuration
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: centralized-core-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: centralized-core
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Performance Optimization

1. **Caching Strategy**
   ```java
   @Cacheable(value = "dashboard-metrics", key = "#domain + '_' + #timeframe")
   public DashboardMetricDto getMetrics(String domain, String timeframe) {
       return calculateMetrics(domain, timeframe);
   }
   
   @CacheEvict(value = "dashboard-metrics", allEntries = true)
   @Scheduled(fixedRate = 300000) // 5 minutes
   public void evictExpiredCache() {
       log.debug("Clearing expired dashboard metrics cache");
   }
   ```

2. **Database Optimization**
   ```java
   @Entity
   @Table(name = "dashboard_metrics", 
          indexes = {
              @Index(name = "idx_domain_timestamp", 
                     columnList = "domain, timestamp"),
              @Index(name = "idx_metric_type", 
                     columnList = "metric_type")
          })
   public class DashboardMetric {
       // Entity implementation
   }
   ```

3. **Async Processing**
   ```java
   @Async("taskExecutor")
   @EventListener
   public CompletableFuture<Void> processMetricUpdate(MetricUpdateEvent event) {
       return CompletableFuture.runAsync(() -> {
           // Heavy processing in background
           processMetrics(event.getMetrics());
       });
   }
   ```

## Integration Points

### External Service Integration

| Service | Integration Method | Purpose | Resilience |
|---------|-------------------|---------|------------|
| Social Commerce API | REST + Circuit Breaker | E-commerce metrics | Fallback data |
| Warehousing API | REST + Circuit Breaker | Inventory metrics | Fallback data |
| Courier Services API | REST + Circuit Breaker | Shipping metrics | Fallback data |
| Admin Framework | REST | Administrative functions | Retry logic |

### Internal Service Communication

```java
@Service
public class CrossDomainIntegrationService {
    
    private final List<DomainDataCollector> collectors;
    private final CircuitBreakerRegistry circuitBreakerRegistry;
    
    public CrossDomainSummaryDto generateSummary() {
        return collectors.parallelStream()
            .map(this::collectDomainData)
            .collect(CrossDomainSummaryDto.collector());
    }
    
    private DomainMetric collectDomainData(DomainDataCollector collector) {
        return circuitBreakerRegistry
            .circuitBreaker(collector.getDomainName())
            .executeSupplier(collector::collectMetrics);
    }
}
```

### Event Publishing

```java
@Component
public class CrossDomainEventPublisher {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @EventListener
    public void publishCrossDomainEvent(CrossDomainEvent event) {
        kafkaTemplate.send("cross-domain-events", event.getDomain(), event);
    }
}
```

## Data Architecture

### Database Schema

```sql
-- Dashboard KPIs table
CREATE TABLE dashboard_kpis (
    id BIGSERIAL PRIMARY KEY,
    domain VARCHAR(50) NOT NULL,
    kpi_name VARCHAR(100) NOT NULL,
    kpi_value DECIMAL(15,2) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dashboard Metrics table
CREATE TABLE dashboard_metrics (
    id BIGSERIAL PRIMARY KEY,
    domain VARCHAR(50) NOT NULL,
    metric_type VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    unit VARCHAR(20),
    timestamp TIMESTAMP NOT NULL,
    tags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_kpis_domain_timestamp ON dashboard_kpis(domain, timestamp);
CREATE INDEX idx_kpis_name ON dashboard_kpis(kpi_name);
CREATE INDEX idx_metrics_domain_type ON dashboard_metrics(domain, metric_type);
CREATE INDEX idx_metrics_timestamp ON dashboard_metrics(timestamp);
```

### Data Transformation

```java
@Component
public class DataNormalizationServiceImpl implements DataNormalizationService {
    
    public DomainMetric normalizeMetric(RawDomainData rawData) {
        return DomainMetric.builder()
            .domain(rawData.getDomain())
            .timestamp(normalizeTimestamp(rawData.getTimestamp()))
            .value(normalizeValue(rawData.getValue(), rawData.getUnit()))
            .metadata(extractMetadata(rawData))
            .build();
    }
    
    private BigDecimal normalizeValue(String value, String unit) {
        // Standardize values to common units
        return switch (unit.toLowerCase()) {
            case "k", "thousand" -> new BigDecimal(value).multiply(BigDecimal.valueOf(1000));
            case "m", "million" -> new BigDecimal(value).multiply(BigDecimal.valueOf(1000000));
            default -> new BigDecimal(value);
        };
    }
}
```

## Monitoring and Observability

### Metrics Configuration

```java
@Component
public class CustomMetrics {
    
    private final Counter apiCallCounter;
    private final Timer apiResponseTimer;
    private final Gauge activeConnectionsGauge;
    
    public CustomMetrics(MeterRegistry meterRegistry) {
        this.apiCallCounter = Counter.builder("api.calls.total")
            .description("Total API calls")
            .tag("service", "centralized-core")
            .register(meterRegistry);
            
        this.apiResponseTimer = Timer.builder("api.response.duration")
            .description("API response time")
            .register(meterRegistry);
    }
    
    @EventListener
    public void recordApiCall(ApiCallEvent event) {
        apiCallCounter.increment(
            Tags.of("endpoint", event.getEndpoint(),
                   "method", event.getMethod(),
                   "status", String.valueOf(event.getStatus()))
        );
    }
}
```

### Health Checks

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {
    
    private final List<DomainDataCollector> collectors;
    
    @Override
    public Health health() {
        Health.Builder builder = Health.up();
        
        for (DomainDataCollector collector : collectors) {
            try {
                boolean isHealthy = collector.healthCheck();
                builder.withDetail(collector.getDomainName(), 
                    isHealthy ? "UP" : "DOWN");
            } catch (Exception e) {
                builder.down()
                    .withDetail(collector.getDomainName(), "ERROR: " + e.getMessage());
            }
        }
        
        return builder.build();
    }
}
```

## Future Considerations

1. **Event Sourcing**: Complete event-driven architecture with event store
2. **GraphQL Integration**: Unified query interface for multiple domains
3. **Machine Learning**: Predictive analytics and anomaly detection
4. **Multi-Tenant Architecture**: Support for multiple organization tenants
5. **Reactive Streams**: Non-blocking reactive programming with WebFlux

## References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Microservices Patterns](https://microservices.io/patterns/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Domain-Driven Design](https://domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf)