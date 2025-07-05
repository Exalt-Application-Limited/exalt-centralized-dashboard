package com.gogidix.centralizeddashboard.core.integration;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Client for integrating with the Warehousing domain.
 * Handles communication with Warehousing services to fetch metrics and data.
 */
@Component
@Slf4j
public class WarehousingClient {

    private final RestTemplate restTemplate;
    
    @Value("${service.warehousing.url}")
    private String warehousingBaseUrl;
    
    @Value("${service.warehousing.inventory.url:${service.warehousing.url}/inventory}")
    private String inventoryUrl;
    
    @Value("${service.warehousing.operations.url:${service.warehousing.url}/operations}")
    private String operationsUrl;
    
    @Value("${service.warehousing.fulfillment.url:${service.warehousing.url}/fulfillment}")
    private String fulfillmentUrl;

    public WarehousingClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch inventory metrics from the Warehousing domain.
     * These metrics provide insights into inventory levels, turnover, and value.
     *
     * @return a list of inventory metrics
     */
    @CircuitBreaker(name = "warehousingInventory", fallbackMethod = "getDefaultInventoryMetrics")
    public List<Map<String, Object>> getInventoryMetrics() {
        log.info("Fetching inventory metrics from Warehousing domain");
        try {
            String url = inventoryUrl + "/api/metrics";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} inventory metrics from Warehousing domain", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching inventory metrics from Warehousing domain", e);
            throw e;
        }
    }

    /**
     * Fallback method for inventory metrics in case of circuit breaker activation.
     *
     * @param e the exception that triggered the fallback
     * @return a default list of metrics
     */
    public List<Map<String, Object>> getDefaultInventoryMetrics(Exception e) {
        log.warn("Circuit breaker activated for Warehousing inventory metrics. Using default values.", e);
        List<Map<String, Object>> defaultMetrics = new ArrayList<>();
        
        // Create default inventory turnover metric
        Map<String, Object> inventoryTurnoverMetric = new HashMap<>();
        inventoryTurnoverMetric.put("metricName", "inventory_turnover");
        inventoryTurnoverMetric.put("metricValue", 5.6);
        inventoryTurnoverMetric.put("metricUnit", "ratio");
        inventoryTurnoverMetric.put("timestamp", LocalDateTime.now());
        
        // Create default storage utilization metric
        Map<String, Object> storageUtilizationMetric = new HashMap<>();
        storageUtilizationMetric.put("metricName", "storage_utilization");
        storageUtilizationMetric.put("metricValue", 76.8);
        storageUtilizationMetric.put("metricUnit", "percent");
        storageUtilizationMetric.put("timestamp", LocalDateTime.now());
        
        defaultMetrics.add(inventoryTurnoverMetric);
        defaultMetrics.add(storageUtilizationMetric);
        
        return defaultMetrics;
    }

    /**
     * Fetch operations metrics from the Warehousing domain.
     * These metrics provide insights into warehouse operations efficiency.
     *
     * @return a list of operations metrics
     */
    @CircuitBreaker(name = "warehousingOperations", fallbackMethod = "getDefaultOperationsMetrics")
    public List<Map<String, Object>> getOperationsMetrics() {
        log.info("Fetching operations metrics from Warehousing domain");
        try {
            String url = operationsUrl + "/api/metrics";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} operations metrics from Warehousing domain", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching operations metrics from Warehousing domain", e);
            throw e;
        }
    }

    /**
     * Fallback method for operations metrics in case of circuit breaker activation.
     *
     * @param e the exception that triggered the fallback
     * @return a default list of metrics
     */
    public List<Map<String, Object>> getDefaultOperationsMetrics(Exception e) {
        log.warn("Circuit breaker activated for Warehousing operations metrics. Using default values.", e);
        List<Map<String, Object>> defaultMetrics = new ArrayList<>();
        
        // Create default picking efficiency metric
        Map<String, Object> pickingEfficiencyMetric = new HashMap<>();
        pickingEfficiencyMetric.put("metricName", "picking_efficiency");
        pickingEfficiencyMetric.put("metricValue", 92.4);
        pickingEfficiencyMetric.put("metricUnit", "percent");
        pickingEfficiencyMetric.put("timestamp", LocalDateTime.now());
        
        // Create default labor efficiency metric
        Map<String, Object> laborEfficiencyMetric = new HashMap<>();
        laborEfficiencyMetric.put("metricName", "labor_efficiency");
        laborEfficiencyMetric.put("metricValue", 85.2);
        laborEfficiencyMetric.put("metricUnit", "percent");
        laborEfficiencyMetric.put("timestamp", LocalDateTime.now());
        
        defaultMetrics.add(pickingEfficiencyMetric);
        defaultMetrics.add(laborEfficiencyMetric);
        
        return defaultMetrics;
    }

    /**
     * Fetch fulfillment metrics from the Warehousing domain.
     * These metrics provide insights into order fulfillment performance.
     *
     * @return a list of fulfillment metrics
     */
    @CircuitBreaker(name = "warehousingFulfillment", fallbackMethod = "getDefaultFulfillmentMetrics")
    public List<Map<String, Object>> getFulfillmentMetrics() {
        log.info("Fetching fulfillment metrics from Warehousing domain");
        try {
            String url = fulfillmentUrl + "/api/metrics";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} fulfillment metrics from Warehousing domain", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching fulfillment metrics from Warehousing domain", e);
            throw e;
        }
    }

    /**
     * Fallback method for fulfillment metrics in case of circuit breaker activation.
     *
     * @param e the exception that triggered the fallback
     * @return a default list of metrics
     */
    public List<Map<String, Object>> getDefaultFulfillmentMetrics(Exception e) {
        log.warn("Circuit breaker activated for Warehousing fulfillment metrics. Using default values.", e);
        List<Map<String, Object>> defaultMetrics = new ArrayList<>();
        
        // Create default order accuracy metric
        Map<String, Object> orderAccuracyMetric = new HashMap<>();
        orderAccuracyMetric.put("metricName", "order_accuracy");
        orderAccuracyMetric.put("metricValue", 98.7);
        orderAccuracyMetric.put("metricUnit", "percent");
        orderAccuracyMetric.put("timestamp", LocalDateTime.now());
        
        // Create default backorder rate metric
        Map<String, Object> backorderRateMetric = new HashMap<>();
        backorderRateMetric.put("metricName", "backorder_rate");
        backorderRateMetric.put("metricValue", 1.2);
        backorderRateMetric.put("metricUnit", "percent");
        backorderRateMetric.put("timestamp", LocalDateTime.now());
        
        defaultMetrics.add(orderAccuracyMetric);
        defaultMetrics.add(backorderRateMetric);
        
        return defaultMetrics;
    }

    /**
     * Fetch all metrics from the Warehousing domain.
     * This provides a comprehensive view of the entire Warehousing operation.
     *
     * @return a consolidated map of metrics by category
     */
    public Map<String, List<Map<String, Object>>> getAllWarehousingMetrics() {
        log.info("Fetching all metrics from Warehousing domain");
        Map<String, List<Map<String, Object>>> allMetrics = new HashMap<>();
        
        try {
            // Get metrics from all categories
            List<Map<String, Object>> inventoryMetrics = getInventoryMetrics();
            List<Map<String, Object>> operationsMetrics = getOperationsMetrics();
            List<Map<String, Object>> fulfillmentMetrics = getFulfillmentMetrics();
            
            // Consolidate metrics by category
            allMetrics.put("inventory", inventoryMetrics);
            allMetrics.put("operations", operationsMetrics);
            allMetrics.put("fulfillment", fulfillmentMetrics);
            
            log.info("Successfully fetched all metrics from Warehousing domain");
        } catch (Exception e) {
            log.error("Error fetching all metrics from Warehousing domain", e);
            // Even if some metrics fail, return what we have
        }
        
        return allMetrics;
    }

    /**
     * Fetch product turnover data from Warehousing domain.
     *
     * @return map of product turnover data
     */
    @CircuitBreaker(name = "warehousingProductTurnover", fallbackMethod = "getDefaultProductTurnoverData")
    public Map<String, Map<String, Object>> getProductTurnoverData() {
        log.info("Fetching product turnover data from Warehousing");
        try {
            String url = inventoryUrl + "/product-turnover";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching product turnover data from Warehousing", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultProductTurnoverData(Exception e) {
        log.warn("Using default product turnover data due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> turnoverData = new HashMap<>();
        turnoverData.put("turnoverRate", 4.5);
        turnoverData.put("daysOfInventory", 81);
        turnoverData.put("fastMovingItems", 150);
        defaultData.put("default-product", turnoverData);
        return defaultData;
    }

    /**
     * Fetch supplier performance data from Warehousing domain.
     *
     * @return map of supplier performance data
     */
    @CircuitBreaker(name = "warehousingSupplierPerformance", fallbackMethod = "getDefaultSupplierPerformanceData")
    public Map<String, Map<String, Object>> getSupplierPerformanceData() {
        log.info("Fetching supplier performance data from Warehousing");
        try {
            String url = operationsUrl + "/supplier-performance";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching supplier performance data from Warehousing", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultSupplierPerformanceData(Exception e) {
        log.warn("Using default supplier performance data due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> performanceData = new HashMap<>();
        performanceData.put("onTimeDelivery", 92.5);
        performanceData.put("qualityScore", 88.0);
        performanceData.put("responseTime", 2.1);
        defaultData.put("default-supplier", performanceData);
        return defaultData;
    }

    /**
     * Fetch capacity utilization data from Warehousing domain.
     *
     * @return map of capacity utilization data
     */
    @CircuitBreaker(name = "warehousingCapacityUtilization", fallbackMethod = "getDefaultCapacityUtilizationData")
    public Map<String, Map<String, Object>> getCapacityUtilizationData() {
        log.info("Fetching capacity utilization data from Warehousing");
        try {
            String url = operationsUrl + "/capacity-utilization";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching capacity utilization data from Warehousing", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultCapacityUtilizationData(Exception e) {
        log.warn("Using default capacity utilization data due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> utilizationData = new HashMap<>();
        utilizationData.put("storageUtilization", 78.5);
        utilizationData.put("staffUtilization", 85.2);
        utilizationData.put("equipmentUtilization", 82.1);
        defaultData.put("warehouse-main", utilizationData);
        return defaultData;
    }

    /**
     * Fetch inventory optimization data from Warehousing domain.
     *
     * @return map of inventory optimization data
     */
    @CircuitBreaker(name = "warehousingInventoryOptimization", fallbackMethod = "getDefaultInventoryOptimizationData")
    public Map<String, Map<String, Object>> getInventoryOptimizationData() {
        log.info("Fetching inventory optimization data from Warehousing");
        try {
            String url = inventoryUrl + "/optimization";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching inventory optimization data from Warehousing", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultInventoryOptimizationData(Exception e) {
        log.warn("Using default inventory optimization data due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> optimizationData = new HashMap<>();
        optimizationData.put("stockLevel", 85.0);
        optimizationData.put("reorderPoint", 20);
        optimizationData.put("safetyStock", 15);
        defaultData.put("default-warehouse", optimizationData);
        return defaultData;
    }

    /**
     * Fetch warehouse efficiency data from Warehousing domain.
     *
     * @return map of warehouse efficiency data
     */
    @CircuitBreaker(name = "warehousingWarehouseEfficiency", fallbackMethod = "getDefaultWarehouseEfficiencyData")
    public Map<String, Map<String, Object>> getWarehouseEfficiencyData() {
        log.info("Fetching warehouse efficiency data from Warehousing");
        try {
            String url = operationsUrl + "/warehouse-efficiency";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching warehouse efficiency data from Warehousing", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultWarehouseEfficiencyData(Exception e) {
        log.warn("Using default warehouse efficiency data due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> efficiencyData = new HashMap<>();
        efficiencyData.put("throughput", 125.0);
        efficiencyData.put("accuracy", 98.5);
        efficiencyData.put("productivity", 92.0);
        defaultData.put("warehouse-main", efficiencyData);
        return defaultData;
    }

    /**
     * Fetch fulfillment performance data by region from Warehousing domain.
     *
     * @return map of fulfillment performance data by region
     */
    @CircuitBreaker(name = "warehousingFulfillmentPerformance", fallbackMethod = "getDefaultFulfillmentPerformanceByRegion")
    public Map<String, Map<String, Object>> getFulfillmentPerformanceByRegion() {
        log.info("Fetching fulfillment performance by region from Warehousing");
        try {
            String url = fulfillmentUrl + "/performance/region";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching fulfillment performance by region from Warehousing", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultFulfillmentPerformanceByRegion(Exception e) {
        log.warn("Using default fulfillment performance by region due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> performanceData = new HashMap<>();
        performanceData.put("fulfillmentRate", 96.5);
        performanceData.put("averageFulfillmentTime", 4.2);
        performanceData.put("accuracyRate", 99.1);
        defaultData.put("US-EAST", performanceData);
        return defaultData;
    }

    /**
     * Get Warehousing metrics - simplified method for backward compatibility
     * @return consolidated list of all metrics
     */
    public List<Map<String, Object>> getWarehousingMetrics() {
        log.info("Fetching warehousing metrics");
        List<Map<String, Object>> allMetrics = new ArrayList<>();
        
        // Aggregate all metrics into a single list
        Map<String, List<Map<String, Object>>> categorizedMetrics = getAllWarehousingMetrics();
        categorizedMetrics.values().forEach(allMetrics::addAll);
        
        return allMetrics;
    }

    /**
     * Get service status for health checks
     * @return status map
     */
    public Map<String, Object> getServiceStatus() {
        log.info("Fetching service status for Warehousing");
        Map<String, Object> status = new HashMap<>();
        status.put("service", "warehousing");
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now());
        
        try {
            // Try to fetch a simple metric to verify connectivity
            getInventoryMetrics();
            status.put("health", "HEALTHY");
        } catch (Exception e) {
            status.put("health", "DEGRADED");
            status.put("error", e.getMessage());
        }
        
        return status;
    }
}