# Setup Guide - Centralized Data Aggregation

## Overview
Setup instructions for the Centralized Data Aggregation service, including dependencies, configuration, and deployment procedures.

## Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 14+
- Redis 6.2+

## Local Development Setup

### 1. Database Setup
```sql
CREATE DATABASE centralized_aggregation;
CREATE USER aggregation_user WITH PASSWORD 'aggregation_password';
GRANT ALL PRIVILEGES ON DATABASE centralized_aggregation TO aggregation_user;
```

### 2. Redis Setup
```bash
# Install and start Redis
sudo apt install redis-server
sudo systemctl start redis-server
```

### 3. Configuration
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/centralized_aggregation
    username: aggregation_user
    password: aggregation_password
  redis:
    host: localhost
    port: 6379

aggregation:
  scheduler:
    enabled: true
    interval: 3600000 # 1 hour
  cache:
    ttl: 1800 # 30 minutes
  batch-size: 1000
```

### 4. Build and Run
```bash
./mvnw clean install
./mvnw spring-boot:run
```

## Docker Setup
```bash
docker-compose up -d
```

## Verification
```bash
curl http://localhost:8081/actuator/health
curl http://localhost:8081/api/v1/aggregation/status
```