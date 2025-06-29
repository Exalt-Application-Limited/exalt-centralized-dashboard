# Centralized Data Aggregation Operations

## Overview
Operational procedures for the Centralized Data Aggregation service, including monitoring data pipeline health, managing aggregation schedules, and troubleshooting data processing issues.

## Service Operations

### Data Pipeline Monitoring
```bash
# Check aggregation job status
curl http://localhost:8081/actuator/health/aggregation

# Monitor data source connectivity
curl http://localhost:8081/api/v1/aggregation/sources/status

# View aggregation scheduler status
curl http://localhost:8081/actuator/scheduledtasks
```

### Cache Management
```bash
# Check Redis cache status
redis-cli INFO memory
redis-cli INFO keyspace

# Warm up aggregation cache
curl -X POST http://localhost:8081/api/v1/cache/warm-up

# Clear specific domain cache
curl -X DELETE http://localhost:8081/api/v1/cache/evict/social-commerce
```

## Monitoring and Alerting

### Key Metrics
- Data collection success rate: > 95%
- Aggregation processing time: < 30s
- Cache hit ratio: > 80%
- Data freshness: < 5 minutes

### Performance Tuning
- Optimize aggregation batch sizes
- Configure Redis memory allocation
- Tune scheduler intervals based on data volume
- Monitor database query performance