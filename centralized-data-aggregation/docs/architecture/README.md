# Architecture Documentation - Centralized Data Aggregation

## Overview

The Centralized Data Aggregation service serves as the data consolidation backbone for the centralized dashboard ecosystem, collecting and processing data from all Global HQ dashboards to provide unified analytics capabilities.

## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                Data Aggregation Service                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Data      │  │ Analytics   │  │     Aggregation         │  │
│  │ Collection  │  │ Processing  │  │     Scheduling          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Cache     │  │ Time Series │  │   Event Processing      │  │
│  │ Management  │  │ Analytics   │  │     Engine              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Overview

### Core Components
- **DataAggregationService**: Main orchestration service
- **AnalyticsService**: Event-driven analytics processing
- **SchedulingComponents**: Automated data collection scheduling
- **CacheRepository**: Redis-based performance optimization

### Technology Stack
- **Framework**: Spring Boot 3.x with reactive WebFlux
- **Database**: PostgreSQL for persistence
- **Cache**: Redis for performance optimization
- **Scheduling**: Spring Scheduler with Quartz
- **Processing**: Spring Batch for large datasets