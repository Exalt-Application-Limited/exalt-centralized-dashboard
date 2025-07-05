package com.gogidix.centralizeddashboard.dataaggregation.service;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

import com.gogidix.centralizeddashboard.dataaggregation.config.ServiceProperties;
import com.gogidix.centralizeddashboard.dataaggregation.dto.AggregationRequest;
import com.gogidix.centralizeddashboard.dataaggregation.dto.AggregationResult;
import com.gogidix.centralizeddashboard.dataaggregation.dto.DataSourceMetadata;
import com.gogidix.centralizeddashboard.dataaggregation.dto.TimeSeriesData;
import com.gogidix.centralizeddashboard.dataaggregation.exception.AggregationException;
import com.gogidix.centralizeddashboard.dataaggregation.exception.DataSourceException;
import com.gogidix.centralizeddashboard.dataaggregation.repository.AggregationCacheRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service responsible for aggregating data from multiple microservices 
 * and performing analytics operations on the collected data.
 */
@Service
public class DataAggregationService {
    private static final Logger logger = LoggerFactory.getLogger(DataAggregationService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
    
    private final WebClient.Builder webClientBuilder;
    private final ServiceProperties serviceProperties;
    private final AggregationCacheRepository cacheRepository;
    
    // Map of service endpoints for quick lookup
    private final Map<String, String> serviceEndpoints = new ConcurrentHashMap<>();
    
    @Autowired
    public DataAggregationService(
            WebClient.Builder webClientBuilder,
            ServiceProperties serviceProperties,
            AggregationCacheRepository cacheRepository) {
        this.webClientBuilder = webClientBuilder;
        this.serviceProperties = serviceProperties;
        this.cacheRepository = cacheRepository;
        
        // Initialize service endpoints from configuration
        initializeServiceEndpoints();
    }
    
    /**
     * Initialize service endpoints from configuration properties.
     */
    private void initializeServiceEndpoints() {
        serviceProperties.getServices().forEach(service -> 
            serviceEndpoints.put(service.getName(), service.getUrl()));
        
        logger.info("Initialized {} service endpoints for data aggregation", serviceEndpoints.size());
    }
    
    /**
     * Aggregates data from multiple services based on the provided request.
     * 
     * @param request The aggregation request containing data sources and time range
     * @return A Mono containing the aggregation result
     */
    @Cacheable(value = "aggregationResults", key = "#request.cacheKey")
    public Mono<AggregationResult> aggregateData(AggregationRequest request) {
        logger.info("Processing aggregation request: {}", request);
        
        // Validate request
        if (request.getDataSources() == null || request.getDataSources().isEmpty()) {
            return Mono.error(new AggregationException("No data sources specified"));
        }
        
        // Collect data from each data source
        List<Mono<Map<String, Object>>> dataCollectionTasks = request.getDataSources().stream()
                .map(source -> fetchDataFromService(source, request.getStartDate(), request.getEndDate()))
                .collect(Collectors.toList());
        
        // Combine all data collection tasks
        return Flux.fromIterable(dataCollectionTasks)
                .flatMap(Function.identity())
                .collectList()
                .map(results -> {
                    // Merge all collected data
                    Map<String, Object> mergedData = new HashMap<>();
                    results.forEach(mergedData::putAll);
                    
                    // Apply aggregation functions if requested
                    if (request.getAggregationFunctions() != null && !request.getAggregationFunctions().isEmpty()) {
                        mergedData = applyAggregationFunctions(mergedData, request.getAggregationFunctions());
                    }
                    
                    return new AggregationResult(
                            UUID.randomUUID().toString(),
                            LocalDateTime.now().format(DATE_FORMATTER),
                            request.getDataSources(),
                            request.getStartDate(),
                            request.getEndDate(),
                            mergedData
                    );
                })
                .doOnSuccess(result -> {
                    // Cache the result for future queries if caching is enabled
                    if (request.isCacheable()) {
                        cacheRepository.saveResult(request.getCacheKey(), result);
                    }
                })
                .onErrorResume(e -> {
                    logger.error("Error during data aggregation: {}", e.getMessage());
                    return Mono.error(new AggregationException("Failed to aggregate data: " + e.getMessage(), e));
                });
    }
    
    /**
     * Fetches data from a specific service endpoint based on the data source configuration.
     * 
     * @param dataSource The data source metadata
     * @param startDate The start date for time-based queries
     * @param endDate The end date for time-based queries
     * @return A Mono containing the fetched data
     */
    private Mono<Map<String, Object>> fetchDataFromService(
            DataSourceMetadata dataSource, 
            String startDate, 
            String endDate) {
        
        String finalServiceName = dataSource.getServiceName();
        String endpoint = serviceEndpoints.getOrDefault(finalServiceName, null);
        
        if (endpoint == null) {
            logger.error("Unknown service: {}", finalServiceName);
            return Mono.error(new DataSourceException("Unknown service: " + finalServiceName));
        }
        
        String baseUrl = endpoint + dataSource.getEndpoint();
        
        // Add query parameters if needed
        String fullUrl = baseUrl;
        if (dataSource.isTimeRangeRequired() && startDate != null && endDate != null) {
            fullUrl = baseUrl + "?startDate=" + startDate + "&endDate=" + endDate;
        }
        
        final String finalUrl = fullUrl;
        
        logger.info("Fetching data from: {}", finalUrl);
        
        return webClientBuilder.build()
                .get()
                .uri(finalUrl)
                .retrieve()
                .onStatus(status -> status.isError(), response -> {
                    logger.error("Error fetching data from {}: {}", finalUrl, response.statusCode());
                    return Mono.error(new DataSourceException(
                            "Failed to fetch data from " + finalServiceName + ": " + response.statusCode()));
                })
                .bodyToMono(Map.class)
                .map(data -> {
                    // Prefix all keys with the service name to avoid key collisions
                    @SuppressWarnings("unchecked")
                    Map<String, Object> typedData = (Map<String, Object>) data;
                    return typedData.entrySet().stream()
                            .collect(Collectors.toMap(
                                    entry -> finalServiceName + "." + entry.getKey(),
                                    Map.Entry::getValue
                            ));
                })
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .maxBackoff(Duration.ofSeconds(5))
                        .filter(throwable -> throwable instanceof DataSourceException))
                .onErrorResume(e -> {
                    logger.error("Error fetching data from {}: {}", finalServiceName, e.getMessage());
                    return Mono.just(Collections.singletonMap(
                            finalServiceName + ".error", "Failed to fetch data: " + e.getMessage()));
                });
    }
    
