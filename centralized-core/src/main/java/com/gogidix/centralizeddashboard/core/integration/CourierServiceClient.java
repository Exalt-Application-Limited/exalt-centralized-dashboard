package com.gogidix.centralizeddashboard.core.integration;

import com.gogidix.centralizeddashboard.core.dto.DashboardMetricDto;
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
 * Client for integrating with the Courier Services domain.
 * Handles communication with all levels of the Courier Services hierarchy:
 * 1. HQ Admin Dashboard (Global Level)
 * 2. Regional Admin Dashboard (Country/Region Level)
 * 3. Local Courier Management (Local Office Level)
 * 4. Field Staff (Drivers/Riders)
 */
@Component
@Slf4j
public class CourierServiceClient {

    private final RestTemplate restTemplate;
    
    @Value("${service.courier.url}")
    private String courierServiceBaseUrl;
    
    @Value("${service.courier.hq-admin.url:${service.courier.url}/hq-admin}")
    private String hqAdminUrl;
    
    @Value("${service.courier.regional-admin.url:${service.courier.url}/regional-admin}")
    private String regionalAdminUrl;
    
    @Value("${service.courier.local-management.url:${service.courier.url}/local-management}")
    private String localManagementUrl;
    
    @Value("${service.courier.field-staff.url:${service.courier.url}/field-staff}")
    private String fieldStaffUrl;

