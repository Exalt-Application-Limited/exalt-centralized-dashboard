# Centralized Dashboard Shared Documentation

## Overview
The Centralized Dashboard Shared service provides common components, utilities, and libraries shared across all centralized dashboard services. It includes shared DTOs, common configurations, utility classes, and integration helpers.

## Components

### Core Shared Components
- **CommonDTOs**: Shared data transfer objects used across all dashboard services
- **SharedConfigurations**: Common Spring configurations and beans
- **UtilityClasses**: Helper classes for data processing, validation, and transformation
- **IntegrationHelpers**: Common integration patterns and client configurations

### Shared Libraries
- **DataMappingUtils**: Object mapping and transformation utilities
- **ValidationFramework**: Common validation rules and validators
- **CacheConfiguration**: Shared Redis cache configurations
- **SecurityCommons**: Common security utilities and helpers

### Data Models
- **SharedDomain**: Common domain objects used across services
- **CommonExceptions**: Standardized exception classes
- **SharedConstants**: Application-wide constants and enumerations
- **ConfigurationProperties**: Shared configuration properties

## Technology Stack
- **Framework**: Spring Boot with shared configuration
- **Mapping**: MapStruct for object mapping
- **Validation**: Hibernate Validator for common validation rules
- **Utilities**: Apache Commons Lang, Guava for utility functions
- **Documentation**: Shared OpenAPI specifications