    /**
     * Applies aggregation functions to the collected data.
     * 
     * @param data The collected data
     * @param functions List of aggregation functions to apply
     * @return The data with aggregation functions applied
     */
    private Map<String, Object> applyAggregationFunctions(Map<String, Object> data, List<String> functions) {
        Map<String, Object> result = new HashMap<>(data);
        
        for (String function : functions) {
            switch (function) {
                case "sum":
                    applySum(result, data);
                    break;
                case "average":
                    applyAverage(result, data);
                    break;
                case "min":
                    applyMin(result, data);
                    break;
                case "max":
                    applyMax(result, data);
                    break;
                case "count":
                    applyCount(result, data);
                    break;
                default:
                    logger.warn("Unknown aggregation function: {}", function);
            }
        }
        
        return result;
    }
    
    /**
     * Applies sum aggregation to numeric values in the data.
     */
    private void applySum(Map<String, Object> result, Map<String, Object> data) {
        Map<String, Double> numericValues = extractNumericValues(data);
        if (!numericValues.isEmpty()) {
            double sum = numericValues.values().stream().mapToDouble(Double::doubleValue).sum();
            result.put("aggregated.sum", sum);
        }
    }
    
    /**
     * Applies average aggregation to numeric values in the data.
     */
    private void applyAverage(Map<String, Object> result, Map<String, Object> data) {
        Map<String, Double> numericValues = extractNumericValues(data);
        if (!numericValues.isEmpty()) {
            double avg = numericValues.values().stream()
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.0);
            result.put("aggregated.average", avg);
        }
    }
    
    /**
     * Applies min aggregation to numeric values in the data.
     */
    private void applyMin(Map<String, Object> result, Map<String, Object> data) {
        Map<String, Double> numericValues = extractNumericValues(data);
        if (!numericValues.isEmpty()) {
            double min = numericValues.values().stream()
                    .mapToDouble(Double::doubleValue)
                    .min()
                    .orElse(0.0);
            result.put("aggregated.min", min);
        }
    }
    
    /**
     * Applies max aggregation to numeric values in the data.
     */
    private void applyMax(Map<String, Object> result, Map<String, Object> data) {
        Map<String, Double> numericValues = extractNumericValues(data);
        if (!numericValues.isEmpty()) {
            double max = numericValues.values().stream()
                    .mapToDouble(Double::doubleValue)
                    .max()
                    .orElse(0.0);
            result.put("aggregated.max", max);
        }
    }
    
    /**
     * Applies count aggregation to values in the data.
     */
    private void applyCount(Map<String, Object> result, Map<String, Object> data) {
        result.put("aggregated.count", data.size());
    }
    
    /**
     * Extracts numeric values from the data.
     */
    private Map<String, Double> extractNumericValues(Map<String, Object> data) {
        return data.entrySet().stream()
                .filter(entry -> entry.getValue() instanceof Number)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> ((Number) entry.getValue()).doubleValue()
                ));
    }
    
    /**
     * Gets time series data for a specific metric across multiple services.
     * 
     * @param metricName The name of the metric to collect
     * @param services List of services to collect from
     * @param startDate The start date
     * @param endDate The end date
     * @param interval The time interval for data points
     * @return A Mono containing the time series data
     */
    public Mono<TimeSeriesData> getTimeSeriesData(
            String metricName,
            List<String> services,
            String startDate,
            String endDate,
            String interval) {
        
        List<Mono<Map<String, Object>>> serviceDataTasks = services.stream()
                .filter(serviceEndpoints::containsKey)
                .map(service -> {
                    String endpoint = serviceEndpoints.get(service) + "/metrics/" + metricName + "/timeseries";
                    String url = endpoint + "?startDate=" + startDate + "&endDate=" + endDate + "&interval=" + interval;
                    
                    return webClientBuilder.build()
                            .get()
                            .uri(url)
                            .retrieve()
                            .bodyToMono(Map.class)
                            .map(data -> {
                                Map<String, Object> result = new HashMap<>();
                                result.put(service, data);
                                return result;
                            })
                            .onErrorResume(e -> {
                                logger.error("Error fetching time series data from {}: {}", service, e.getMessage());
                                return Mono.just(Collections.emptyMap());
                            });
                })
                .collect(Collectors.toList());
        
        return Flux.fromIterable(serviceDataTasks)
                .flatMap(Function.identity())
                .collectList()
                .map(results -> {
                    Map<String, Object> combinedData = new HashMap<>();
                    results.forEach(combinedData::putAll);
                    
                    return new TimeSeriesData(
                            metricName,
                            startDate,
                            endDate,
                            interval,
                            services,
                            combinedData
                    );
                })
                .onErrorResume(e -> {
                    logger.error("Error retrieving time series data: {}", e.getMessage());
                    return Mono.error(new AggregationException("Failed to retrieve time series data: " + e.getMessage()));
                });
    }
} 
