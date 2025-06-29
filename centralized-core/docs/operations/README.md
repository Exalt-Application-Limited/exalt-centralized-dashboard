# Centralized Dashboard Core Operations

## Overview

This document provides comprehensive operational procedures, monitoring guidelines, and maintenance instructions for the Centralized Dashboard Core service in production environments. This Java/Spring Boot service serves as the central orchestration layer for business intelligence across all domains.

## Table of Contents

1. [Service Operations](#service-operations)
2. [Monitoring and Alerting](#monitoring-and-alerting)
3. [Performance Management](#performance-management)
4. [Backup and Recovery](#backup-and-recovery)
5. [Security Operations](#security-operations)
6. [Troubleshooting](#troubleshooting)
7. [Maintenance Procedures](#maintenance-procedures)
8. [Disaster Recovery](#disaster-recovery)

## Service Operations

### Service Management

#### Starting the Service

**Production Environment:**
```bash
# Using systemd
sudo systemctl start centralized-dashboard-core

# Using Docker
docker-compose -f docker-compose.prod.yml up -d centralized-core

# Using Kubernetes
kubectl apply -f k8s/deployment.yaml -n centralized-dashboard
```

#### Stopping the Service

```bash
# Graceful shutdown (allows 30s for cleanup)
sudo systemctl stop centralized-dashboard-core

# Force stop if needed
sudo systemctl kill centralized-dashboard-core

# Kubernetes
kubectl delete deployment centralized-core -n centralized-dashboard
```

#### Service Status Checks

```bash
# System status
sudo systemctl status centralized-dashboard-core

# Health endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/health/readiness
curl http://localhost:8080/actuator/health/liveness

# Detailed metrics
curl http://localhost:8080/actuator/metrics

# Custom health checks
curl http://localhost:8080/actuator/health/crossDomainIntegration
curl http://localhost:8080/actuator/health/database
curl http://localhost:8080/actuator/health/redis
```

### Configuration Management

#### Environment-Specific Configurations

**Production (`application-prod.yml`):**
```yaml
spring:
  profiles: prod
  datasource:
    url: jdbc:postgresql://postgres-prod:5432/centralized_dashboard
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      max-lifetime: 1200000
  redis:
    host: redis-prod
    port: 6379
    timeout: 2000ms
    lettuce:
      pool:
        max-active: 16
        max-idle: 8
  kafka:
    bootstrap-servers: kafka-prod:9092
    producer:
      retries: 3
      acks: all
    consumer:
      group-id: centralized-core-prod

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true

logging:
  level:
    root: INFO
    com.exalt.centralizeddashboard: INFO
    org.springframework.security: WARN
  file:
    name: /var/log/centralized-core/application.log
    max-file-size: 100MB
    max-history: 30

resilience4j:
  circuitbreaker:
    instances:
      social-commerce:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 60s
        permitted-number-of-calls-in-half-open-state: 3
      warehousing:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 60s
      courier-services:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 60s
```

#### Runtime Configuration Updates

```bash
# Refresh configuration without restart
curl -X POST http://localhost:8080/actuator/refresh \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Update specific property
curl -X POST http://localhost:8080/actuator/env \
  -H "Content-Type: application/json" \
  -d '{"name": "dashboard.refresh-interval", "value": "60s"}'

# Check current configuration
curl http://localhost:8080/actuator/configprops
```

## Monitoring and Alerting

### Key Performance Indicators (KPIs)

#### Service Health Metrics

| Metric | Normal Range | Alert Threshold | Critical Threshold |
|--------|--------------|-----------------|-------------------|
| Response Time (P95) | < 500ms | > 1000ms | > 2000ms |
| CPU Usage | < 70% | > 80% | > 90% |
| Memory Usage | < 80% | > 90% | > 95% |
| Database Connection Pool | < 80% used | > 90% used | > 95% used |
| Circuit Breaker State | CLOSED | HALF_OPEN | OPEN |

#### Business Metrics

| Metric | Normal Range | Alert Threshold |
|--------|--------------|-----------------|
| Cross-Domain Data Collection Success Rate | > 95% | < 90% |
| KPI Calculation Time | < 5s | > 10s |
| Domain Integration Latency | < 200ms | > 500ms |
| Data Freshness | < 5min | > 15min |

### Prometheus Metrics

#### Custom Metrics Configuration

```yaml
# prometheus.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
    tags:
      service: centralized-dashboard-core
      environment: ${SPRING_PROFILES_ACTIVE}
    distribution:
      percentiles-histogram:
        http.server.requests: true
      percentiles:
        http.server.requests: 0.5, 0.95, 0.99
```

#### Key Metrics to Monitor

```promql
# Response time percentiles
histogram_quantile(0.95, 
  http_server_requests_seconds_bucket{service="centralized-dashboard-core"})

# Error rate
rate(http_server_requests_total{service="centralized-dashboard-core", status=~"5.."}[5m])

# Cross-domain integration health
centralized_core_domain_integration_status{domain="social-commerce"}

# KPI calculation performance
centralized_core_kpi_calculation_duration_seconds_bucket

# Database connection pool usage
hikaricp_connections_active{pool="HikariPool-1"}

# Circuit breaker states
resilience4j_circuitbreaker_state{name="social-commerce"}
```

### Grafana Dashboards

#### Dashboard Configuration

```json
{
  "dashboard": {
    "title": "Centralized Dashboard Core - Service Overview",
    "panels": [
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_server_requests_seconds_bucket{service=\"centralized-dashboard-core\"})"
          }
        ]
      },
      {
        "title": "Cross-Domain Integration Status",
        "type": "stat",
        "targets": [
          {
            "expr": "centralized_core_domain_integration_status"
          }
        ]
      },
      {
        "title": "KPI Calculation Performance",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(centralized_core_kpi_calculations_total[5m])"
          }
        ]
      },
      {
        "title": "Circuit Breaker States",
        "type": "table",
        "targets": [
          {
            "expr": "resilience4j_circuitbreaker_state"
          }
        ]
      }
    ]
  }
}
```

### Alert Configuration

#### Prometheus Alert Rules

```yaml
# alert-rules.yml
groups:
- name: centralized-dashboard-core.rules
  rules:
  - alert: HighResponseTime
    expr: histogram_quantile(0.95, http_server_requests_seconds_bucket{service="centralized-dashboard-core"}) > 2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time in centralized dashboard core"
      description: "95th percentile response time is {{ $value }}s"

  - alert: CircuitBreakerOpen
    expr: resilience4j_circuitbreaker_state{state="open"} == 1
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Circuit breaker {{ $labels.name }} is open"
      description: "Circuit breaker for {{ $labels.name }} has been open for more than 2 minutes"

  - alert: DatabaseConnectionPoolExhausted
    expr: hikaricp_connections_active / hikaricp_connections_max > 0.95
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Database connection pool nearly exhausted"
      description: "Connection pool usage is {{ $value | humanizePercentage }}"

  - alert: CrossDomainIntegrationFailure
    expr: centralized_core_domain_integration_status == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Cross-domain integration failure"
      description: "Integration with {{ $labels.domain }} domain has failed"

  - alert: KPICalculationFailure
    expr: rate(centralized_core_kpi_calculation_errors_total[5m]) > 0.1
    for: 3m
    labels:
      severity: warning
    annotations:
      summary: "High KPI calculation failure rate"
      description: "KPI calculation failure rate is {{ $value }} errors/second"
```

## Performance Management

### JVM Performance Tuning

#### Production JVM Settings

```bash
# JVM optimization for production
export JAVA_OPTS="
  -server
  -Xmx4g
  -Xms4g
  -XX:+UseG1GC
  -XX:MaxGCPauseMillis=200
  -XX:+UseStringDeduplication
  -XX:+UnlockExperimentalVMOptions
  -XX:+UseJVMCICompiler
  -XX:+HeapDumpOnOutOfMemoryError
  -XX:HeapDumpPath=/var/log/centralized-core/heapdumps/
  -XX:+PrintGCDetails
  -XX:+PrintGCTimeStamps
  -Xloggc:/var/log/centralized-core/gc.log
  -XX:+UseGCLogFileRotation
  -XX:NumberOfGCLogFiles=10
  -XX:GCLogFileSize=10M
  -Dcom.sun.management.jmxremote=true
  -Dcom.sun.management.jmxremote.port=9999
  -Dcom.sun.management.jmxremote.authenticate=false
  -Dcom.sun.management.jmxremote.ssl=false
"
```

#### Database Connection Pool Tuning

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      max-lifetime: 1200000
      connection-timeout: 20000
      validation-timeout: 5000
      leak-detection-threshold: 60000
      connection-test-query: SELECT 1
```

#### Cache Configuration

```yaml
spring:
  cache:
    type: redis
    redis:
      cache-names:
        - kpiMetrics
        - domainData
        - crossDomainInsights
      time-to-live: 300s
      key-prefix: "centralized-core:"
  redis:
    lettuce:
      pool:
        max-active: 16
        max-idle: 8
        min-idle: 2
        max-wait: 2000ms
```

### Load Testing

#### Performance Test Scripts

```bash
# Apache JMeter load test
jmeter -n -t centralized-core-load-test.jmx \
  -l results.jtl \
  -e -o reports/

# Gatling load test
./mvnw gatling:test -Dgatling.simulationClass=LoadTestSimulation

# K6 load test
k6 run --vus 50 --duration 5m load-test.js
```

#### Load Test Configuration

```javascript
// k6 load test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50, // Virtual users
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

export default function() {
  let response = http.get('http://localhost:8080/api/v1/dashboard/overview');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  sleep(1);
}
```

## Backup and Recovery

### Database Backup Procedures

#### Automated Backup Script

```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/centralized-core"
DB_NAME="centralized_dashboard"

# Create backup with compression
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
  --verbose --no-owner --no-privileges \
  | gzip > $BACKUP_DIR/centralized_core_$DATE.sql.gz

# Backup Redis data
redis-cli --rdb $BACKUP_DIR/redis_dump_$DATE.rdb

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +30 -delete

echo "Backup completed: centralized_core_$DATE.sql.gz"
```

#### Backup Schedule

```cron
# Crontab entry for daily backups at 2 AM
0 2 * * * /opt/centralized-core/scripts/backup-database.sh >> /var/log/backup.log 2>&1

# Weekly full backup
0 2 * * 0 /opt/centralized-core/scripts/full-backup.sh >> /var/log/backup.log 2>&1
```

### Configuration Backup

```bash
# Backup all configuration files
tar -czf config-backup-$(date +%Y%m%d).tar.gz \
  /opt/centralized-core/config/ \
  /opt/centralized-core/k8s/ \
  /opt/centralized-core/scripts/ \
  /opt/centralized-core/application.yml
```

### Recovery Procedures

#### Database Recovery

```bash
# Stop the service
sudo systemctl stop centralized-dashboard-core

# Restore database
gunzip -c centralized_core_20231201_020000.sql.gz | \
  psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Restore Redis data
sudo systemctl stop redis
cp redis_dump_20231201_020000.rdb /var/lib/redis/dump.rdb
sudo systemctl start redis

# Verify data integrity
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM dashboard_kpis;"

# Restart service
sudo systemctl start centralized-dashboard-core
```

## Security Operations

### Security Monitoring

#### Access Log Analysis

```bash
# Monitor authentication failures
tail -f /var/log/centralized-core/application.log | \
  grep "Authentication failed"

# Track admin operations
grep "ADMIN_OPERATION" /var/log/centralized-core/audit.log | \
  tail -20

# Monitor cross-domain access patterns
grep "CrossDomainController" /var/log/centralized-core/application.log | \
  grep -E "(ERROR|WARN)"
```

#### Security Audit Commands

```bash
# Check for suspicious activities
grep -E "(SQL|XSS|CSRF)" /var/log/centralized-core/security.log

# Monitor privilege escalation attempts
grep "ACCESS_DENIED" /var/log/centralized-core/audit.log

# Check JWT token validation failures
grep "JWT_VALIDATION_FAILED" /var/log/centralized-core/security.log
```

### Certificate Management

```bash
# Check SSL certificate expiry
openssl x509 -in /etc/ssl/certs/centralized-core.crt -noout -dates

# Renew certificates (Let's Encrypt)
certbot renew --nginx

# Update Java keystore
keytool -import -alias centralized-core \
  -file /etc/ssl/certs/centralized-core.crt \
  -keystore $JAVA_HOME/lib/security/cacerts \
  -storepass changeit
```

### Security Hardening

```bash
# Update security patches
sudo apt update && sudo apt upgrade -y

# Scan for vulnerabilities
./mvnw dependency-check:aggregate

# OWASP security scan
./mvnw org.owasp:dependency-check-maven:check

# Static code analysis
./mvnw sonar:sonar
```

## Troubleshooting

### Common Issues and Solutions

#### 1. High Memory Usage

**Symptoms:**
- OutOfMemoryError exceptions
- GC overhead warnings
- Slow response times

**Investigation:**
```bash
# Generate heap dump
jcmd <PID> GC.run_finalization
jcmd <PID> VM.dump_heap /tmp/heapdump.hprof

# Analyze heap usage
jmap -histo <PID> | head -20

# Monitor GC activity
jstat -gc <PID> 5s
```

**Solutions:**
- Increase heap size: `-Xmx6g`
- Tune GC: `-XX:+UseG1GC -XX:MaxGCPauseMillis=200`
- Check for memory leaks in cache configurations

#### 2. Database Connection Issues

**Symptoms:**
- Connection timeout errors
- Pool exhausted exceptions
- Database deadlocks

**Investigation:**
```bash
# Check active connections
SELECT count(*) FROM pg_stat_activity 
WHERE datname = 'centralized_dashboard';

# Monitor connection pool
curl http://localhost:8080/actuator/metrics/hikaricp.connections.active

# Check for long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';
```

**Solutions:**
- Increase connection pool size
- Optimize slow queries
- Implement connection leak detection

#### 3. Circuit Breaker Issues

**Symptoms:**
- Service calls failing with CircuitBreakerOpenException
- Degraded functionality
- Fallback responses being returned

**Investigation:**
```bash
# Check circuit breaker states
curl http://localhost:8080/actuator/circuitbreakers

# Monitor circuit breaker metrics
curl http://localhost:8080/actuator/metrics/resilience4j.circuitbreaker.state

# Check domain service health
curl http://social-commerce-service/actuator/health
curl http://warehousing-service/actuator/health
curl http://courier-service/actuator/health
```

**Solutions:**
- Check target service health
- Adjust circuit breaker thresholds
- Implement better fallback mechanisms

## Maintenance Procedures

### Routine Maintenance

#### Daily Tasks

```bash
#!/bin/bash
# daily-maintenance.sh

echo "=== Daily Maintenance Report ===" > /tmp/maintenance.log

# Check service health
curl -f http://localhost:8080/actuator/health >> /tmp/maintenance.log

# Check disk space
df -h >> /tmp/maintenance.log

# Check memory usage
free -h >> /tmp/maintenance.log

# Check recent errors
tail -100 /var/log/centralized-core/application.log | grep ERROR >> /tmp/maintenance.log

# Check circuit breaker status
curl http://localhost:8080/actuator/circuitbreakers >> /tmp/maintenance.log

# Send report
mail -s "Centralized Core Daily Report" admin-team@exalt.com < /tmp/maintenance.log
```

#### Weekly Tasks

```bash
#!/bin/bash
# weekly-maintenance.sh

# Update dependencies (in staging first)
./mvnw versions:display-dependency-updates

# Security vulnerability scan
./mvnw dependency-check:aggregate

# Cleanup old logs
find /var/log/centralized-core -name "*.log.*" -mtime +7 -delete

# Vacuum database
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "VACUUM ANALYZE;"

# Clear old cache entries
redis-cli FLUSHDB

# Generate performance report
./scripts/performance-report.sh
```

### Update Procedures

#### Rolling Updates (Kubernetes)

```bash
# Update deployment with new image
kubectl set image deployment/centralized-core \
  centralized-core=centralized-core:v1.2.0 \
  -n centralized-dashboard

# Monitor rollout
kubectl rollout status deployment/centralized-core -n centralized-dashboard

# Rollback if necessary
kubectl rollout undo deployment/centralized-core -n centralized-dashboard
```

#### Blue-Green Deployment

```bash
# Deploy to green environment
kubectl apply -f k8s/deployment-green.yaml

# Run smoke tests
./scripts/smoke-test.sh green

# Switch traffic
kubectl patch service centralized-core \
  -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor and rollback if needed
kubectl patch service centralized-core \
  -p '{"spec":{"selector":{"version":"blue"}}}'
```

## Disaster Recovery

### Recovery Time Objectives (RTO)

| Component | RTO Target | Recovery Procedure |
|-----------|------------|-------------------|
| Service Instance | 5 minutes | Auto-scaling/Health check restart |
| Database | 15 minutes | Restore from backup |
| Complete System | 30 minutes | Full disaster recovery |
| Cross-Domain Integration | 10 minutes | Circuit breaker failover |

### Recovery Point Objectives (RPO)

| Data Type | RPO Target | Backup Frequency |
|-----------|------------|------------------|
| Transactional Data | 15 minutes | Continuous WAL |
| Configuration | 1 hour | Real-time Git sync |
| Cache Data | 5 minutes | Redis persistence |
| Audit Logs | 1 hour | Continuous shipping |

### Disaster Recovery Plan

1. **Assess Damage**: Determine scope of outage
2. **Isolate Issues**: Prevent cascading failures
3. **Restore Service**: Follow recovery procedures
4. **Verify Operations**: Run comprehensive health checks
5. **Monitor**: Watch for recurring issues
6. **Post-Mortem**: Document lessons learned

### Emergency Contacts

- **Primary On-Call**: +1-555-0123 (core-team-primary@exalt.com)
- **Secondary On-Call**: +1-555-0124 (core-team-secondary@exalt.com)
- **DevOps Team**: devops-emergency@exalt.com
- **Database Team**: dba-team@exalt.com

---

*Last Updated: 2024-06-25*
*Document Version: 1.0*
*Review Schedule: Monthly*