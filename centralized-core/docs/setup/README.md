# Setup Guide - Centralized Dashboard Core

## Overview

This document provides comprehensive setup instructions for the Centralized Dashboard Core service, a Spring Boot application that serves as the central orchestration layer for business intelligence across the Social E-commerce Ecosystem.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Setup](#docker-setup)
4. [Kubernetes Setup](#kubernetes-setup)
5. [Configuration](#configuration)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, Linux Ubuntu 18.04+
- **Memory**: Minimum 8GB RAM (16GB recommended for development)
- **Storage**: Minimum 10GB free space
- **Network**: Stable internet connection for Maven dependencies

### Required Software

#### Development Tools

```bash
# Java Development Kit
OpenJDK 17 LTS or Oracle JDK 17

# Build Tool
Apache Maven 3.8+

# IDE (Recommended)
IntelliJ IDEA Ultimate or Visual Studio Code with Java extensions

# Version Control
Git 2.30+

# Database Client (Optional)
pgAdmin 4 or DBeaver Community
```

#### Container and Orchestration

```bash
# Docker
Docker Desktop 4.0+ or Docker Engine 20.10+
Docker Compose 2.0+

# Kubernetes (for cloud deployment)
kubectl 1.24+
helm 3.8+

# Local Kubernetes (optional)
minikube or kind
```

#### Database and Infrastructure

```bash
# Database
PostgreSQL 14+

# Cache
Redis 6.2+

# Message Broker
Apache Kafka 3.0+ (optional for full setup)

# Service Discovery
Consul or Eureka (optional)
```

### Installation Instructions

#### Java 17 LTS

**Windows:**
```powershell
# Using Chocolatey
choco install openjdk17

# Using Scoop
scoop bucket add java
scoop install openjdk17

# Or download from Eclipse Adoptium
```

**macOS:**
```bash
# Using Homebrew
brew install openjdk@17

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc

# Using SDKMAN
curl -s "https://get.sdkman.io" | bash
sdk install java 17.0.7-tem
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# CentOS/RHEL
sudo yum install java-17-openjdk-devel

# Using SDKMAN (recommended)
curl -s "https://get.sdkman.io" | bash
sdk install java 17.0.7-tem
```

#### Apache Maven

```bash
# Download and install Maven 3.8+
wget https://archive.apache.org/dist/maven/maven-3/3.8.8/binaries/apache-maven-3.8.8-bin.tar.gz
tar xzf apache-maven-3.8.8-bin.tar.gz
sudo mv apache-maven-3.8.8 /opt/maven

# Add to PATH
echo 'export PATH="/opt/maven/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
mvn --version
```

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/social-ecommerce-ecosystem/centralized-dashboard.git
cd centralized-dashboard/centralized-core
```

### 2. Environment Configuration

```bash
# Copy environment template
cp src/main/resources/application-local.yml.template src/main/resources/application-local.yml

# Edit with your local settings
nano src/main/resources/application-local.yml
```

Example `application-local.yml`:
```yaml
spring:
  profiles:
    active: local
  datasource:
    url: jdbc:postgresql://localhost:5432/centralized_dashboard_dev
    username: dashboard_user
    password: dashboard_password
    hikari:
      maximum-pool-size: 10
      minimum-idle: 2
  redis:
    host: localhost
    port: 6379
    timeout: 2000ms
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    properties:
      hibernate:
        format_sql: true

# External service endpoints
integration:
  social-commerce:
    base-url: http://localhost:8081
    enabled: true
  warehousing:
    base-url: http://localhost:8082
    enabled: true
  courier-services:
    base-url: http://localhost:8083
    enabled: true

# Security configuration
security:
  jwt:
    secret: dev-secret-key-change-in-production
    expiration: 86400000 # 24 hours
  cors:
    allowed-origins: "http://localhost:3000"

# Logging configuration
logging:
  level:
    com.gogidix.centralizeddashboard: DEBUG
    org.springframework.security: DEBUG
    org.springframework.web: DEBUG
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"

# Actuator endpoints
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,env,beans,configprops
  endpoint:
    health:
      show-details: always
```

### 3. Database Setup

#### PostgreSQL Installation and Configuration

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Windows (using Chocolatey)
choco install postgresql
```

#### Database Initialization

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE centralized_dashboard_dev;
CREATE USER dashboard_user WITH PASSWORD 'dashboard_password';
GRANT ALL PRIVILEGES ON DATABASE centralized_dashboard_dev TO dashboard_user;

# Grant schema permissions
\c centralized_dashboard_dev
GRANT ALL ON SCHEMA public TO dashboard_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dashboard_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dashboard_user;

# Exit PostgreSQL
\q
```

### 4. Redis Setup

```bash
# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis-server

# macOS
brew install redis
brew services start redis

# Windows (using WSL or Docker)
docker run -d -p 6379:6379 redis:6.2-alpine

# Test Redis connection
redis-cli ping
```

### 5. Build and Run

```bash
# Install dependencies and run tests
./mvnw clean install

# Run database migrations
./mvnw flyway:migrate

# Start the application in development mode
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Or run with debug mode
./mvnw spring-boot:run -Dspring-boot.run.profiles=local \
  -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
```

The application will be available at:
- **Main API**: http://localhost:8080
- **Health Check**: http://localhost:8080/actuator/health
- **API Documentation**: http://localhost:8080/swagger-ui.html

### 6. Development Tools Setup

#### IntelliJ IDEA Configuration

1. **Import Project**: Open the `pom.xml` file as a project
2. **Configure JDK**: Set Project SDK to Java 17
3. **Enable Annotations Processing**: File → Settings → Build → Compiler → Annotation Processors → Enable
4. **Install Plugins**:
   - Lombok Plugin
   - Spring Boot Assistant
   - Database Navigator

#### VS Code Configuration

```json
// .vscode/settings.json
{
  "java.configuration.updateBuildConfiguration": "automatic",
  "java.jdt.ls.vmargs": "-XX:+UseParallelGC -XX:GCTimeRatio=4 -XX:AdaptiveSizePolicyWeight=90 -Dsun.zip.disableMemoryMapping=true -Xmx2G -Xms100m",
  "spring-boot.ls.problem.application-properties.unknown-property": false,
  "files.exclude": {
    "**/target": true,
    "**/.classpath": true,
    "**/.project": true,
    "**/.settings": true,
    "**/.factorypath": true
  }
}
```

Required Extensions:
- Extension Pack for Java
- Spring Boot Extension Pack
- Thunder Client (for API testing)

## Docker Setup

### 1. Build Docker Image

```bash
# Build production image
docker build -t centralized-dashboard-core:latest .

# Build with specific profile
docker build --build-arg SPRING_PROFILES_ACTIVE=docker \
  -t centralized-dashboard-core:v1.0.0 .

# Multi-stage build for optimized image
docker build -f Dockerfile.multi-stage \
  -t centralized-dashboard-core:optimized .
```

### 2. Docker Compose Setup

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: centralized_dashboard
      POSTGRES_USER: dashboard_user
      POSTGRES_PASSWORD: dashboard_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - dashboard-network

  redis:
    image: redis:6.2-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - dashboard-network

  centralized-core:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/centralized_dashboard
      - SPRING_DATASOURCE_USERNAME=dashboard_user
      - SPRING_DATASOURCE_PASSWORD=dashboard_password
      - SPRING_REDIS_HOST=redis
      - SPRING_REDIS_PORT=6379
    depends_on:
      - postgres
      - redis
    networks:
      - dashboard-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  postgres_data:
  redis_data:

networks:
  dashboard-network:
    driver: bridge
```

### 3. Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f centralized-core

# Scale the service
docker-compose up -d --scale centralized-core=3

# Stop services
docker-compose down

# Clean up volumes
docker-compose down -v
```

## Kubernetes Setup

### 1. Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Create namespace
kubectl create namespace centralized-dashboard
```

### 2. Configuration Secrets

```bash
# Create database secret
kubectl create secret generic db-credentials \
  --from-literal=username=dashboard_user \
  --from-literal=password=secure_password \
  -n centralized-dashboard

# Create JWT secret
kubectl create secret generic jwt-secret \
  --from-literal=secret=your-jwt-secret-key \
  -n centralized-dashboard

# Create integration secrets
kubectl create secret generic integration-secrets \
  --from-literal=social-commerce-key=api-key \
  --from-literal=warehousing-key=api-key \
  --from-literal=courier-services-key=api-key \
  -n centralized-dashboard
```

### 3. Deploy to Kubernetes

```bash
# Apply all configurations
kubectl apply -f k8s/ -n centralized-dashboard

# Check deployment status
kubectl get pods -n centralized-dashboard
kubectl get services -n centralized-dashboard

# View logs
kubectl logs -f deployment/centralized-core -n centralized-dashboard

# Port forward for local access
kubectl port-forward service/centralized-core 8080:8080 -n centralized-dashboard
```

### 4. Kubernetes Manifests

The service includes pre-configured Kubernetes manifests:

- `k8s/namespace.yaml` - Namespace configuration
- `k8s/deployment.yaml` - Main application deployment
- `k8s/service.yaml` - Service configuration
- `k8s/ingress.yaml` - Ingress configuration for external access
- `k8s/configmap.yaml` - Environment configuration
- `k8s/secrets.yaml` - Sensitive configuration template
- `k8s/hpa.yaml` - Horizontal Pod Autoscaler
- `k8s/monitoring.yaml` - Prometheus monitoring configuration

### 5. Helm Deployment (Optional)

```bash
# Install with Helm
helm install centralized-core ./helm/centralized-core \
  --namespace centralized-dashboard \
  --set image.tag=v1.0.0 \
  --set ingress.hosts[0].host=core.dashboard.local \
  --set postgresql.auth.password=secure_password

# Upgrade deployment
helm upgrade centralized-core ./helm/centralized-core \
  --namespace centralized-dashboard \
  --set image.tag=v1.1.0

# View status
helm status centralized-core -n centralized-dashboard
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SPRING_PROFILES_ACTIVE` | Active Spring profiles | `local` | Yes |
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/centralized_dashboard` | Yes |
| `SPRING_DATASOURCE_USERNAME` | Database username | `dashboard_user` | Yes |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - | Yes |
| `SPRING_REDIS_HOST` | Redis host | `localhost` | Yes |
| `SPRING_REDIS_PORT` | Redis port | `6379` | No |
| `SECURITY_JWT_SECRET` | JWT signing secret | - | Yes |
| `INTEGRATION_SOCIAL_COMMERCE_BASE_URL` | Social commerce service URL | - | Yes |
| `INTEGRATION_WAREHOUSING_BASE_URL` | Warehousing service URL | - | Yes |
| `INTEGRATION_COURIER_SERVICES_BASE_URL` | Courier services URL | - | Yes |

### Application Properties

#### Database Configuration

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/centralized_dashboard}
    username: ${SPRING_DATASOURCE_USERNAME:dashboard_user}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: ${DB_POOL_SIZE:20}
      minimum-idle: ${DB_POOL_MIN_IDLE:5}
      idle-timeout: 300000
      max-lifetime: 1200000
      connection-timeout: 20000
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        jdbc:
          time_zone: UTC
  flyway:
    enabled: true
    locations: classpath:db/migration
    validate-on-migrate: true
```

#### Security Configuration

```yaml
security:
  jwt:
    secret: ${SECURITY_JWT_SECRET}
    expiration: ${JWT_EXPIRATION:86400000}
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
    allowed-methods: GET,POST,PUT,DELETE,OPTIONS
    allowed-headers: "*"
    allow-credentials: true
```

#### Integration Configuration

```yaml
integration:
  social-commerce:
    base-url: ${INTEGRATION_SOCIAL_COMMERCE_BASE_URL}
    timeout: ${INTEGRATION_TIMEOUT:5000}
    retry-attempts: ${INTEGRATION_RETRY_ATTEMPTS:3}
    enabled: ${INTEGRATION_SOCIAL_COMMERCE_ENABLED:true}
  warehousing:
    base-url: ${INTEGRATION_WAREHOUSING_BASE_URL}
    timeout: ${INTEGRATION_TIMEOUT:5000}
    retry-attempts: ${INTEGRATION_RETRY_ATTEMPTS:3}
    enabled: ${INTEGRATION_WAREHOUSING_ENABLED:true}
  courier-services:
    base-url: ${INTEGRATION_COURIER_SERVICES_BASE_URL}
    timeout: ${INTEGRATION_TIMEOUT:5000}
    retry-attempts: ${INTEGRATION_RETRY_ATTEMPTS:3}
    enabled: ${INTEGRATION_COURIER_SERVICES_ENABLED:true}
```

### Circuit Breaker Configuration

```yaml
resilience4j:
  circuitbreaker:
    instances:
      social-commerce:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 60s
        permitted-number-of-calls-in-half-open-state: 3
        sliding-window-size: 10
        minimum-number-of-calls: 5
      warehousing:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 60s
        permitted-number-of-calls-in-half-open-state: 3
      courier-services:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 60s
        permitted-number-of-calls-in-half-open-state: 3
  timelimiter:
    instances:
      social-commerce:
        timeout-duration: 5s
      warehousing:
        timeout-duration: 5s
      courier-services:
        timeout-duration: 5s
```

## Verification

### 1. Health Checks

```bash
# Basic health check
curl http://localhost:8080/actuator/health

# Detailed health check
curl http://localhost:8080/actuator/health | jq

# Database health
curl http://localhost:8080/actuator/health/db

# Redis health
curl http://localhost:8080/actuator/health/redis

# Circuit breaker status
curl http://localhost:8080/actuator/circuitbreakers
```

### 2. API Testing

```bash
# Test dashboard overview endpoint
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8080/api/v1/dashboard/overview

# Test KPI endpoint
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8080/api/v1/kpis

# Test metrics endpoint
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8080/api/v1/metrics

# Test cross-domain integration
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8080/api/v1/integration/status
```

### 3. Integration Testing

```bash
# Run unit tests
./mvnw test

# Run integration tests
./mvnw test -Dtest=**/*IntegrationTest

# Run all tests with coverage
./mvnw clean test jacoco:report

# Run specific test class
./mvnw test -Dtest=KPIServiceImplTest

# Run load tests (if configured)
./mvnw gatling:test
```

### 4. Database Verification

```sql
-- Connect to database
psql -h localhost -U dashboard_user -d centralized_dashboard

-- Check tables
\dt

-- Verify sample data
SELECT COUNT(*) FROM dashboard_kpis;
SELECT COUNT(*) FROM dashboard_metrics;

-- Check migrations
SELECT * FROM flyway_schema_history;
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

**Problem**: Cannot connect to PostgreSQL

**Solutions**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U dashboard_user -d centralized_dashboard

# Check connection parameters
echo $SPRING_DATASOURCE_URL

# Verify user permissions
sudo -u postgres psql -c "\du"
```

#### 2. Redis Connection Issues

**Problem**: Cannot connect to Redis

**Solutions**:
```bash
# Check Redis is running
sudo systemctl status redis-server

# Test Redis connection
redis-cli ping

# Check Redis configuration
redis-cli CONFIG GET "*"

# Clear Redis cache if needed
redis-cli FLUSHALL
```

#### 3. Maven Build Issues

**Problem**: Build fails with dependency errors

**Solutions**:
```bash
# Clean and reinstall dependencies
./mvnw clean install -U

# Skip tests if needed
./mvnw clean install -DskipTests

# Update Maven wrapper
./mvnw wrapper:wrapper -Dmaven=3.8.8

# Clear local repository
rm -rf ~/.m2/repository
./mvnw clean install
```

#### 4. Integration Service Issues

**Problem**: External service calls failing

**Solutions**:
```bash
# Check service endpoints
curl http://localhost:8081/actuator/health  # Social Commerce
curl http://localhost:8082/actuator/health  # Warehousing
curl http://localhost:8083/actuator/health  # Courier Services

# Check circuit breaker status
curl http://localhost:8080/actuator/circuitbreakers

# Disable specific integrations
export INTEGRATION_SOCIAL_COMMERCE_ENABLED=false
```

#### 5. Memory Issues

**Problem**: OutOfMemoryError during startup

**Solutions**:
```bash
# Increase heap size
export MAVEN_OPTS="-Xmx2g -Xms1g"

# For Docker
docker run -e JAVA_OPTS="-Xmx2g -Xms1g" centralized-dashboard-core

# Monitor memory usage
jstat -gc <PID>
```

### Debug Mode

```bash
# Enable debug logging
export LOGGING_LEVEL_COM_GOGIDIX_CENTRALIZEDDASHBOARD=DEBUG

# Enable SQL logging
export SPRING_JPA_SHOW_SQL=true

# Enable security debug
export LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_SECURITY=DEBUG

# Remote debugging
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
```

### Performance Tuning

```bash
# JVM tuning for development
export JAVA_OPTS="
  -Xmx2g 
  -Xms1g 
  -XX:+UseG1GC 
  -XX:MaxGCPauseMillis=200
"

# Database tuning
# Edit postgresql.conf:
# shared_buffers = 256MB
# effective_cache_size = 1GB
# max_connections = 100
```

## Next Steps

1. **Integration Setup**: Configure connections to domain services
2. **Security Setup**: Configure JWT authentication and HTTPS
3. **Monitoring Setup**: Configure Prometheus and Grafana
4. **Testing**: Set up automated testing pipeline
5. **Deployment**: Set up CI/CD pipeline for automated deployments

## Support

- **Documentation**: `/docs` directory
- **API Reference**: `http://localhost:8080/swagger-ui.html`
- **Issues**: GitHub Issues
- **Team Chat**: Slack #centralized-dashboard
- **Email**: core-team@gogidix.com