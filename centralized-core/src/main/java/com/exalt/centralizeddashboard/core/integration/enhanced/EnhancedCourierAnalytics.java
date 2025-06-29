package com.exalt.centralizeddashboard.core.integration.enhanced;

import com.exalt.centralizeddashboard.core.integration.CourierServiceClient;
import com.exalt.centralizeddashboard.core.model.DashboardMetric;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Enhanced Courier Analytics
 * Provides deeper metric collection and analysis for the Courier Services domain
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EnhancedCourierAnalytics {

    private final CourierServiceClient courierClient;

    /**
     * Get enhanced metrics from Courier domain with deeper insights
     *
     * @return List of enhanced Courier metrics
     */
    public List<DashboardMetric> getEnhancedCourierMetrics() {
        log.info("Collecting enhanced Courier metrics");
        List<DashboardMetric> enhancedMetrics = new ArrayList<>();
        
        try {
            // Get standard metrics as a foundation
            Map<String, List<Map<String, Object>>> standardMetrics = courierClient.getAllCourierMetrics();
            
            // Add delivery performance metrics
            enhancedMetrics.addAll(getDeliveryPerformanceMetrics());
            
            // Add route optimization metrics
            enhancedMetrics.addAll(getRouteOptimizationMetrics());
            
            // Add courier efficiency metrics
            enhancedMetrics.addAll(getCourierEfficiencyMetrics());
            
            // Add customer satisfaction metrics
            enhancedMetrics.addAll(getCustomerSatisfactionMetrics());
            
            // Add delivery cost analysis metrics
            enhancedMetrics.addAll(getDeliveryCostAnalysisMetrics());
            
            // Add sustainability metrics
            enhancedMetrics.addAll(getSustainabilityMetrics());
            
            log.info("Successfully collected {} enhanced Courier metrics", enhancedMetrics.size());
        } catch (Exception e) {
            log.error("Error collecting enhanced Courier metrics", e);
        }
        
        return enhancedMetrics;
    }
    
    /**
     * Get delivery performance metrics
     *
     * @return List of delivery performance metrics
     */
    private List<DashboardMetric> getDeliveryPerformanceMetrics() {
        log.info("Collecting delivery performance metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get delivery performance data by region
            Map<String, Map<String, Object>> performanceData = courierClient.getDeliveryPerformanceByRegion();
            
            for (Map.Entry<String, Map<String, Object>> entry : performanceData.entrySet()) {
                String region = entry.getKey();
                Map<String, Object> performance = entry.getValue();
                
                Double onTimeDeliveryRate = convertToDouble(performance.get("onTimeDeliveryRate"));
                Double averageDeliveryTime = convertToDouble(performance.get("averageDeliveryTime"));
                Double firstAttemptSuccessRate = convertToDouble(performance.get("firstAttemptSuccessRate"));
                Double missedDeliveryRate = convertToDouble(performance.get("missedDeliveryRate"));
                Double earlyDeliveryRate = convertToDouble(performance.get("earlyDeliveryRate"));
                
                // Add on-time delivery rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("on_time_delivery_rate_" + region)
                        .metricValue(onTimeDeliveryRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Delivery Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add average delivery time metric
                metrics.add(DashboardMetric.builder()
                        .metricName("average_delivery_time_" + region)
                        .metricValue(averageDeliveryTime)
                        .metricUnit("hours")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Delivery Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add first attempt success rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("first_attempt_success_rate_" + region)
                        .metricValue(firstAttemptSuccessRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Delivery Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add missed delivery rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("missed_delivery_rate_" + region)
                        .metricValue(missedDeliveryRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Delivery Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add early delivery rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("early_delivery_rate_" + region)
                        .metricValue(earlyDeliveryRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Delivery Performance")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} delivery performance metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting delivery performance metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get route optimization metrics
     *
     * @return List of route optimization metrics
     */
    private List<DashboardMetric> getRouteOptimizationMetrics() {
        log.info("Collecting route optimization metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get route optimization data
            Map<String, Map<String, Object>> routeData = courierClient.getRouteOptimizationData();
            
            for (Map.Entry<String, Map<String, Object>> entry : routeData.entrySet()) {
                String regionId = entry.getKey();
                Map<String, Object> optimization = entry.getValue();
                
                Double routeEfficiency = convertToDouble(optimization.get("routeEfficiency"));
                Double fuelEfficiency = convertToDouble(optimization.get("fuelEfficiency"));
                Double averageTripDistance = convertToDouble(optimization.get("averageTripDistance"));
                Double stopDensity = convertToDouble(optimization.get("stopDensity"));
                Double trafficDelayImpact = convertToDouble(optimization.get("trafficDelayImpact"));
                String region = (String) optimization.getOrDefault("region", regionId);
                
                // Add route efficiency metric
                metrics.add(DashboardMetric.builder()
                        .metricName("route_efficiency_" + regionId)
                        .metricValue(routeEfficiency)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Route Optimization")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add fuel efficiency metric
                metrics.add(DashboardMetric.builder()
                        .metricName("fuel_efficiency_" + regionId)
                        .metricValue(fuelEfficiency)
                        .metricUnit("mpg")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Route Optimization")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add average trip distance metric
                metrics.add(DashboardMetric.builder()
                        .metricName("average_trip_distance_" + regionId)
                        .metricValue(averageTripDistance)
                        .metricUnit("miles")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Route Optimization")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add stop density metric
                metrics.add(DashboardMetric.builder()
                        .metricName("stop_density_" + regionId)
                        .metricValue(stopDensity)
                        .metricUnit("stops_per_mile")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Route Optimization")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add traffic delay impact metric
                metrics.add(DashboardMetric.builder()
                        .metricName("traffic_delay_impact_" + regionId)
                        .metricValue(trafficDelayImpact)
                        .metricUnit("minutes_per_delivery")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Route Optimization")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} route optimization metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting route optimization metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get courier efficiency metrics
     *
     * @return List of courier efficiency metrics
     */
    private List<DashboardMetric> getCourierEfficiencyMetrics() {
        log.info("Collecting courier efficiency metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get courier efficiency data
            Map<String, Map<String, Object>> courierData = courierClient.getCourierEfficiencyData();
            
            for (Map.Entry<String, Map<String, Object>> entry : courierData.entrySet()) {
                String courierId = entry.getKey();
                Map<String, Object> efficiency = entry.getValue();
                
                Double deliveriesPerHour = convertToDouble(efficiency.get("deliveriesPerHour"));
                Double timePerDelivery = convertToDouble(efficiency.get("timePerDelivery"));
                Double idleTime = convertToDouble(efficiency.get("idleTime"));
                Double deliveriesPerShift = convertToDouble(efficiency.get("deliveriesPerShift"));
                Double averageWaitTime = convertToDouble(efficiency.get("averageWaitTime"));
                String region = (String) efficiency.getOrDefault("region", null);
                
                // Add deliveries per hour metric
                metrics.add(DashboardMetric.builder()
                        .metricName("deliveries_per_hour_" + courierId)
                        .metricValue(deliveriesPerHour)
                        .metricUnit("deliveries")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Courier Efficiency")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add time per delivery metric
                metrics.add(DashboardMetric.builder()
                        .metricName("time_per_delivery_" + courierId)
                        .metricValue(timePerDelivery)
                        .metricUnit("minutes")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Courier Efficiency")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add idle time metric
                metrics.add(DashboardMetric.builder()
                        .metricName("idle_time_" + courierId)
                        .metricValue(idleTime)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Courier Efficiency")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add deliveries per shift metric
                metrics.add(DashboardMetric.builder()
                        .metricName("deliveries_per_shift_" + courierId)
                        .metricValue(deliveriesPerShift)
                        .metricUnit("deliveries")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Courier Efficiency")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add average wait time metric
                metrics.add(DashboardMetric.builder()
                        .metricName("average_wait_time_" + courierId)
                        .metricValue(averageWaitTime)
                        .metricUnit("minutes")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Courier Efficiency")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} courier efficiency metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting courier efficiency metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get customer satisfaction metrics
     *
     * @return List of customer satisfaction metrics
     */
    private List<DashboardMetric> getCustomerSatisfactionMetrics() {
        log.info("Collecting customer satisfaction metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get customer satisfaction data
            Map<String, Map<String, Object>> satisfactionData = courierClient.getCustomerSatisfactionData();
            
            for (Map.Entry<String, Map<String, Object>> entry : satisfactionData.entrySet()) {
                String regionId = entry.getKey();
                Map<String, Object> satisfaction = entry.getValue();
                
                Double overallSatisfactionScore = convertToDouble(satisfaction.get("overallSatisfactionScore"));
                Double deliveryTimeSatisfaction = convertToDouble(satisfaction.get("deliveryTimeSatisfaction"));
                Double courierProfessionalismScore = convertToDouble(satisfaction.get("courierProfessionalismScore"));
                Double packageConditionScore = convertToDouble(satisfaction.get("packageConditionScore"));
                Double npsScore = convertToDouble(satisfaction.get("npsScore"));
                String region = (String) satisfaction.getOrDefault("region", regionId);
                
                // Add overall satisfaction score metric
                metrics.add(DashboardMetric.builder()
                        .metricName("overall_satisfaction_score_" + regionId)
                        .metricValue(overallSatisfactionScore)
                        .metricUnit("score")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Customer Satisfaction")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add delivery time satisfaction metric
                metrics.add(DashboardMetric.builder()
                        .metricName("delivery_time_satisfaction_" + regionId)
                        .metricValue(deliveryTimeSatisfaction)
                        .metricUnit("score")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Customer Satisfaction")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add courier professionalism score metric
                metrics.add(DashboardMetric.builder()
                        .metricName("courier_professionalism_score_" + regionId)
                        .metricValue(courierProfessionalismScore)
                        .metricUnit("score")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Customer Satisfaction")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add package condition score metric
                metrics.add(DashboardMetric.builder()
                        .metricName("package_condition_score_" + regionId)
                        .metricValue(packageConditionScore)
                        .metricUnit("score")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Customer Satisfaction")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add NPS score metric
                metrics.add(DashboardMetric.builder()
                        .metricName("nps_score_" + regionId)
                        .metricValue(npsScore)
                        .metricUnit("score")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Customer Satisfaction")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} customer satisfaction metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting customer satisfaction metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get delivery cost analysis metrics
     *
     * @return List of delivery cost analysis metrics
     */
    private List<DashboardMetric> getDeliveryCostAnalysisMetrics() {
        log.info("Collecting delivery cost analysis metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get delivery cost analysis data
            Map<String, Map<String, Object>> costData = courierClient.getDeliveryCostAnalysisData();
            
            for (Map.Entry<String, Map<String, Object>> entry : costData.entrySet()) {
                String regionId = entry.getKey();
                Map<String, Object> costs = entry.getValue();
                
                Double costPerDelivery = convertToDouble(costs.get("costPerDelivery"));
                Double fuelCosts = convertToDouble(costs.get("fuelCosts"));
                Double laborCosts = convertToDouble(costs.get("laborCosts"));
                Double maintenanceCosts = convertToDouble(costs.get("maintenanceCosts"));
                Double overheadCosts = convertToDouble(costs.get("overheadCosts"));
                String region = (String) costs.getOrDefault("region", regionId);
                
                // Add cost per delivery metric
                metrics.add(DashboardMetric.builder()
                        .metricName("cost_per_delivery_" + regionId)
                        .metricValue(costPerDelivery)
                        .metricUnit("currency")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Delivery Cost Analysis")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add fuel costs metric
                metrics.add(DashboardMetric.builder()
                        .metricName("fuel_costs_" + regionId)
                        .metricValue(fuelCosts)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Delivery Cost Analysis")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add labor costs metric
                metrics.add(DashboardMetric.builder()
                        .metricName("labor_costs_" + regionId)
                        .metricValue(laborCosts)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Delivery Cost Analysis")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add maintenance costs metric
                metrics.add(DashboardMetric.builder()
                        .metricName("maintenance_costs_" + regionId)
                        .metricValue(maintenanceCosts)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Delivery Cost Analysis")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add overhead costs metric
                metrics.add(DashboardMetric.builder()
                        .metricName("overhead_costs_" + regionId)
                        .metricValue(overheadCosts)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Delivery Cost Analysis")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} delivery cost analysis metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting delivery cost analysis metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get sustainability metrics
     *
     * @return List of sustainability metrics
     */
    private List<DashboardMetric> getSustainabilityMetrics() {
        log.info("Collecting sustainability metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get sustainability data
            Map<String, Map<String, Object>> sustainabilityData = courierClient.getSustainabilityData();
            
            for (Map.Entry<String, Map<String, Object>> entry : sustainabilityData.entrySet()) {
                String regionId = entry.getKey();
                Map<String, Object> sustainability = entry.getValue();
                
                Double carbonFootprint = convertToDouble(sustainability.get("carbonFootprint"));
                Double evPercentage = convertToDouble(sustainability.get("evPercentage"));
                Double fuelEfficiency = convertToDouble(sustainability.get("fuelEfficiency"));
                Double packageRecyclingRate = convertToDouble(sustainability.get("packageRecyclingRate"));
                Double emissionsPerDelivery = convertToDouble(sustainability.get("emissionsPerDelivery"));
                String region = (String) sustainability.getOrDefault("region", regionId);
                
                // Add carbon footprint metric
                metrics.add(DashboardMetric.builder()
                        .metricName("carbon_footprint_" + regionId)
                        .metricValue(carbonFootprint)
                        .metricUnit("kg_co2")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Sustainability")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add EV percentage metric
                metrics.add(DashboardMetric.builder()
                        .metricName("ev_percentage_" + regionId)
                        .metricValue(evPercentage)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Sustainability")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add fuel efficiency metric
                metrics.add(DashboardMetric.builder()
                        .metricName("sustainability_fuel_efficiency_" + regionId)
                        .metricValue(fuelEfficiency)
                        .metricUnit("mpg")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Sustainability")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add package recycling rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("package_recycling_rate_" + regionId)
                        .metricValue(packageRecyclingRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Sustainability")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add emissions per delivery metric
                metrics.add(DashboardMetric.builder()
                        .metricName("emissions_per_delivery_" + regionId)
                        .metricValue(emissionsPerDelivery)
                        .metricUnit("kg_co2")
                        .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                        .sourceService("Sustainability")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} sustainability metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting sustainability metrics", e);
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