    public CourierServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch global performance metrics from the HQ Admin Dashboard.
     * These metrics provide an overview of the entire courier services operation.
     *
     * @return a list of metrics from the HQ Admin Dashboard
     */
    @CircuitBreaker(name = "courierHqAdmin", fallbackMethod = "getDefaultHqAdminMetrics")
    public List<Map<String, Object>> getHqAdminMetrics() {
        log.info("Fetching metrics from Courier HQ Admin");
        try {
            String url = hqAdminUrl + "/api/reports/metrics";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} metrics from Courier HQ Admin", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching metrics from Courier HQ Admin", e);
            throw e;
        }
    }

    /**
     * Fallback method for HQ Admin metrics in case of circuit breaker activation.
     *
     * @param e the exception that triggered the fallback
     * @return a default list of metrics
     */
    public List<Map<String, Object>> getDefaultHqAdminMetrics(Exception e) {
        log.warn("Circuit breaker activated for Courier HQ Admin metrics. Using default values.", e);
        List<Map<String, Object>> defaultMetrics = new ArrayList<>();
        
        // Create default global delivery success rate metric
        Map<String, Object> deliverySuccessMetric = new HashMap<>();
        deliverySuccessMetric.put("metricName", "global_delivery_success_rate");
        deliverySuccessMetric.put("metricValue", 97.0);
        deliverySuccessMetric.put("metricUnit", "percent");
        deliverySuccessMetric.put("timestamp", LocalDateTime.now());
        
        // Create default global average delivery time metric
        Map<String, Object> deliveryTimeMetric = new HashMap<>();
        deliveryTimeMetric.put("metricName", "global_average_delivery_time");
        deliveryTimeMetric.put("metricValue", 28.5);
        deliveryTimeMetric.put("metricUnit", "hours");
        deliveryTimeMetric.put("timestamp", LocalDateTime.now());
        
        defaultMetrics.add(deliverySuccessMetric);
        defaultMetrics.add(deliveryTimeMetric);
        
        return defaultMetrics;
    }

    /**
     * Fetch regional performance metrics from the Regional Admin Dashboard.
     * These metrics provide insights at the regional level across different geographical areas.
     *
     * @param region the region to fetch metrics for, or null for all regions
     * @return a list of metrics from the Regional Admin Dashboard
     */
    @CircuitBreaker(name = "courierRegionalAdmin", fallbackMethod = "getDefaultRegionalAdminMetrics")
    public List<Map<String, Object>> getRegionalAdminMetrics(String region) {
        log.info("Fetching metrics from Courier Regional Admin for region: {}", region != null ? region : "all");
        try {
            String url = regionalAdminUrl + "/api/reports/metrics";
            if (region != null && !region.isEmpty()) {
                url += "?region=" + region;
            }
            
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} metrics from Courier Regional Admin", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching metrics from Courier Regional Admin", e);
            throw e;
        }
    }

    /**
     * Fallback method for Regional Admin metrics in case of circuit breaker activation.
     *
     * @param region the region parameter from the original method
     * @param e the exception that triggered the fallback
     * @return a default list of metrics
     */
    public List<Map<String, Object>> getDefaultRegionalAdminMetrics(String region, Exception e) {
        log.warn("Circuit breaker activated for Courier Regional Admin metrics. Using default values.", e);
        List<Map<String, Object>> defaultMetrics = new ArrayList<>();
        
        // Create default regional metrics
        String regionValue = (region != null && !region.isEmpty()) ? region : "Default Region";
        
        // Create default regional delivery success rate metric
        Map<String, Object> regionalSuccessMetric = new HashMap<>();
        regionalSuccessMetric.put("metricName", "regional_delivery_success_rate");
        regionalSuccessMetric.put("metricValue", 95.0);
        regionalSuccessMetric.put("metricUnit", "percent");
        regionalSuccessMetric.put("region", regionValue);
        regionalSuccessMetric.put("timestamp", LocalDateTime.now());
        
        // Create default regional delivery time metric
        Map<String, Object> regionalTimeMetric = new HashMap<>();
        regionalTimeMetric.put("metricName", "regional_average_delivery_time");
        regionalTimeMetric.put("metricValue", 30.0);
        regionalTimeMetric.put("metricUnit", "hours");
        regionalTimeMetric.put("region", regionValue);
        regionalTimeMetric.put("timestamp", LocalDateTime.now());
        
        defaultMetrics.add(regionalSuccessMetric);
        defaultMetrics.add(regionalTimeMetric);
        
        return defaultMetrics;
    }

    /**
     * Fetch local office metrics from the Local Courier Management system.
     * These metrics provide detailed insights at the local office level.
     *
     * @param officeId the ID of the local office, or null for all offices
     * @return a list of metrics from the Local Courier Management
     */
    @CircuitBreaker(name = "courierLocalManagement", fallbackMethod = "getDefaultLocalManagementMetrics")
    public List<Map<String, Object>> getLocalManagementMetrics(String officeId) {
        log.info("Fetching metrics from Local Courier Management for office: {}", officeId != null ? officeId : "all");
        try {
            String url = localManagementUrl + "/api/reports/metrics";
            if (officeId != null && !officeId.isEmpty()) {
                url += "?officeId=" + officeId;
            }
            
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} metrics from Local Courier Management", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching metrics from Local Courier Management", e);
            throw e;
        }
    }

    /**
     * Fallback method for Local Management metrics in case of circuit breaker activation.
     *
     * @param officeId the officeId parameter from the original method
     * @param e the exception that triggered the fallback
     * @return a default list of metrics
     */
    public List<Map<String, Object>> getDefaultLocalManagementMetrics(String officeId, Exception e) {
        log.warn("Circuit breaker activated for Local Courier Management metrics. Using default values.", e);
        List<Map<String, Object>> defaultMetrics = new ArrayList<>();
        
        // Create default local office metrics
        String office = (officeId != null && !officeId.isEmpty()) ? officeId : "Default Office";
        
        // Create default local delivery volume metric
        Map<String, Object> localVolumeMetric = new HashMap<>();
        localVolumeMetric.put("metricName", "local_delivery_volume");
        localVolumeMetric.put("metricValue", 150.0);
        localVolumeMetric.put("metricUnit", "shipments");
        localVolumeMetric.put("office", office);
        localVolumeMetric.put("timestamp", LocalDateTime.now());
        
        // Create default local on-time delivery metric
        Map<String, Object> localOnTimeMetric = new HashMap<>();
        localOnTimeMetric.put("metricName", "local_on_time_delivery");
        localOnTimeMetric.put("metricValue", 92.0);
        localOnTimeMetric.put("metricUnit", "percent");
        localOnTimeMetric.put("office", office);
        localOnTimeMetric.put("timestamp", LocalDateTime.now());
        
        defaultMetrics.add(localVolumeMetric);
        defaultMetrics.add(localOnTimeMetric);
        
        return defaultMetrics;
    }

    /**
     * Fetch field staff metrics from the Field Staff system.
     * These metrics provide insights into driver/rider performance.
     *
     * @return a list of metrics from the Field Staff system
     */
    @CircuitBreaker(name = "courierFieldStaff", fallbackMethod = "getDefaultFieldStaffMetrics")
    public List<Map<String, Object>> getFieldStaffMetrics() {
        log.info("Fetching metrics from Courier Field Staff");
        try {
            String url = fieldStaffUrl + "/api/reports/metrics";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} metrics from Courier Field Staff", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching metrics from Courier Field Staff", e);
            throw e;
        }
    }

    /**
     * Fallback method for Field Staff metrics in case of circuit breaker activation.
     *
     * @param e the exception that triggered the fallback
     * @return a default list of metrics
     */
    public List<Map<String, Object>> getDefaultFieldStaffMetrics(Exception e) {
        log.warn("Circuit breaker activated for Courier Field Staff metrics. Using default values.", e);
        List<Map<String, Object>> defaultMetrics = new ArrayList<>();
        
        // Create default driver efficiency metric
        Map<String, Object> driverEfficiencyMetric = new HashMap<>();
        driverEfficiencyMetric.put("metricName", "driver_efficiency");
        driverEfficiencyMetric.put("metricValue", 88.5);
        driverEfficiencyMetric.put("metricUnit", "percent");
        driverEfficiencyMetric.put("timestamp", LocalDateTime.now());
        
        // Create default average deliveries per driver metric
        Map<String, Object> deliveriesPerDriverMetric = new HashMap<>();
        deliveriesPerDriverMetric.put("metricName", "average_deliveries_per_driver");
        deliveriesPerDriverMetric.put("metricValue", 15.7);
        deliveriesPerDriverMetric.put("metricUnit", "count");
        deliveriesPerDriverMetric.put("timestamp", LocalDateTime.now());
        
        defaultMetrics.add(driverEfficiencyMetric);
        defaultMetrics.add(deliveriesPerDriverMetric);
        
        return defaultMetrics;
    }

    /**
     * Fetch all metrics from the Courier Services domain across all hierarchical levels.
     * This provides a comprehensive view of the entire Courier Services operation.
     *
     * @return a consolidated map of metrics by hierarchy level
     */
    public Map<String, List<Map<String, Object>>> getAllCourierMetrics() {
        log.info("Fetching all metrics from Courier Services domain");
        Map<String, List<Map<String, Object>>> allMetrics = new HashMap<>();
        
        try {
            // Get metrics from all levels of the hierarchy
            List<Map<String, Object>> hqMetrics = getHqAdminMetrics();
            List<Map<String, Object>> regionalMetrics = getRegionalAdminMetrics(null);
            List<Map<String, Object>> localMetrics = getLocalManagementMetrics(null);
            List<Map<String, Object>> fieldMetrics = getFieldStaffMetrics();
            
            // Consolidate metrics by hierarchy level
            allMetrics.put("hqAdmin", hqMetrics);
            allMetrics.put("regionalAdmin", regionalMetrics);
            allMetrics.put("localManagement", localMetrics);
            allMetrics.put("fieldStaff", fieldMetrics);
            
            log.info("Successfully fetched all metrics from Courier Services domain");
        } catch (Exception e) {
            log.error("Error fetching all metrics from Courier Services domain", e);
            // Even if some metrics fail, return what we have
        }
        
        return allMetrics;
    }

    /**
     * Fetch delivery performance data by region from Courier Services domain.
     *
     * @return map of delivery performance data by region
     */
    @CircuitBreaker(name = "courierDeliveryPerformance", fallbackMethod = "getDefaultDeliveryPerformanceByRegion")
    public Map<String, Map<String, Object>> getDeliveryPerformanceByRegion() {
        log.info("Fetching delivery performance by region from Courier Services");
        try {
            String url = hqAdminUrl + "/api/performance/delivery/region";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching delivery performance by region from Courier Services", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultDeliveryPerformanceByRegion(Exception e) {
        log.warn("Using default delivery performance by region due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> performanceData = new HashMap<>();
        performanceData.put("onTimeDeliveryRate", 92.5);
        performanceData.put("averageDeliveryTime", 2.3);
        performanceData.put("firstAttemptSuccessRate", 88.0);
        defaultData.put("US-EAST", performanceData);
        return defaultData;
    }

    /**
     * Fetch route optimization data from Courier Services domain.
     *
     * @return map of route optimization data
     */
    @CircuitBreaker(name = "courierRouteOptimization", fallbackMethod = "getDefaultRouteOptimizationData")
    public Map<String, Map<String, Object>> getRouteOptimizationData() {
        log.info("Fetching route optimization data from Courier Services");
        try {
            String url = hqAdminUrl + "/api/optimization/routes";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching route optimization data from Courier Services", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultRouteOptimizationData(Exception e) {
        log.warn("Using default route optimization data due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> routeData = new HashMap<>();
        routeData.put("routeEfficiency", 85.2);
        routeData.put("fuelEfficiency", 28.5);
        routeData.put("averageTripDistance", 12.8);
        defaultData.put("route-001", routeData);
        return defaultData;
    }

    /**
     * Fetch courier efficiency data from Courier Services domain.
     *
     * @return map of courier efficiency data
     */
    @CircuitBreaker(name = "courierEfficiency", fallbackMethod = "getDefaultCourierEfficiencyData")
    public Map<String, Map<String, Object>> getCourierEfficiencyData() {
        log.info("Fetching courier efficiency data from Courier Services");
        try {
            String url = fieldStaffUrl + "/api/efficiency/couriers";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching courier efficiency data from Courier Services", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultCourierEfficiencyData(Exception e) {
        log.warn("Using default courier efficiency data due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> efficiencyData = new HashMap<>();
        efficiencyData.put("deliveriesPerHour", 6.2);
        efficiencyData.put("timePerDelivery", 9.7);
        efficiencyData.put("idleTime", 15.3);
        defaultData.put("courier-001", efficiencyData);
        return defaultData;
    }

    /**
     * Fetch customer satisfaction data from Courier Services domain.
     *
     * @return map of customer satisfaction data
     */
    @CircuitBreaker(name = "courierCustomerSatisfaction", fallbackMethod = "getDefaultCustomerSatisfactionData")
    public Map<String, Map<String, Object>> getCustomerSatisfactionData() {
        log.info("Fetching customer satisfaction data from Courier Services");
        try {
            String url = hqAdminUrl + "/api/satisfaction/customers";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching customer satisfaction data from Courier Services", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultCustomerSatisfactionData(Exception e) {
        log.warn("Using default customer satisfaction data due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> satisfactionData = new HashMap<>();
        satisfactionData.put("overallSatisfactionScore", 4.2);
        satisfactionData.put("deliveryTimeSatisfaction", 4.1);
        satisfactionData.put("courierProfessionalismScore", 4.3);
        defaultData.put("region-001", satisfactionData);
        return defaultData;
    }

    /**
     * Fetch delivery cost analysis data from Courier Services domain.
     *
     * @return map of delivery cost analysis data
     */
    @CircuitBreaker(name = "courierDeliveryCostAnalysis", fallbackMethod = "getDefaultDeliveryCostAnalysisData")
    public Map<String, Map<String, Object>> getDeliveryCostAnalysisData() {
        log.info("Fetching delivery cost analysis data from Courier Services");
        try {
            String url = hqAdminUrl + "/api/cost-analysis/delivery";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching delivery cost analysis data from Courier Services", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultDeliveryCostAnalysisData(Exception e) {
        log.warn("Using default delivery cost analysis data due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> costData = new HashMap<>();
        costData.put("costPerDelivery", 8.75);
        costData.put("fuelCosts", 25.0);
        costData.put("laborCosts", 55.0);
        defaultData.put("region-001", costData);
        return defaultData;
    }

    /**
     * Fetch sustainability data from Courier Services domain.
     *
     * @return map of sustainability data
     */
    @CircuitBreaker(name = "courierSustainability", fallbackMethod = "getDefaultSustainabilityData")
    public Map<String, Map<String, Object>> getSustainabilityData() {
        log.info("Fetching sustainability data from Courier Services");
        try {
            String url = hqAdminUrl + "/api/sustainability/metrics";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching sustainability data from Courier Services", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultSustainabilityData(Exception e) {
        log.warn("Using default sustainability data due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> sustainabilityData = new HashMap<>();
        sustainabilityData.put("carbonFootprint", 125.8);
        sustainabilityData.put("evPercentage", 15.0);
        sustainabilityData.put("fuelEfficiency", 28.5);
        defaultData.put("fleet-001", sustainabilityData);
        return defaultData;
    }

    /**
     * Get service status for health checks
     * @return status map
     */
    public Map<String, Object> getServiceStatus() {
        log.info("Fetching service status for Courier Services");
        Map<String, Object> status = new HashMap<>();
        status.put("service", "courier-services");
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now());
        
        try {
            // Try to fetch a simple metric to verify connectivity
            getHqAdminMetrics();
            status.put("health", "HEALTHY");
        } catch (Exception e) {
            status.put("health", "DEGRADED");
            status.put("error", e.getMessage());
        }
        
        return status;
    }
}