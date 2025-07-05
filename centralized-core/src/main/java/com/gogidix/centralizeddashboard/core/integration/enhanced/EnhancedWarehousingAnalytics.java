package com.gogidix.centralizeddashboard.core.integration.enhanced;

import com.gogidix.centralizeddashboard.core.integration.WarehousingClient;
import com.gogidix.centralizeddashboard.core.model.DashboardMetric;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Enhanced Warehousing Analytics
 * Provides deeper metric collection and analysis for the Warehousing domain
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EnhancedWarehousingAnalytics {

    private final WarehousingClient warehousingClient;

    /**
     * Get enhanced metrics from Warehousing domain with deeper insights
     *
     * @return List of enhanced Warehousing metrics
     */
    public List<DashboardMetric> getEnhancedWarehousingMetrics() {
        log.info("Collecting enhanced Warehousing metrics");
        List<DashboardMetric> enhancedMetrics = new ArrayList<>();
        
        try {
            // Get standard metrics as a foundation
            Map<String, List<Map<String, Object>>> standardMetrics = warehousingClient.getAllWarehousingMetrics();
            
            // Add inventory optimization metrics
            enhancedMetrics.addAll(getInventoryOptimizationMetrics());
            
            // Add warehouse efficiency metrics
            enhancedMetrics.addAll(getWarehouseEfficiencyMetrics());
            
            // Add fulfillment performance metrics
            enhancedMetrics.addAll(getFulfillmentPerformanceMetrics());
            
            // Add product turnover metrics
            enhancedMetrics.addAll(getProductTurnoverMetrics());
            
            // Add supplier performance metrics
            enhancedMetrics.addAll(getSupplierPerformanceMetrics());
            
            // Add warehouse capacity utilization metrics
            enhancedMetrics.addAll(getCapacityUtilizationMetrics());
            
            log.info("Successfully collected {} enhanced Warehousing metrics", enhancedMetrics.size());
        } catch (Exception e) {
            log.error("Error collecting enhanced Warehousing metrics", e);
        }
        
        return enhancedMetrics;
    }
    
    /**
     * Get inventory optimization metrics for improved stock management
     *
     * @return List of inventory optimization metrics
     */
    private List<DashboardMetric> getInventoryOptimizationMetrics() {
        log.info("Collecting inventory optimization metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get inventory optimization data
            Map<String, Map<String, Object>> inventoryDataMap = warehousingClient.getInventoryOptimizationData();
            
            for (Map.Entry<String, Map<String, Object>> entry : inventoryDataMap.entrySet()) {
                String productId = entry.getKey();
                Map<String, Object> productData = entry.getValue();
                Double inventoryLevel = convertToDouble(productData.get("inventoryLevel"));
                Double safetyStock = convertToDouble(productData.get("safetyStock"));
                Double reorderPoint = convertToDouble(productData.get("reorderPoint"));
                Double leadTime = convertToDouble(productData.get("leadTime"));
                Double demandVariability = convertToDouble(productData.get("demandVariability"));
                String warehouseId = (String) productData.getOrDefault("warehouseId", "unknown");
                String region = (String) productData.getOrDefault("region", null);
                
                // Add inventory level metric
                metrics.add(DashboardMetric.builder()
                        .metricName("inventory_level_" + productId)
                        .metricValue(inventoryLevel)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Inventory Optimization")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add safety stock metric
                metrics.add(DashboardMetric.builder()
                        .metricName("safety_stock_" + productId)
                        .metricValue(safetyStock)
                        .metricUnit("units")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Inventory Optimization")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add reorder point metric
                metrics.add(DashboardMetric.builder()
                        .metricName("reorder_point_" + productId)
                        .metricValue(reorderPoint)
                        .metricUnit("units")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Inventory Optimization")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add lead time metric
                metrics.add(DashboardMetric.builder()
                        .metricName("lead_time_" + productId)
                        .metricValue(leadTime)
                        .metricUnit("days")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Inventory Optimization")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add demand variability metric
                metrics.add(DashboardMetric.builder()
                        .metricName("demand_variability_" + productId)
                        .metricValue(demandVariability)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Inventory Optimization")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} inventory optimization metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting inventory optimization metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get warehouse efficiency metrics for operational performance
     *
     * @return List of warehouse efficiency metrics
     */
    private List<DashboardMetric> getWarehouseEfficiencyMetrics() {
        log.info("Collecting warehouse efficiency metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get warehouse efficiency data
            Map<String, Map<String, Object>> warehouseData = warehousingClient.getWarehouseEfficiencyData();
            
            for (Map.Entry<String, Map<String, Object>> entry : warehouseData.entrySet()) {
                String warehouseId = entry.getKey();
                Map<String, Object> efficiency = entry.getValue();
                
                Double pickingAccuracy = convertToDouble(efficiency.get("pickingAccuracy"));
                Double pickingTime = convertToDouble(efficiency.get("pickingTime"));
                Double packingTime = convertToDouble(efficiency.get("packingTime"));
                Double laborUtilization = convertToDouble(efficiency.get("laborUtilization"));
                Double throughputRate = convertToDouble(efficiency.get("throughputRate"));
                String region = (String) efficiency.getOrDefault("region", null);
                
                // Add picking accuracy metric
                metrics.add(DashboardMetric.builder()
                        .metricName("picking_accuracy_" + warehouseId)
                        .metricValue(pickingAccuracy)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Warehouse Efficiency")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add picking time metric
                metrics.add(DashboardMetric.builder()
                        .metricName("picking_time_" + warehouseId)
                        .metricValue(pickingTime)
                        .metricUnit("minutes")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Warehouse Efficiency")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add packing time metric
                metrics.add(DashboardMetric.builder()
                        .metricName("packing_time_" + warehouseId)
                        .metricValue(packingTime)
                        .metricUnit("minutes")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Warehouse Efficiency")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add labor utilization metric
                metrics.add(DashboardMetric.builder()
                        .metricName("labor_utilization_" + warehouseId)
                        .metricValue(laborUtilization)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Warehouse Efficiency")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add throughput rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("throughput_rate_" + warehouseId)
                        .metricValue(throughputRate)
                        .metricUnit("orders_per_hour")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Warehouse Efficiency")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} warehouse efficiency metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting warehouse efficiency metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get fulfillment performance metrics for order processing
     *
     * @return List of fulfillment performance metrics
     */
    private List<DashboardMetric> getFulfillmentPerformanceMetrics() {
        log.info("Collecting fulfillment performance metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get fulfillment performance data by region
            Map<String, Map<String, Object>> fulfillmentData = warehousingClient.getFulfillmentPerformanceByRegion();
            
            for (Map.Entry<String, Map<String, Object>> entry : fulfillmentData.entrySet()) {
                String region = entry.getKey();
                Map<String, Object> performance = entry.getValue();
                
                Double orderAccuracy = convertToDouble(performance.get("orderAccuracy"));
                Double orderFulfillmentRate = convertToDouble(performance.get("orderFulfillmentRate"));
                Double perfectOrderRate = convertToDouble(performance.get("perfectOrderRate"));
                Double backorderRate = convertToDouble(performance.get("backorderRate"));
                Double fulfillmentTime = convertToDouble(performance.get("fulfillmentTime"));
                
                // Add order accuracy metric
                metrics.add(DashboardMetric.builder()
                        .metricName("order_accuracy_" + region)
                        .metricValue(orderAccuracy)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Fulfillment Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add order fulfillment rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("order_fulfillment_rate_" + region)
                        .metricValue(orderFulfillmentRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Fulfillment Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add perfect order rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("perfect_order_rate_" + region)
                        .metricValue(perfectOrderRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Fulfillment Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add backorder rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("backorder_rate_" + region)
                        .metricValue(backorderRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Fulfillment Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add fulfillment time metric
                metrics.add(DashboardMetric.builder()
                        .metricName("fulfillment_time_" + region)
                        .metricValue(fulfillmentTime)
                        .metricUnit("hours")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Fulfillment Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} fulfillment performance metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting fulfillment performance metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get product turnover metrics for inventory movement
     *
     * @return List of product turnover metrics
     */
    private List<DashboardMetric> getProductTurnoverMetrics() {
        log.info("Collecting product turnover metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get product turnover data
            Map<String, Map<String, Object>> turnoverDataMap = warehousingClient.getProductTurnoverData();
            
            for (Map.Entry<String, Map<String, Object>> entry : turnoverDataMap.entrySet()) {
                String productId = entry.getKey();
                Map<String, Object> productData = entry.getValue();
                Double turnoverRate = convertToDouble(productData.get("turnoverRate"));
                Double daysOnHand = convertToDouble(productData.get("daysOnHand"));
                Double obsolescenceRisk = convertToDouble(productData.get("obsolescenceRisk"));
                String region = (String) productData.getOrDefault("region", null);
                
                // Add turnover rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("turnover_rate_" + productId)
                        .metricValue(turnoverRate)
                        .metricUnit("turns_per_year")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Product Turnover")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add days on hand metric
                metrics.add(DashboardMetric.builder()
                        .metricName("days_on_hand_" + productId)
                        .metricValue(daysOnHand)
                        .metricUnit("days")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Product Turnover")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add obsolescence risk metric
                metrics.add(DashboardMetric.builder()
                        .metricName("obsolescence_risk_" + productId)
                        .metricValue(obsolescenceRisk)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Product Turnover")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add historical data for trend analysis
                metrics.add(DashboardMetric.builder()
                        .metricName("fulfillment_efficiency_" + productId)
                        .metricValue(convertToDouble(productData.get("fulfillmentEfficiency")))
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Fulfillment Trends")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} product turnover metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting product turnover metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get supplier performance metrics for supply chain management
     *
     * @return List of supplier performance metrics
     */
    private List<DashboardMetric> getSupplierPerformanceMetrics() {
        log.info("Collecting supplier performance metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get supplier performance data
            Map<String, Map<String, Object>> supplierData = warehousingClient.getSupplierPerformanceData();
            
            for (Map.Entry<String, Map<String, Object>> entry : supplierData.entrySet()) {
                String supplierId = entry.getKey();
                Map<String, Object> performance = entry.getValue();
                
                Double onTimeDelivery = convertToDouble(performance.get("onTimeDelivery"));
                Double qualityRating = convertToDouble(performance.get("qualityRating"));
                Double fulfillmentRate = convertToDouble(performance.get("fulfillmentRate"));
                Double responseTime = convertToDouble(performance.get("responseTime"));
                Double costVariance = convertToDouble(performance.get("costVariance"));
                String region = (String) performance.getOrDefault("region", null);
                
                // Add on-time delivery metric
                metrics.add(DashboardMetric.builder()
                        .metricName("supplier_on_time_delivery_" + supplierId)
                        .metricValue(onTimeDelivery)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Supplier Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add quality rating metric
                metrics.add(DashboardMetric.builder()
                        .metricName("supplier_quality_rating_" + supplierId)
                        .metricValue(qualityRating)
                        .metricUnit("score")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Supplier Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add fulfillment rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("supplier_fulfillment_rate_" + supplierId)
                        .metricValue(fulfillmentRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Supplier Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add response time metric
                metrics.add(DashboardMetric.builder()
                        .metricName("supplier_response_time_" + supplierId)
                        .metricValue(responseTime)
                        .metricUnit("hours")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Supplier Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add cost variance metric
                metrics.add(DashboardMetric.builder()
                        .metricName("supplier_cost_variance_" + supplierId)
                        .metricValue(costVariance)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Supplier Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} supplier performance metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting supplier performance metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get warehouse capacity utilization metrics
     *
     * @return List of capacity utilization metrics
     */
    private List<DashboardMetric> getCapacityUtilizationMetrics() {
        log.info("Collecting capacity utilization metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get capacity utilization data
            Map<String, Map<String, Object>> capacityData = warehousingClient.getCapacityUtilizationData();
            
            for (Map.Entry<String, Map<String, Object>> entry : capacityData.entrySet()) {
                String warehouseId = entry.getKey();
                Map<String, Object> utilization = entry.getValue();
                
                Double spaceUtilization = convertToDouble(utilization.get("spaceUtilization"));
                Double shelfUtilization = convertToDouble(utilization.get("shelfUtilization"));
                Double peakCapacityUsage = convertToDouble(utilization.get("peakCapacityUsage"));
                Double averageCapacityUsage = convertToDouble(utilization.get("averageCapacityUsage"));
                Double seasonalVariation = convertToDouble(utilization.get("seasonalVariation"));
                String region = (String) utilization.getOrDefault("region", null);
                
                // Add space utilization metric
                metrics.add(DashboardMetric.builder()
                        .metricName("space_utilization_" + warehouseId)
                        .metricValue(spaceUtilization)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Capacity Utilization")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add shelf utilization metric
                metrics.add(DashboardMetric.builder()
                        .metricName("shelf_utilization_" + warehouseId)
                        .metricValue(shelfUtilization)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Capacity Utilization")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add peak capacity usage metric
                metrics.add(DashboardMetric.builder()
                        .metricName("peak_capacity_usage_" + warehouseId)
                        .metricValue(peakCapacityUsage)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Capacity Utilization")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add average capacity usage metric
                metrics.add(DashboardMetric.builder()
                        .metricName("average_capacity_usage_" + warehouseId)
                        .metricValue(averageCapacityUsage)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Capacity Utilization")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add seasonal variation metric
                metrics.add(DashboardMetric.builder()
                        .metricName("seasonal_variation_" + warehouseId)
                        .metricValue(seasonalVariation)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.WAREHOUSING)
                        .sourceService("Capacity Utilization")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} capacity utilization metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting capacity utilization metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Helper method to convert Object to Double
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
            return 0.0;
        }
    }
}
