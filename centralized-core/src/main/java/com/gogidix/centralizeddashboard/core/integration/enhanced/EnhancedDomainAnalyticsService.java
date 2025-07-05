package com.gogidix.centralizeddashboard.core.integration.enhanced;

import com.gogidix.centralizeddashboard.core.integration.CourierServiceClient;
import com.gogidix.centralizeddashboard.core.integration.SocialCommerceClient;
import com.gogidix.centralizeddashboard.core.integration.WarehousingClient;
import com.gogidix.centralizeddashboard.core.model.CorrelationResult;
import com.gogidix.centralizeddashboard.core.model.CrossDomainInsight;
import com.gogidix.centralizeddashboard.core.model.DashboardMetric;
import com.gogidix.centralizeddashboard.core.model.TrendData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Enhanced Domain Analytics Service
 * Provides deeper metric collection and cross-domain analytics capabilities
 * through advanced integration with all three domains:
 * - Social Commerce
 * - Warehousing
 * - Courier Services
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EnhancedDomainAnalyticsService {

    private final CourierServiceClient courierServiceClient;
    private final SocialCommerceClient socialCommerceClient;
    private final WarehousingClient warehousingClient;
    private final EnhancedSocialCommerceAnalytics socialCommerceAnalytics;
    private final EnhancedWarehousingAnalytics warehousingAnalytics;
    private final EnhancedCourierAnalytics courierAnalytics;

    /**
     * Fetch comprehensive cross-domain metrics with enhanced analytics
     * This provides a unified view of all three domains with deeper insights
     *
     * @return List of comprehensive metrics across all domains
     */
    public List<DashboardMetric> getEnhancedCrossDomainMetrics() {
        log.info("Fetching enhanced cross-domain metrics");
        List<DashboardMetric> enhancedMetrics = new ArrayList<>();

        // Parallel fetching of enhanced metrics from all domains
        CompletableFuture<List<DashboardMetric>> socialCommerceFuture = 
                CompletableFuture.supplyAsync(() -> socialCommerceAnalytics.getEnhancedSocialCommerceMetrics());
        
        CompletableFuture<List<DashboardMetric>> warehousingFuture = 
                CompletableFuture.supplyAsync(() -> warehousingAnalytics.getEnhancedWarehousingMetrics());
        
        CompletableFuture<List<DashboardMetric>> courierFuture = 
                CompletableFuture.supplyAsync(() -> courierAnalytics.getEnhancedCourierMetrics());

        // Wait for all metrics to be collected
        CompletableFuture.allOf(socialCommerceFuture, warehousingFuture, courierFuture).join();

        try {
            enhancedMetrics.addAll(socialCommerceFuture.get());
            enhancedMetrics.addAll(warehousingFuture.get());
            enhancedMetrics.addAll(courierFuture.get());
            
            log.info("Successfully collected {} enhanced metrics across all domains", enhancedMetrics.size());
        } catch (Exception e) {
            log.error("Error collecting enhanced cross-domain metrics", e);
        }

        return enhancedMetrics;
    }

    /**
     * Generate cross-domain insights by analyzing correlations between metrics
     * from different domains
     *
     * @return List of cross-domain insights
     */
    public List<CrossDomainInsight> generateCrossDomainInsights() {
        log.info("Generating cross-domain insights");
        List<CrossDomainInsight> insights = new ArrayList<>();
        
        try {
            // Collect enhanced metrics from all domains
            List<DashboardMetric> socialCommerceMetrics = socialCommerceAnalytics.getEnhancedSocialCommerceMetrics();
            List<DashboardMetric> warehousingMetrics = warehousingAnalytics.getEnhancedWarehousingMetrics();
            List<DashboardMetric> courierMetrics = courierAnalytics.getEnhancedCourierMetrics();
            
            // Social Commerce → Warehousing Insights
            insights.addAll(correlateSocialCommerceAndWarehousing(socialCommerceMetrics, warehousingMetrics));
            
            // Warehousing → Courier Insights
            insights.addAll(correlateWarehousingAndCourier(warehousingMetrics, courierMetrics));
            
            // Courier → Social Commerce Insights
            insights.addAll(correlateCourierAndSocialCommerce(courierMetrics, socialCommerceMetrics));
            
            // Full supply chain insights (all three domains)
            insights.addAll(analyzeFullSupplyChain(socialCommerceMetrics, warehousingMetrics, courierMetrics));
            
            log.info("Successfully generated {} cross-domain insights", insights.size());
        } catch (Exception e) {
            log.error("Error generating cross-domain insights", e);
        }
        
        return insights;
    }

    /**
     * Correlate Social Commerce and Warehousing metrics to generate insights
     *
     * @param socialCommerceMetrics Social Commerce metrics
     * @param warehousingMetrics Warehousing metrics
     * @return List of cross-domain insights
     */
    private List<CrossDomainInsight> correlateSocialCommerceAndWarehousing(
            List<DashboardMetric> socialCommerceMetrics, 
            List<DashboardMetric> warehousingMetrics) {
        
        List<CrossDomainInsight> insights = new ArrayList<>();
        
        // Correlation between trending products in social commerce and inventory levels
        Map<String, Double> trendingProducts = extractTrendingProducts(socialCommerceMetrics);
        Map<String, Double> inventoryLevels = extractInventoryLevels(warehousingMetrics);
        
        // Find products with high social trending but low inventory
        for (Map.Entry<String, Double> product : trendingProducts.entrySet()) {
            String productId = product.getKey();
            Double trendScore = product.getValue();
            
            if (inventoryLevels.containsKey(productId)) {
                Double inventoryLevel = inventoryLevels.get(productId);
                
                // If trending score is high but inventory is low, create an insight
                if (trendScore > 80.0 && inventoryLevel < 20.0) {
                    insights.add(CrossDomainInsight.builder()
                            .insightType(CrossDomainInsight.InsightType.INVENTORY_RISK)
                            .title("Inventory Risk for Trending Product")
                            .description("Product " + productId + " is trending (score: " + trendScore + 
                                    ") but has low inventory level (" + inventoryLevel + "%)")
                            .severity(CrossDomainInsight.Severity.HIGH)
                            .sourceDomains(Arrays.asList(
                                    DashboardMetric.SourceDomain.SOCIAL_COMMERCE, 
                                    DashboardMetric.SourceDomain.WAREHOUSING))
                            .timestamp(LocalDateTime.now())
                            .relatedMetrics(Arrays.asList(
                                    "product_trend_score_" + productId,
                                    "inventory_level_" + productId))
                            .build());
                }
            }
        }
        
        return insights;
    }

    /**
     * Correlate Warehousing and Courier metrics to generate insights
     *
     * @param warehousingMetrics Warehousing metrics
     * @param courierMetrics Courier metrics
     * @return List of cross-domain insights
     */
    private List<CrossDomainInsight> correlateWarehousingAndCourier(
            List<DashboardMetric> warehousingMetrics, 
            List<DashboardMetric> courierMetrics) {
        
        List<CrossDomainInsight> insights = new ArrayList<>();
        
        // Correlation between fulfillment rates and delivery performance
        Map<String, Double> fulfillmentTimes = extractFulfillmentTimes(warehousingMetrics);
        Map<String, Double> deliveryTimes = extractDeliveryTimes(courierMetrics);
        
        // Calculate regional fulfillment-to-delivery efficiency
        Map<String, CorrelationResult> regionEfficiency = new HashMap<>();
        
        for (Map.Entry<String, Double> fulfillment : fulfillmentTimes.entrySet()) {
            String region = fulfillment.getKey();
            Double fulfillmentTime = fulfillment.getValue();
            
            if (deliveryTimes.containsKey(region)) {
                Double deliveryTime = deliveryTimes.get(region);
                Double totalTime = fulfillmentTime + deliveryTime;
                Double efficiency = 48.0 / totalTime * 100.0; // Efficiency score (48-hour target)
                
                regionEfficiency.put(region, new CorrelationResult(
                        region, 
                        efficiency, 
                        totalTime,
                        fulfillmentTime / totalTime * 100.0,
                        deliveryTime / totalTime * 100.0));
            }
        }
        
        // Generate insights for regions with poor efficiency
        for (CorrelationResult result : regionEfficiency.values()) {
            if (result.getScore() < 70.0) {
                String bottleneck = result.getFulfillmentPercentage() > result.getDeliveryPercentage() ? 
                        "Fulfillment" : "Delivery";
                
                insights.add(CrossDomainInsight.builder()
                        .insightType(CrossDomainInsight.InsightType.LOGISTICS_BOTTLENECK)
                        .title("Logistics Bottleneck in " + result.getRegion())
                        .description("Region " + result.getRegion() + " has poor order-to-delivery efficiency (" + 
                                String.format("%.1f", result.getScore()) + "%). " + bottleneck + " is the primary bottleneck.")
                        .severity(CrossDomainInsight.Severity.MEDIUM)
                        .sourceDomains(Arrays.asList(
                                DashboardMetric.SourceDomain.WAREHOUSING, 
                                DashboardMetric.SourceDomain.COURIER_SERVICES))
                        .timestamp(LocalDateTime.now())
                        .relatedMetrics(Arrays.asList(
                                "fulfillment_time_" + result.getRegion(),
                                "delivery_time_" + result.getRegion()))
                        .build());
            }
        }
        
        return insights;
    }

    /**
     * Correlate Courier and Social Commerce metrics to generate insights
     *
     * @param courierMetrics Courier metrics
     * @param socialCommerceMetrics Social Commerce metrics
     * @return List of cross-domain insights
     */
    private List<CrossDomainInsight> correlateCourierAndSocialCommerce(
            List<DashboardMetric> courierMetrics, 
            List<DashboardMetric> socialCommerceMetrics) {
        
        List<CrossDomainInsight> insights = new ArrayList<>();
        
        // Extract regional customer satisfaction and delivery performance
        Map<String, Double> customerSatisfaction = extractCustomerSatisfaction(socialCommerceMetrics);
        Map<String, Double> deliveryPerformance = extractDeliveryPerformance(courierMetrics);
        
        // Identify regions where delivery performance impacts customer satisfaction
        for (Map.Entry<String, Double> satisfaction : customerSatisfaction.entrySet()) {
            String region = satisfaction.getKey();
            Double satisfactionScore = satisfaction.getValue();
            
            if (deliveryPerformance.containsKey(region)) {
                Double performanceScore = deliveryPerformance.get(region);
                
                // If there's a significant gap between delivery performance and satisfaction
                if (performanceScore - satisfactionScore > 15.0) {
                    insights.add(CrossDomainInsight.builder()
                            .insightType(CrossDomainInsight.InsightType.CUSTOMER_EXPERIENCE_GAP)
                            .title("Delivery Impact on Customer Satisfaction in " + region)
                            .description("Despite good delivery performance (" + performanceScore + 
                                    "%), customer satisfaction is lower (" + satisfactionScore + 
                                    "%) in " + region + ", suggesting post-delivery issues.")
                            .severity(CrossDomainInsight.Severity.MEDIUM)
                            .sourceDomains(Arrays.asList(
                                    DashboardMetric.SourceDomain.COURIER_SERVICES, 
                                    DashboardMetric.SourceDomain.SOCIAL_COMMERCE))
                            .timestamp(LocalDateTime.now())
                            .relatedMetrics(Arrays.asList(
                                    "delivery_performance_" + region,
                                    "customer_satisfaction_" + region))
                            .build());
                }
            }
        }
        
        return insights;
    }

    /**
     * Analyze the full supply chain across all three domains
     *
     * @param socialCommerceMetrics Social Commerce metrics
     * @param warehousingMetrics Warehousing metrics
     * @param courierMetrics Courier metrics
     * @return List of cross-domain insights
     */
    private List<CrossDomainInsight> analyzeFullSupplyChain(
            List<DashboardMetric> socialCommerceMetrics,
            List<DashboardMetric> warehousingMetrics,
            List<DashboardMetric> courierMetrics) {
        
        List<CrossDomainInsight> insights = new ArrayList<>();
        
        // Extract key metrics from each domain
        Map<String, TrendData> orderTrends = extractOrderTrends(socialCommerceMetrics);
        Map<String, TrendData> fulfillmentTrends = extractFulfillmentTrends(warehousingMetrics);
        Map<String, TrendData> deliveryTrends = extractDeliveryTrends(courierMetrics);
        
        // Find products with full supply chain optimization opportunities
        Set<String> allProductIds = new HashSet<>();
        allProductIds.addAll(orderTrends.keySet());
        allProductIds.addAll(fulfillmentTrends.keySet());
        allProductIds.addAll(deliveryTrends.keySet());
        
        for (String productId : allProductIds) {
            if (orderTrends.containsKey(productId) && 
                fulfillmentTrends.containsKey(productId) && 
                deliveryTrends.containsKey(productId)) {
                
                TrendData orderTrend = orderTrends.get(productId);
                TrendData fulfillmentTrend = fulfillmentTrends.get(productId);
                TrendData deliveryTrend = deliveryTrends.get(productId);
                
                // If order volume is trending up but fulfillment efficiency is trending down
                if (orderTrend.getSlope() > 0.1 && fulfillmentTrend.getSlope() < -0.05) {
                    insights.add(CrossDomainInsight.builder()
                            .insightType(CrossDomainInsight.InsightType.SUPPLY_CHAIN_RISK)
                            .title("Supply Chain Risk for Product " + productId)
                            .description("Order volume is increasing (" + String.format("%.1f", orderTrend.getSlope() * 100) + 
                                    "%) but fulfillment efficiency is decreasing (" + 
                                    String.format("%.1f", fulfillmentTrend.getSlope() * 100) + 
                                    "%) for product " + productId)
                            .severity(CrossDomainInsight.Severity.HIGH)
                            .sourceDomains(Arrays.asList(
                                    DashboardMetric.SourceDomain.SOCIAL_COMMERCE,
                                    DashboardMetric.SourceDomain.WAREHOUSING,
                                    DashboardMetric.SourceDomain.COURIER_SERVICES))
                            .timestamp(LocalDateTime.now())
                            .relatedMetrics(Arrays.asList(
                                    "order_volume_" + productId,
                                    "fulfillment_efficiency_" + productId,
                                    "delivery_time_" + productId))
                            .build());
                }
                
                // Calculate end-to-end efficiency score
                double e2eScore = calculateEndToEndScore(orderTrend, fulfillmentTrend, deliveryTrend);
                
                // If the end-to-end score is poor
                if (e2eScore < 65.0) {
                    insights.add(CrossDomainInsight.builder()
                            .insightType(CrossDomainInsight.InsightType.END_TO_END_OPTIMIZATION)
                            .title("End-to-End Optimization Needed for Product " + productId)
                            .description("Product " + productId + " has poor end-to-end efficiency score (" + 
                                    String.format("%.1f", e2eScore) + "%). Optimization across all domains required.")
                            .severity(CrossDomainInsight.Severity.MEDIUM)
                            .sourceDomains(Arrays.asList(
                                    DashboardMetric.SourceDomain.SOCIAL_COMMERCE,
                                    DashboardMetric.SourceDomain.WAREHOUSING,
                                    DashboardMetric.SourceDomain.COURIER_SERVICES))
                            .timestamp(LocalDateTime.now())
                            .relatedMetrics(Arrays.asList(
                                    "order_volume_" + productId,
                                    "fulfillment_efficiency_" + productId,
                                    "delivery_time_" + productId))
                            .build());
                }
            }
        }
        
        return insights;
    }

    // Helper methods to extract specific metrics from each domain
    
    private Map<String, Double> extractTrendingProducts(List<DashboardMetric> metrics) {
        Map<String, Double> trendingProducts = new HashMap<>();
        
        metrics.stream()
                .filter(metric -> metric.getMetricName().startsWith("product_trend_score_"))
                .forEach(metric -> {
                    String productId = metric.getMetricName().substring("product_trend_score_".length());
                    trendingProducts.put(productId, metric.getMetricValue());
                });
        
        return trendingProducts;
    }
    
    private Map<String, Double> extractInventoryLevels(List<DashboardMetric> metrics) {
        Map<String, Double> inventoryLevels = new HashMap<>();
        
        metrics.stream()
                .filter(metric -> metric.getMetricName().startsWith("inventory_level_"))
                .forEach(metric -> {
                    String productId = metric.getMetricName().substring("inventory_level_".length());
                    inventoryLevels.put(productId, metric.getMetricValue());
                });
        
        return inventoryLevels;
    }
    
    private Map<String, Double> extractFulfillmentTimes(List<DashboardMetric> metrics) {
        Map<String, Double> fulfillmentTimes = new HashMap<>();
        
        metrics.stream()
                .filter(metric -> metric.getMetricName().startsWith("fulfillment_time_"))
                .forEach(metric -> {
                    String region = metric.getMetricName().substring("fulfillment_time_".length());
                    fulfillmentTimes.put(region, metric.getMetricValue());
                });
        
        return fulfillmentTimes;
    }
    
    private Map<String, Double> extractDeliveryTimes(List<DashboardMetric> metrics) {
        Map<String, Double> deliveryTimes = new HashMap<>();
        
        metrics.stream()
                .filter(metric -> metric.getMetricName().startsWith("delivery_time_"))
                .forEach(metric -> {
                    String region = metric.getMetricName().substring("delivery_time_".length());
                    deliveryTimes.put(region, metric.getMetricValue());
                });
        
        return deliveryTimes;
    }
    
    private Map<String, Double> extractCustomerSatisfaction(List<DashboardMetric> metrics) {
        Map<String, Double> satisfaction = new HashMap<>();
        
        metrics.stream()
                .filter(metric -> metric.getMetricName().startsWith("customer_satisfaction_"))
                .forEach(metric -> {
                    String region = metric.getMetricName().substring("customer_satisfaction_".length());
                    satisfaction.put(region, metric.getMetricValue());
                });
        
        return satisfaction;
    }
    
    private Map<String, Double> extractDeliveryPerformance(List<DashboardMetric> metrics) {
        Map<String, Double> performance = new HashMap<>();
        
        metrics.stream()
                .filter(metric -> metric.getMetricName().startsWith("delivery_performance_"))
                .forEach(metric -> {
                    String region = metric.getMetricName().substring("delivery_performance_".length());
                    performance.put(region, metric.getMetricValue());
                });
        
        return performance;
    }
    
    private Map<String, TrendData> extractOrderTrends(List<DashboardMetric> metrics) {
        Map<String, TrendData> trends = new HashMap<>();
        
        // Group metrics by product ID
        Map<String, List<DashboardMetric>> productMetrics = metrics.stream()
                .filter(metric -> metric.getMetricName().startsWith("order_volume_"))
                .collect(Collectors.groupingBy(
                        metric -> metric.getMetricName().substring("order_volume_".length())));
        
        // Calculate trend for each product
        for (Map.Entry<String, List<DashboardMetric>> entry : productMetrics.entrySet()) {
            String productId = entry.getKey();
            List<DashboardMetric> productData = entry.getValue();
            
            // Sort by timestamp
            productData.sort(Comparator.comparing(DashboardMetric::getTimestamp));
            
            // Extract values and calculate trend
            if (productData.size() >= 2) {
                double[] values = productData.stream()
                        .mapToDouble(DashboardMetric::getMetricValue)
                        .toArray();
                
                double slope = calculateSlope(values);
                double currentValue = productData.get(productData.size() - 1).getMetricValue();
                
                trends.put(productId, new TrendData(currentValue, slope));
            }
        }
        
        return trends;
    }
    
    private Map<String, TrendData> extractFulfillmentTrends(List<DashboardMetric> metrics) {
        Map<String, TrendData> trends = new HashMap<>();
        
        // Group metrics by product ID
        Map<String, List<DashboardMetric>> productMetrics = metrics.stream()
                .filter(metric -> metric.getMetricName().startsWith("fulfillment_efficiency_"))
                .collect(Collectors.groupingBy(
                        metric -> metric.getMetricName().substring("fulfillment_efficiency_".length())));
        
        // Calculate trend for each product
        for (Map.Entry<String, List<DashboardMetric>> entry : productMetrics.entrySet()) {
            String productId = entry.getKey();
            List<DashboardMetric> productData = entry.getValue();
            
            // Sort by timestamp
            productData.sort(Comparator.comparing(DashboardMetric::getTimestamp));
            
            // Extract values and calculate trend
            if (productData.size() >= 2) {
                double[] values = productData.stream()
                        .mapToDouble(DashboardMetric::getMetricValue)
                        .toArray();
                
                double slope = calculateSlope(values);
                double currentValue = productData.get(productData.size() - 1).getMetricValue();
                
                trends.put(productId, new TrendData(currentValue, slope));
            }
        }
        
        return trends;
    }
    
    private Map<String, TrendData> extractDeliveryTrends(List<DashboardMetric> metrics) {
        Map<String, TrendData> trends = new HashMap<>();
        
        // Group metrics by product ID
        Map<String, List<DashboardMetric>> productMetrics = metrics.stream()
                .filter(metric -> metric.getMetricName().startsWith("delivery_time_"))
                .collect(Collectors.groupingBy(
                        metric -> metric.getMetricName().substring("delivery_time_".length())));
        
        // Calculate trend for each product
        for (Map.Entry<String, List<DashboardMetric>> entry : productMetrics.entrySet()) {
            String productId = entry.getKey();
            List<DashboardMetric> productData = entry.getValue();
            
            // Sort by timestamp
            productData.sort(Comparator.comparing(DashboardMetric::getTimestamp));
            
            // Extract values and calculate trend
            if (productData.size() >= 2) {
                double[] values = productData.stream()
                        .mapToDouble(DashboardMetric::getMetricValue)
                        .toArray();
                
                double slope = calculateSlope(values);
                double currentValue = productData.get(productData.size() - 1).getMetricValue();
                
                trends.put(productId, new TrendData(currentValue, slope));
            }
        }
        
        return trends;
    }
    
    private double calculateSlope(double[] values) {
        // Simple linear regression slope calculation
        // For simplicity, using equal time intervals
        int n = values.length;
        double sumX = 0.0;
        double sumY = 0.0;
        double sumXY = 0.0;
        double sumXX = 0.0;
        
        for (int i = 0; i < n; i++) {
            sumX += i;
            sumY += values[i];
            sumXY += i * values[i];
            sumXX += i * i;
        }
        
        double slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }
    
    private double calculateEndToEndScore(TrendData orderTrend, TrendData fulfillmentTrend, TrendData deliveryTrend) {
        // Calculate a composite score based on current values and trends
        double orderScore = orderTrend.getValue() > 0 ? 100.0 : 0.0;
        double fulfillmentScore = 100.0 - Math.min(fulfillmentTrend.getValue(), 100.0);
        double deliveryScore = 100.0 - Math.min(deliveryTrend.getValue() / 2.0, 100.0);
        
        // Apply trend adjustments
        orderScore += orderTrend.getSlope() * 50.0;
        fulfillmentScore -= fulfillmentTrend.getSlope() * 50.0;
        deliveryScore -= deliveryTrend.getSlope() * 50.0;
        
        // Calculate weighted average
        return (orderScore * 0.3 + fulfillmentScore * 0.35 + deliveryScore * 0.35);
    }
}
