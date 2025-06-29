# Centralized Dashboard - Architecture Documentation

## System Overview

The Centralized Dashboard is a unified business intelligence platform that aggregates and analyzes data from three core domains: Social Commerce, Warehousing, and Courier Services. This document outlines the architectural design, component structure, and integration patterns used in the system.

## 1. Architectural Patterns

### 1.1 Overall Architecture

The system follows a **microservices-based architecture** with the following key characteristics:

- **Multi-module design**: Separation of concerns across specialized modules
- **Service-oriented approach**: Clear boundaries between different functional areas
- **API-first design**: Well-defined REST APIs for all services
- **Event-driven communication**: For real-time updates between systems
- **Circuit breaker patterns**: For resilient external service integration

### 1.2 Key Architectural Decisions

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Multi-module Maven structure | Promotes modularity and separation of concerns | Enables independent development and maintenance |
| Reactive programming model | Better performance for real-time operations | Improved scalability and resource utilization |
| Spring Boot backend | Industry standard with robust ecosystem | Accelerated development and integration capabilities |
| React frontend with TypeScript | Type safety and modern component-based UI | Better developer experience and code quality |
| Redis caching | High-performance data caching | Reduced latency for frequently accessed data |
| Flyway database migrations | Versioned database schema evolution | Reliable and repeatable deployments |
| Circuit breaker patterns | Resilience against external service failures | Improved system stability |

## 2. Component Architecture

### 2.1 Backend Modules

**Backend Module Structure:**

| Module | Purpose | Key Components |
|--------|---------|----------------|
| **centralized-core** | Core business logic and domain models | DashboardMetric, DashboardKPI, data repositories |
| **centralized-data-aggregation** | Data collection from source domains | Domain clients, data collectors, ETL processes |
| **centralized-performance-metrics** | System performance monitoring | Performance trackers, health indicators |
| **centralized-real-time-data** | Real-time data processing | WebSocket handlers, real-time processors |
| **centralized-reporting** | Report generation and exports | Report generators, template processors |

### 2.2 Frontend Structure

The frontend follows a **component-based architecture** using React and Material UI with the following organization:

- **Pages**: Top-level route components (Dashboard, Analytics, Reports)
- **Components**: Reusable UI elements (charts, widgets, forms)
- **Services**: API integration and data processing
- **Contexts**: Shared state (authentication, theme, real-time data)
- **Hooks**: Custom React hooks for shared functionality
- **Utils**: Helper functions and utilities

### 2.3 Database Design

The system uses PostgreSQL as the primary database with the following key tables:

- **dashboard_metrics**: Raw metrics data from all domains
- **dashboard_kpis**: Calculated Key Performance Indicators
- **dashboard_reports**: Generated reports metadata
- **dashboard_alerts**: System alerts and notifications
- **domain_integration**: Domain integration configurations
- **dashboard_users**: User profiles and preferences
- **dashboard_widgets**: Dashboard widget configurations
- **cross_domain_insights**: Cross-domain correlations and insights
- **correlation_results**: Detailed correlation data
- **trend_data**: Time-series trend information

## 3. Integration Architecture

### 3.1 Domain Integration

**Domain Integration Architecture:**

The system integrates with three primary domains:

1. **Social Commerce Domain**:
   - REST API integration via SocialCommerceClient
   - Enhanced metrics through EnhancedSocialCommerceAnalytics
   - Product, user, and campaign analytics

2. **Warehousing Domain**:
   - REST API integration via WarehousingClient
   - Enhanced metrics through EnhancedWarehousingAnalytics
   - Inventory, efficiency, and supplier analytics

3. **Courier Services Domain**:
   - REST API integration via CourierClient
   - Enhanced metrics through EnhancedCourierAnalytics
   - Delivery, route optimization, and sustainability metrics

### 3.2 Admin Framework Integration

**Admin Framework Integration Architecture:**

The system integrates with the Admin Framework through:

- **AdminFrameworkClient**: Handles communication with Admin Framework services
- **AdminFrameworkConfig**: Configures circuit breakers for resilient API calls
- **AdminFrameworkIntegrationController**: Exposes Admin Framework functionality

