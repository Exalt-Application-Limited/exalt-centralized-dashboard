package com.exalt.centralizeddashboard.core.integration;

import com.exalt.centralizeddashboard.core.model.DashboardMetric;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for cross-domain integration.
 * Coordinates communication with all domain clients and
 * transforms domain-specific data into a unified format for the dashboard.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CrossDomainIntegrationService {

    private final CourierServiceClient courierServiceClient;
    private final SocialCommerceClient socialCommerceClient;
    private final WarehousingClient warehousingClient;

    /**
     * Fetch metrics from all domains and transform them into a unified format.
     *
     * @return a list of dashboard metrics from all domains
     */
    public List<DashboardMetric> fetchAllDomainMetrics() {
        log.info("Fetching metrics from all domains");
        List<DashboardMetric> unifiedMetrics = new ArrayList<>();
        
        try {
            // Fetch Courier Services metrics
            unifiedMetrics.addAll(fetchCourierServicesMetrics());
            
            // Fetch Social Commerce metrics
            unifiedMetrics.addAll(fetchSocialCommerceMetrics());
            
            // Fetch Warehousing metrics
            unifiedMetrics.addAll(fetchWarehousingMetrics());
            
            log.info("Successfully fetched and transformed metrics from all domains. Total metrics: {}", unifiedMetrics.size());
        } catch (Exception e) {
            log.error("Error fetching metrics from all domains", e);
        }
        
        return unifiedMetrics;
    }

    /**
     * Fetch metrics from the Courier Services domain and transform them into dashboard metrics.
     *
     * @return a list of dashboard metrics from the Courier Services domain
     */
    public List<DashboardMetric> fetchCourierServicesMetrics() {
        log.info("Fetching and transforming Courier Services metrics");
        List<DashboardMetric> courierMetrics = new ArrayList<>();
        
        try {
            Map<String, List<Map<String, Object>>> courierData = courierServiceClient.getAllCourierMetrics();
            
            // Transform HQ Admin metrics
            List<Map<String, Object>> hqMetrics = courierData.getOrDefault("hqAdmin", new ArrayList<>());
            for (Map<String, Object> metric : hqMetrics) {
                courierMetrics.add(transformCourierMetric(metric, "HQ Admin"));
            }
            
            // Transform Regional Admin metrics
            List<Map<String, Object>> regionalMetrics = courierData.getOrDefault("regionalAdmin", new ArrayList<>());
            for (Map<String, Object> metric : regionalMetrics) {
                courierMetrics.add(transformCourierMetric(metric, "Regional Admin"));
            }
            
            // Transform Local Management metrics
            List<Map<String, Object>> localMetrics = courierData.getOrDefault("localManagement", new ArrayList<>());
            for (Map<String, Object> metric : localMetrics) {
                courierMetrics.add(transformCourierMetric(metric, "Local Courier Management"));
            }
            
            // Transform Field Staff metrics
            List<Map<String, Object>> fieldMetrics = courierData.getOrDefault("fieldStaff", new ArrayList<>());
            for (Map<String, Object> metric : fieldMetrics) {
                courierMetrics.add(transformCourierMetric(metric, "Field Staff"));
            }
            
            log.info("Successfully transformed {} Courier Services metrics", courierMetrics.size());
        } catch (Exception e) {
            log.error("Error fetching and transforming Courier Services metrics", e);
        }
        
        return courierMetrics;
    }

    /**
     * Fetch metrics from the Social Commerce domain and transform them into dashboard metrics.
     *
     * @return a list of dashboard metrics from the Social Commerce domain
     */
    public List<DashboardMetric> fetchSocialCommerceMetrics() {
        log.info("Fetching and transforming Social Commerce metrics");
        List<DashboardMetric> socialCommerceMetrics = new ArrayList<>();
        
        try {
            Map<String, List<Map<String, Object>>> socialCommerceData = socialCommerceClient.getAllSocialCommerceMetrics();
            
            // Transform Analytics metrics
            List<Map<String, Object>> analyticsMetrics = socialCommerceData.getOrDefault("analytics", new ArrayList<>());
            for (Map<String, Object> metric : analyticsMetrics) {
                socialCommerceMetrics.add(transformSocialCommerceMetric(metric, "Analytics"));
            }
            
            // Transform Engagement metrics
            List<Map<String, Object>> engagementMetrics = socialCommerceData.getOrDefault("engagement", new ArrayList<>());
            for (Map<String, Object> metric : engagementMetrics) {
                socialCommerceMetrics.add(transformSocialCommerceMetric(metric, "Engagement"));
            }
            
            // Transform Sales metrics
            List<Map<String, Object>> salesMetrics = socialCommerceData.getOrDefault("sales", new ArrayList<>());
            for (Map<String, Object> metric : salesMetrics) {
                socialCommerceMetrics.add(transformSocialCommerceMetric(metric, "Sales"));
            }
            
            log.info("Successfully transformed {} Social Commerce metrics", socialCommerceMetrics.size());
        } catch (Exception e) {
            log.error("Error fetching and transforming Social Commerce metrics", e);
        }
        
        return socialCommerceMetrics;
    }

    /**
     * Fetch metrics from the Warehousing domain and transform them into dashboard metrics.
     *
     * @return a list of dashboard metrics from the Warehousing domain
     */
    public List<DashboardMetric> fetchWarehousingMetrics() {
        log.info("Fetching and transforming Warehousing metrics");
        List<DashboardMetric> warehousingMetrics = new ArrayList<>();
        
        try {
            Map<String, List<Map<String, Object>>> warehousingData = warehousingClient.getAllWarehousingMetrics();
            
            // Transform Inventory metrics
            List<Map<String, Object>> inventoryMetrics = warehousingData.getOrDefault("inventory", new ArrayList<>());
            for (Map<String, Object> metric : inventoryMetrics) {
                warehousingMetrics.add(transformWarehousingMetric(metric, "Inventory"));
            }
            
            // Transform Operations metrics
            List<Map<String, Object>> operationsMetrics = warehousingData.getOrDefault("operations", new ArrayList<>());
            for (Map<String, Object> metric : operationsMetrics) {
                warehousingMetrics.add(transformWarehousingMetric(metric, "Operations"));
            }
            
            // Transform Fulfillment metrics
            List<Map<String, Object>> fulfillmentMetrics = warehousingData.getOrDefault("fulfillment", new ArrayList<>());
            for (Map<String, Object> metric : fulfillmentMetrics) {
                warehousingMetrics.add(transformWarehousingMetric(metric, "Fulfillment"));
            }
            
            log.info("Successfully transformed {} Warehousing metrics", warehousingMetrics.size());
        } catch (Exception e) {
            log.error("Error fetching and transforming Warehousing metrics", e);
        }
        
        return warehousingMetrics;
    }

    /**
     * Transform a courier metric map into a dashboard metric entity.
     *
     * @param metricMap the source metric map
     * @param service the source service within the domain
     * @return a dashboard metric entity
     */
    private DashboardMetric transformCourierMetric(Map<String, Object> metricMap, String service) {
        String metricName = (String) metricMap.getOrDefault("metricName", "unknown_metric");
        Double metricValue = convertToDouble(metricMap.get("metricValue"));
        String metricUnit = (String) metricMap.getOrDefault("metricUnit", null);
        String region = (String) metricMap.getOrDefault("region", null);
        LocalDateTime timestamp = extractTimestamp(metricMap.get("timestamp"));
        
        return DashboardMetric.builder()
                .metricName(metricName)
                .metricValue(metricValue)
                .metricUnit(metricUnit)
                .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                .sourceService(service)
                .region(region)
                .timestamp(timestamp)
                .dataPointType(DashboardMetric.DataPointType.INSTANT)
                .build();
    }

    /**
     * Transform a social commerce metric map into a dashboard metric entity.
     *
     * @param metricMap the source metric map
     * @param service the source service within the domain
     * @return a dashboard metric entity
     */
    private DashboardMetric transformSocialCommerceMetric(Map<String, Object> metricMap, String service) {
        String metricName = (String) metricMap.getOrDefault("metricName", "unknown_metric");
        Double metricValue = convertToDouble(metricMap.get("metricValue"));
        String metricUnit = (String) metricMap.getOrDefault("metricUnit", null);
        LocalDateTime timestamp = extractTimestamp(metricMap.get("timestamp"));
        
        return DashboardMetric.builder()
                .metricName(metricName)
                .metricValue(metricValue)
                .metricUnit(metricUnit)
                .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                .sourceService(service)
                .timestamp(timestamp)
                .dataPointType(DashboardMetric.DataPointType.INSTANT)
                .build();
    }

    /**
     * Transform a warehousing metric map into a dashboard metric entity.
     *
     * @param metricMap the source metric map
     * @param service the source service within the domain
     * @return a dashboard metric entity
     */
    private DashboardMetric transformWarehousingMetric(Map<String, Object> metricMap, String service) {
        String metricName = (String) metricMap.getOrDefault("metricName", "unknown_metric");
        Double metricValue = convertToDouble(metricMap.get("metricValue"));
        String metricUnit = (String) metricMap.getOrDefault("metricUnit", null);
        String warehouse = (String) metricMap.getOrDefault("warehouse", null);
        LocalDateTime timestamp = extractTimestamp(metricMap.get("timestamp"));
        
        return DashboardMetric.builder()
                .metricName(metricName)
                .metricValue(metricValue)
                .metricUnit(metricUnit)
                .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                .sourceService(service)
                .region(warehouse)  // Use warehouse as region for consistency
                .timestamp(timestamp)
                .dataPointType(DashboardMetric.DataPointType.INSTANT)
                .build();
    }

    /**
     * Convert an object to a Double value.
     *
     * @param value the value to convert
     * @return the Double value, or 0.0 if conversion fails
     */
    private Double convertToDouble(Object value) {
        if (value == null) {
            return 0.0;
        }
        
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        
        try {
            return Double.parseDouble(value.toString());
        } catch (Exception e) {
            log.warn("Failed to convert '{}' to Double", value);
            return 0.0;
        }
    }

    /**
     * Extract a timestamp from an object.
     *
     * @param value the value to extract timestamp from
     * @return the extracted timestamp, or current time if extraction fails
     */
    private LocalDateTime extractTimestamp(Object value) {
        if (value == null) {
            return LocalDateTime.now();
        }
        
        if (value instanceof LocalDateTime) {
            return (LocalDateTime) value;
        }
        
        if (value instanceof String) {
            try {
                return LocalDateTime.parse((String) value);
            } catch (Exception e) {
                log.warn("Failed to parse '{}' as LocalDateTime", value);
            }
        }
        
        return LocalDateTime.now();
    }

    /**
     * Scheduled task to refresh cross-domain metrics.
     * By default, runs every 30 minutes.
     */
    @Scheduled(cron = "0 */30 * * * *")
    public void scheduledMetricsRefresh() {
        log.info("Running scheduled cross-domain metrics refresh");
        fetchAllDomainMetrics();
    }

    /**
     * Get domain status information for monitoring.
     *
     * @return a map containing status information for each domain
     */
    public Map<String, String> getDomainStatus() {
        log.info("Checking domain integration status");
        Map<String, String> statusMap = new HashMap<>();
        
        try {
            // Check Courier Services domain
            courierServiceClient.getHqAdminMetrics();
            statusMap.put("courierServices", "UP");
        } catch (Exception e) {
            log.warn("Courier Services domain appears to be DOWN", e);
            statusMap.put("courierServices", "DOWN");
        }
        
        try {
            // Check Social Commerce domain
            socialCommerceClient.getAnalyticsMetrics();
            statusMap.put("socialCommerce", "UP");
        } catch (Exception e) {
            log.warn("Social Commerce domain appears to be DOWN", e);
            statusMap.put("socialCommerce", "DOWN");
        }
        
        try {
            // Check Warehousing domain
            warehousingClient.getInventoryMetrics();
            statusMap.put("warehousing", "UP");
        } catch (Exception e) {
            log.warn("Warehousing domain appears to be DOWN", e);
            statusMap.put("warehousing", "DOWN");
        }
        
        return statusMap;
    }
}