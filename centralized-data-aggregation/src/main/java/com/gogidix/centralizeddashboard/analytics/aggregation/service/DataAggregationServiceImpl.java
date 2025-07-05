package com.gogidix.centralizeddashboard.analytics.aggregation.service;

import com.gogidix.centralizeddashboard.analytics.aggregation.model.AggregatedMetric;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.AnalyticsEvent;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.EventType;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.MetricType;
import com.gogidix.centralizeddashboard.analytics.aggregation.model.TimeGranularity;
import com.gogidix.centralizeddashboard.analytics.aggregation.repository.AggregatedMetricRepository;
import com.gogidix.centralizeddashboard.analytics.aggregation.repository.AnalyticsEventRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of the data aggregation service
 */
@Service
public class DataAggregationServiceImpl implements DataAggregationService {

    private static final Logger logger = LoggerFactory.getLogger(DataAggregationServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    private final AggregatedMetricRepository metricRepository;
    private final AnalyticsEventRepository eventRepository;
    
    @Autowired
    public DataAggregationServiceImpl(
            AggregatedMetricRepository metricRepository,
            AnalyticsEventRepository eventRepository) {
        this.metricRepository = metricRepository;
        this.eventRepository = eventRepository;
    }

    @Override
    @Transactional
    public AggregatedMetric storeMetric(AggregatedMetric metric) {
        logger.debug("Storing aggregated metric: {}", metric.getName());
        return metricRepository.save(metric);
    }

    @Override
    @Transactional
    public AggregatedMetric createMetric(MetricType metricType, String name, String dimension, 
            Double value, LocalDateTime startTime, LocalDateTime endTime, 
            TimeGranularity granularity) {
        logger.debug("Creating aggregated metric: {}", name);
        
        AggregatedMetric metric = AggregatedMetric.builder()
                .metricType(metricType)
                .name(name)
                .dimension(dimension)
                .value(value)
                .startTime(startTime)
                .endTime(endTime)
                .granularity(granularity)
                .build();
        
        return metricRepository.save(metric);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AggregatedMetric> findMetricsByType(MetricType metricType) {
        return metricRepository.findByMetricType(metricType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AggregatedMetric> findMetricsByName(String name) {
        return metricRepository.findByName(name);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AggregatedMetric> findMetricsByDimension(String dimension) {
        return metricRepository.findByDimension(dimension);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AggregatedMetric> findMetricsByNameAndDimension(String name, String dimension) {
        return metricRepository.findByNameAndDimension(name, dimension);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AggregatedMetric> findMetricsByTimeRange(LocalDateTime start, LocalDateTime end) {
        return metricRepository.findByStartTimeBetween(start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AggregatedMetric> findMetricsByNameAndTimeRange(
            String name, LocalDateTime start, LocalDateTime end) {
        return metricRepository.findByNameAndStartTimeBetween(name, start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AggregatedMetric> findMetricsByNameDimensionAndTimeRange(
            String name, String dimension, LocalDateTime start, LocalDateTime end) {
        return metricRepository.findByNameAndDimensionAndStartTimeBetween(name, dimension, start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AggregatedMetric> findMetricsByGranularity(TimeGranularity granularity) {
        return metricRepository.findByGranularity(granularity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AggregatedMetric> findMetricsByNameDimensionAndGranularity(
            String name, String dimension, TimeGranularity granularity) {
        return metricRepository.findByNameAndDimensionAndGranularity(name, dimension, granularity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AggregatedMetric> findMetricsByTimeRangeAndGranularity(
            LocalDateTime start, LocalDateTime end, TimeGranularity granularity) {
        return metricRepository.findByStartTimeBetweenAndGranularity(start, end, granularity);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, List<Object[]>> getMetricsTimeSeries(
            String name, String dimension, LocalDateTime start, LocalDateTime end, 
            TimeGranularity granularity) {
        List<AggregatedMetric> metrics;
        
        if (dimension != null && !dimension.isEmpty()) {
            metrics = metricRepository.findByNameAndDimensionAndStartTimeBetweenAndGranularity(
                    name, dimension, start, end, granularity);
        } else {
            metrics = metricRepository.findByNameAndStartTimeBetweenAndGranularity(
                    name, start, end, granularity);
        }
        
        Map<String, List<Object[]>> result = new HashMap<>();
        
        if (dimension != null && !dimension.isEmpty()) {
            // If dimension is specified, return a single series
            List<Object[]> series = metrics.stream()
                    .map(m -> new Object[]{m.getStartTime().toString(), m.getValue()})
                    .collect(Collectors.toList());
            
            result.put(dimension, series);
        } else {
            // If dimension is not specified, group by dimension
            Map<String, List<AggregatedMetric>> groupedByDimension = metrics.stream()
                    .collect(Collectors.groupingBy(AggregatedMetric::getDimension));
            
            groupedByDimension.forEach((dim, metricList) -> {
                List<Object[]> series = metricList.stream()
                        .map(m -> new Object[]{m.getStartTime().toString(), m.getValue()})
                        .collect(Collectors.toList());
                
                result.put(dim, series);
            });
        }
        
        return result;
    }

    @Override
    @Transactional
    public void aggregateData(LocalDateTime start, LocalDateTime end, TimeGranularity granularity) {
        logger.info("Aggregating data for period: {} to {} with granularity: {}", 
                start, end, granularity);
        
        try {
            // Aggregate different types of metrics
            aggregateUserActivityMetrics(start, end, granularity);
            aggregateEcommerceMetrics(start, end, granularity);
            aggregatePerformanceMetrics(start, end, granularity);
            
            logger.info("Data aggregation completed successfully");
        } catch (Exception e) {
            logger.error("Error during data aggregation: {}", e.getMessage(), e);
            throw new RuntimeException("Error during data aggregation", e);
        }
    }

    @Override
    @Transactional
    public void aggregateUserActivityMetrics(LocalDateTime start, LocalDateTime end, TimeGranularity granularity) {
        logger.info("Aggregating user activity metrics");
        
        try {
            // Aggregate page views
            aggregateEventCounts(EventType.PAGE_VIEW, "page_views", start, end, granularity);
            
            // Aggregate unique users
            aggregateUniqueUsers(start, end, granularity);
            
            // Aggregate user sessions
            aggregateUniqueSessions(start, end, granularity);
            
            // Aggregate user registrations
            aggregateEventCounts(EventType.USER_REGISTRATION, "user_registrations", start, end, granularity);
            
            // Aggregate user logins
            aggregateEventCounts(EventType.USER_LOGIN, "user_logins", start, end, granularity);
            
            logger.info("User activity metrics aggregation completed");
        } catch (Exception e) {
            logger.error("Error aggregating user activity metrics: {}", e.getMessage(), e);
            throw new RuntimeException("Error aggregating user activity metrics", e);
        }
    }

    @Override
    @Transactional
    public void aggregateEcommerceMetrics(LocalDateTime start, LocalDateTime end, TimeGranularity granularity) {
        logger.info("Aggregating e-commerce metrics");
        
        try {
            // Aggregate product views
            aggregateEventCounts(EventType.PRODUCT_VIEW, "product_views", start, end, granularity);
            
            // Aggregate add to cart events
            aggregateEventCounts(EventType.ADD_TO_CART, "add_to_cart", start, end, granularity);
            
            // Aggregate checkout starts
            aggregateEventCounts(EventType.CHECKOUT_START, "checkout_starts", start, end, granularity);
            
            // Aggregate orders
            aggregateEventCounts(EventType.CHECKOUT_COMPLETE, "orders", start, end, granularity);
            
            // Aggregate conversion rates
            aggregateConversionRates(start, end, granularity);
            
            logger.info("E-commerce metrics aggregation completed");
        } catch (Exception e) {
            logger.error("Error aggregating e-commerce metrics: {}", e.getMessage(), e);
            throw new RuntimeException("Error aggregating e-commerce metrics", e);
        }
    }

    @Override
    @Transactional
    public void aggregatePerformanceMetrics(LocalDateTime start, LocalDateTime end, TimeGranularity granularity) {
        logger.info("Aggregating performance metrics");
        
        try {
            // Aggregate API errors
            aggregateEventCounts(EventType.SERVICE_ERROR, "api_errors", start, end, granularity);
            
            // Aggregate health checks
            aggregateEventCounts(EventType.SERVICE_HEALTH_CHECK, "health_checks", start, end, granularity);
            
            // Aggregate rate limit exceeded events
            aggregateEventCounts(EventType.API_RATE_LIMIT_EXCEEDED, "rate_limit_exceeded", start, end, granularity);
            
            logger.info("Performance metrics aggregation completed");
        } catch (Exception e) {
            logger.error("Error aggregating performance metrics: {}", e.getMessage(), e);
            throw new RuntimeException("Error aggregating performance metrics", e);
        }
    }

    @Override
    @Transactional
    public int pruneOldMetrics(LocalDateTime cutoffDate) {
        logger.info("Pruning old metrics data before {}", cutoffDate);
        
        List<AggregatedMetric> oldMetrics = metricRepository.findByEndTimeBefore(cutoffDate);
        int count = oldMetrics.size();
        
        metricRepository.deleteAll(oldMetrics);
        
        logger.info("Pruned {} old metrics", count);
        return count;
    }
    
    /**
     * Helper method to aggregate event counts by type
     */
    private void aggregateEventCounts(EventType eventType, String metricName, 
            LocalDateTime start, LocalDateTime end, TimeGranularity granularity) {
        logger.debug("Aggregating {} events", eventType);
        
        List<LocalDateTime> timePoints = generateTimePoints(start, end, granularity);
        
        for (int i = 0; i < timePoints.size() - 1; i++) {
            LocalDateTime periodStart = timePoints.get(i);
            LocalDateTime periodEnd = timePoints.get(i + 1);
            
            // Count events in this time period
            long count = eventRepository.countByEventTypeAndTimestampBetween(
                    eventType, periodStart, periodEnd);
            
            // Create metric for overall count
            createMetric(
                    MetricType.COUNT,
                    metricName,
                    "overall",
                    (double) count,
                    periodStart,
                    periodEnd,
                    granularity
            );
            
            // Get events in this time period
            List<AnalyticsEvent> events = eventRepository.findByEventTypeAndTimestampBetween(
                    eventType, periodStart, periodEnd);
            
            // Group by source service and create metrics
            Map<String, Long> countsByService = events.stream()
                    .collect(Collectors.groupingBy(AnalyticsEvent::getSourceService, Collectors.counting()));
            
            countsByService.forEach((service, serviceCount) -> {
                createMetric(
                        MetricType.COUNT,
                        metricName,
                        "service:" + service,
                        serviceCount.doubleValue(),
                        periodStart,
                        periodEnd,
                        granularity
                );
            });
        }
    }
    
    /**
     * Helper method to aggregate unique users
     */
    private void aggregateUniqueUsers(LocalDateTime start, LocalDateTime end, TimeGranularity granularity) {
        logger.debug("Aggregating unique users");
        
        List<LocalDateTime> timePoints = generateTimePoints(start, end, granularity);
        
        for (int i = 0; i < timePoints.size() - 1; i++) {
            LocalDateTime periodStart = timePoints.get(i);
            LocalDateTime periodEnd = timePoints.get(i + 1);
            
            // Get events in this time period
            List<AnalyticsEvent> events = eventRepository.findByTimestampBetween(periodStart, periodEnd);
            
            // Count unique users
            long uniqueUsers = events.stream()
                    .map(AnalyticsEvent::getUserId)
                    .distinct()
                    .count();
            
            // Create metric for unique users
            createMetric(
                    MetricType.UNIQUE_COUNT,
                    "unique_users",
                    "overall",
                    (double) uniqueUsers,
                    periodStart,
                    periodEnd,
                    granularity
            );
            
            // Group by source service and create metrics
            Map<String, List<AnalyticsEvent>> eventsByService = events.stream()
                    .collect(Collectors.groupingBy(AnalyticsEvent::getSourceService));
            
            eventsByService.forEach((service, serviceEvents) -> {
                long serviceUniqueUsers = serviceEvents.stream()
                        .map(AnalyticsEvent::getUserId)
                        .distinct()
                        .count();
                
                createMetric(
                        MetricType.UNIQUE_COUNT,
                        "unique_users",
                        "service:" + service,
                        (double) serviceUniqueUsers,
                        periodStart,
                        periodEnd,
                        granularity
                );
            });
        }
    }
    
    /**
     * Helper method to aggregate unique sessions
     */
    private void aggregateUniqueSessions(LocalDateTime start, LocalDateTime end, TimeGranularity granularity) {
        logger.debug("Aggregating unique sessions");
        
        List<LocalDateTime> timePoints = generateTimePoints(start, end, granularity);
        
        for (int i = 0; i < timePoints.size() - 1; i++) {
            LocalDateTime periodStart = timePoints.get(i);
            LocalDateTime periodEnd = timePoints.get(i + 1);
            
            // Get events in this time period
            List<AnalyticsEvent> events = eventRepository.findByTimestampBetween(periodStart, periodEnd);
            
            // Count unique sessions
            long uniqueSessions = events.stream()
                    .map(AnalyticsEvent::getSessionId)
                    .distinct()
                    .count();
            
            // Create metric for unique sessions
            createMetric(
                    MetricType.UNIQUE_COUNT,
                    "unique_sessions",
                    "overall",
                    (double) uniqueSessions,
                    periodStart,
                    periodEnd,
                    granularity
            );
            
            // Group by source service and create metrics
            Map<String, List<AnalyticsEvent>> eventsByService = events.stream()
                    .collect(Collectors.groupingBy(AnalyticsEvent::getSourceService));
            
            eventsByService.forEach((service, serviceEvents) -> {
                long serviceUniqueSessions = serviceEvents.stream()
                        .map(AnalyticsEvent::getSessionId)
                        .distinct()
                        .count();
                
                createMetric(
                        MetricType.UNIQUE_COUNT,
                        "unique_sessions",
                        "service:" + service,
                        (double) serviceUniqueSessions,
                        periodStart,
                        periodEnd,
                        granularity
                );
            });
        }
    }
    
    /**
     * Helper method to aggregate conversion rates
     */
    private void aggregateConversionRates(LocalDateTime start, LocalDateTime end, TimeGranularity granularity) {
        logger.debug("Aggregating conversion rates");
        
        List<LocalDateTime> timePoints = generateTimePoints(start, end, granularity);
        
        for (int i = 0; i < timePoints.size() - 1; i++) {
            LocalDateTime periodStart = timePoints.get(i);
            LocalDateTime periodEnd = timePoints.get(i + 1);
            
            // Count relevant events in this time period
            long productViews = eventRepository.countByEventTypeAndTimestampBetween(
                    EventType.PRODUCT_VIEW, periodStart, periodEnd);
            
            long addToCarts = eventRepository.countByEventTypeAndTimestampBetween(
                    EventType.ADD_TO_CART, periodStart, periodEnd);
            
            long checkoutStarts = eventRepository.countByEventTypeAndTimestampBetween(
                    EventType.CHECKOUT_START, periodStart, periodEnd);
            
            long orders = eventRepository.countByEventTypeAndTimestampBetween(
                    EventType.CHECKOUT_COMPLETE, periodStart, periodEnd);
            
            // Calculate conversion rates
            double addToCartRate = productViews > 0 ? (double) addToCarts / productViews : 0;
            double checkoutRate = addToCarts > 0 ? (double) checkoutStarts / addToCarts : 0;
            double orderCompletionRate = checkoutStarts > 0 ? (double) orders / checkoutStarts : 0;
            double overallConversionRate = productViews > 0 ? (double) orders / productViews : 0;
            
            // Create metrics for conversion rates
            createMetric(
                    MetricType.RATE,
                    "add_to_cart_rate",
                    "overall",
                    addToCartRate,
                    periodStart,
                    periodEnd,
                    granularity
            );
            
            createMetric(
                    MetricType.RATE,
                    "checkout_rate",
                    "overall",
                    checkoutRate,
                    periodStart,
                    periodEnd,
                    granularity
            );
            
            createMetric(
                    MetricType.RATE,
                    "order_completion_rate",
                    "overall",
                    orderCompletionRate,
                    periodStart,
                    periodEnd,
                    granularity
            );
            
            createMetric(
                    MetricType.RATE,
                    "overall_conversion_rate",
                    "overall",
                    overallConversionRate,
                    periodStart,
                    periodEnd,
                    granularity
            );
        }
    }
    
    /**
     * Helper method to generate time points based on granularity
     */
    private List<LocalDateTime> generateTimePoints(
            LocalDateTime start, LocalDateTime end, TimeGranularity granularity) {
        List<LocalDateTime> timePoints = new ArrayList<>();
        
        // Add the start time
        timePoints.add(start);
        
        // Generate intermediate time points based on granularity
        LocalDateTime current = start;
        
        while (current.isBefore(end)) {
            LocalDateTime next;
            
            switch (granularity) {
                case MINUTE:
                    next = current.plusMinutes(1);
                    break;
                case HOUR:
                    next = current.plusHours(1);
                    break;
                case DAY:
                    next = current.plusDays(1);
                    break;
                case WEEK:
                    next = current.plusWeeks(1);
                    break;
                case MONTH:
                    next = current.plusMonths(1);
                    break;
                case QUARTER:
                    next = current.plusMonths(3);
                    break;
                case YEAR:
                    next = current.plusYears(1);
                    break;
                default:
                    next = current.plusDays(1); // Default to daily
                    break;
            }
            
            // Make sure we don't go past the end time
            if (next.isAfter(end)) {
                break;
            }
            
            timePoints.add(next);
            current = next;
        }
        
        // Add the end time if it's not already included
        if (!timePoints.contains(end)) {
            timePoints.add(end);
        }
        
        return timePoints;
    }
} 