Integration features include:
- User authentication validation
- Export template management
- Data export processing
- User profile synchronization

### 3.3 Authentication Flow

The system uses OAuth2/JWT authentication with the following flow:

1. User authenticates via the centralized login page
2. Auth service issues JWT token with user claims
3. Token is stored in the frontend and attached to all API requests
4. Backend validates token and extracts user information
5. Admin Framework integration validates the token across systems

## 4. Data Flow Architecture

### 4.1 Metric Collection Flow

1. Domain clients collect raw metrics from source systems
2. Enhanced analytics services enrich the data with additional insights
3. Data is stored in the metrics repository
4. KPI calculation service processes raw metrics into KPIs
5. Real-time data is pushed to subscribed clients via WebSockets

### 4.2 Cross-Domain Analytics Flow

1. EnhancedDomainAnalyticsService collects metrics from all domains
2. Correlation analysis identifies relationships between domains
3. Cross-domain insights are generated based on correlation patterns
4. Insights are stored and categorized by severity and relevance
5. Dashboard displays actionable insights to users

## 5. Deployment Architecture

### 5.1 Container Architecture

The system is containerized using Docker with the following components:

- **Backend services**: Spring Boot applications in separate containers
- **Frontend**: Nginx-served React application
- **Database**: PostgreSQL container with persistent volume
- **Cache**: Redis container for distributed caching
- **Message broker**: For event-based communication

### 5.2 CI/CD Pipeline

The continuous integration and deployment pipeline consists of:

1. Code validation and testing on commit/PR
2. Automated build process for all modules
3. Docker image creation and versioning
4. Integration testing in staging environment
5. Automated deployment to production environment

## 6. Security Architecture

### 6.1 Authentication & Authorization

- **OAuth2/JWT**: For secure authentication
- **Role-based access control**: For authorization to different features
- **API Gateway security**: Centralized security policies
- **Cross-origin resource sharing (CORS)**: Configured for secure frontend-backend communication

### 6.2 Data Security

- **Encrypted database connections**: For data in transit
- **Sensitive data encryption**: For personally identifiable information
- **Audit logging**: For tracking security-relevant actions
- **Input validation**: At controller and service levels

## 7. Scalability & Performance

### 7.1 Scalability Approach

- **Horizontal scaling**: For backend services
- **Caching strategy**: Redis for high-throughput data
- **Database indexing**: Optimized for common query patterns
- **Asynchronous processing**: For resource-intensive operations

### 7.2 Performance Optimizations

- **Redis caching**: For frequently accessed data
- **Query optimization**: For efficient database access
- **Frontend code splitting**: For optimized loading times
- **Lazy loading**: For on-demand component loading
- **Bundle optimization**: For minimal JavaScript payload

## 8. Monitoring & Observability

- **Health endpoints**: For service status monitoring
- **Prometheus metrics**: For performance tracking
- **Logging framework**: For centralized logging
- **Distributed tracing**: For request flow analysis

## 9. Resilience Patterns

- **Circuit breakers**: For external service calls
- **Retry mechanisms**: For transient failures
- **Fallback strategies**: For degraded operation
- **Timeout configurations**: For unresponsive services

## 10. Technology Stack

### 10.1 Backend Technologies

- **Java 17**: Core programming language
- **Spring Boot 3.x**: Application framework
- **Spring Data JPA**: Data access layer
- **Spring Security**: Authentication and authorization
- **Spring Cloud**: For distributed systems patterns
- **PostgreSQL**: Primary database
- **Flyway**: Database migrations
- **Redis**: Distributed caching
- **Resilience4j**: Circuit breaker implementation

### 10.2 Frontend Technologies

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **Material UI**: Component library
- **Recharts/Nivo**: Visualization libraries
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Grid Layout**: Dashboard layout system

## 11. Future Architecture Considerations

- **GraphQL API**: For more efficient data fetching
- **Real-time analytics processing**: For instant insights
- **Machine learning integration**: For predictive analytics
- **Multi-tenancy support**: For customer-specific dashboards
- **Mobile application**: For on-the-go analytics

---

Document Version: 1.0  
Last Updated: 2025-05-25  
Author: Micro-Services Social-Ecommerce App Team
