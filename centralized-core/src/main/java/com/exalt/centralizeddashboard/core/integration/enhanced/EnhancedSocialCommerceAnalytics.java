package com.exalt.centralizeddashboard.core.integration.enhanced;

import com.exalt.centralizeddashboard.core.integration.SocialCommerceClient;
import com.exalt.centralizeddashboard.core.model.DashboardMetric;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Enhanced Social Commerce Analytics
 * Provides deeper metric collection and analysis for the Social Commerce domain
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EnhancedSocialCommerceAnalytics {

    private final SocialCommerceClient socialCommerceClient;

    /**
     * Get enhanced metrics from Social Commerce domain with deeper insights
     *
     * @return List of enhanced Social Commerce metrics
     */
    public List<DashboardMetric> getEnhancedSocialCommerceMetrics() {
        log.info("Collecting enhanced Social Commerce metrics");
        List<DashboardMetric> enhancedMetrics = new ArrayList<>();
        
        try {
            // Get standard metrics as a foundation
            Map<String, List<Map<String, Object>>> standardMetrics = socialCommerceClient.getAllSocialCommerceMetrics();
            
            // Add product-level analytics
            enhancedMetrics.addAll(getProductLevelAnalytics());
            
            // Add customer segmentation analytics
            enhancedMetrics.addAll(getCustomerSegmentationAnalytics());
            
            // Add campaign effectiveness metrics
            enhancedMetrics.addAll(getCampaignEffectivenessMetrics());
            
            // Add user behavior analytics
            enhancedMetrics.addAll(getUserBehaviorAnalytics());
            
            // Add sentiment analysis metrics
            enhancedMetrics.addAll(getSentimentAnalysisMetrics());
            
            // Add conversion funnel metrics
            enhancedMetrics.addAll(getConversionFunnelMetrics());
            
            log.info("Successfully collected {} enhanced Social Commerce metrics", enhancedMetrics.size());
        } catch (Exception e) {
            log.error("Error collecting enhanced Social Commerce metrics", e);
        }
        
        return enhancedMetrics;
    }
    
    /**
     * Get product-level analytics for individual products
     *
     * @return List of product-specific metrics
     */
    private List<DashboardMetric> getProductLevelAnalytics() {
        log.info("Collecting product-level analytics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get trending products
            Map<String, Map<String, Object>> trendingProductsMap = socialCommerceClient.getTrendingProducts();
            
            for (Map.Entry<String, Map<String, Object>> productEntry : trendingProductsMap.entrySet()) {
                Map<String, Object> product = productEntry.getValue();
                String productId = (String) product.getOrDefault("productId", "unknown");
                Double trendScore = convertToDouble(product.get("trendScore"));
                Double viewToSaleConversion = convertToDouble(product.get("viewToSaleConversion"));
                Double socialMentions = convertToDouble(product.get("socialMentions"));
                
                // Add trend score metric
                metrics.add(DashboardMetric.builder()
                        .metricName("product_trend_score_" + productId)
                        .metricValue(trendScore)
                        .metricUnit("score")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Product Analytics")
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add conversion rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("product_conversion_rate_" + productId)
                        .metricValue(viewToSaleConversion)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Product Analytics")
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add social mentions metric
                metrics.add(DashboardMetric.builder()
                        .metricName("product_social_mentions_" + productId)
                        .metricValue(socialMentions)
                        .metricUnit("count")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Product Analytics")
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} product-level metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting product-level analytics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get customer segmentation analytics based on behavior and demographics
     *
     * @return List of customer segment metrics
     */
    private List<DashboardMetric> getCustomerSegmentationAnalytics() {
        log.info("Collecting customer segmentation analytics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get customer segments data
            Map<String, Map<String, Object>> segmentsMap = socialCommerceClient.getCustomerSegments();
            
            for (Map.Entry<String, Map<String, Object>> segmentEntry : segmentsMap.entrySet()) {
                Map<String, Object> segment = segmentEntry.getValue();
                String segmentId = (String) segment.getOrDefault("segmentId", "unknown");
                String segmentName = (String) segment.getOrDefault("segmentName", "Unknown Segment");
                Double customerCount = convertToDouble(segment.get("customerCount"));
                Double averageOrderValue = convertToDouble(segment.get("averageOrderValue"));
                Double purchaseFrequency = convertToDouble(segment.get("purchaseFrequency"));
                String region = (String) segment.getOrDefault("region", null);
                
                // Add segment size metric
                metrics.add(DashboardMetric.builder()
                        .metricName("customer_segment_size_" + segmentId)
                        .metricValue(customerCount)
                        .metricUnit("count")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Customer Analytics")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add average order value metric
                metrics.add(DashboardMetric.builder()
                        .metricName("customer_segment_aov_" + segmentId)
                        .metricValue(averageOrderValue)
                        .metricUnit("currency")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Customer Analytics")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add purchase frequency metric
                metrics.add(DashboardMetric.builder()
                        .metricName("customer_segment_frequency_" + segmentId)
                        .metricValue(purchaseFrequency)
                        .metricUnit("orders_per_month")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Customer Analytics")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} customer segmentation metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting customer segmentation analytics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get campaign effectiveness metrics for marketing campaigns
     *
     * @return List of campaign metrics
     */
    private List<DashboardMetric> getCampaignEffectivenessMetrics() {
        log.info("Collecting campaign effectiveness metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get campaign data
            List<Map<String, Object>> campaigns = socialCommerceClient.getMarketingCampaigns();
            
            for (Map<String, Object> campaign : campaigns) {
                String campaignId = (String) campaign.getOrDefault("campaignId", "unknown");
                String campaignName = (String) campaign.getOrDefault("campaignName", "Unknown Campaign");
                Double impressions = convertToDouble(campaign.get("impressions"));
                Double clicks = convertToDouble(campaign.get("clicks"));
                Double conversions = convertToDouble(campaign.get("conversions"));
                Double spend = convertToDouble(campaign.get("spend"));
                String region = (String) campaign.getOrDefault("region", null);
                
                // Calculate derived metrics
                Double ctr = clicks > 0 && impressions > 0 ? (clicks / impressions) * 100 : 0.0;
                Double conversionRate = clicks > 0 && conversions > 0 ? (conversions / clicks) * 100 : 0.0;
                Double cpa = conversions > 0 && spend > 0 ? spend / conversions : 0.0;
                Double roas = spend > 0 && conversions > 0 ? 
                        convertToDouble(campaign.get("revenue")) / spend : 0.0;
                
                // Add click-through rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("campaign_ctr_" + campaignId)
                        .metricValue(ctr)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Marketing Analytics")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add conversion rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("campaign_conversion_rate_" + campaignId)
                        .metricValue(conversionRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Marketing Analytics")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add cost per acquisition metric
                metrics.add(DashboardMetric.builder()
                        .metricName("campaign_cpa_" + campaignId)
                        .metricValue(cpa)
                        .metricUnit("currency")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Marketing Analytics")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add return on ad spend metric
                metrics.add(DashboardMetric.builder()
                        .metricName("campaign_roas_" + campaignId)
                        .metricValue(roas)
                        .metricUnit("ratio")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Marketing Analytics")
                        .region(region)
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} campaign effectiveness metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting campaign effectiveness metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get user behavior analytics for understanding customer journey
     *
     * @return List of user behavior metrics
     */
    private List<DashboardMetric> getUserBehaviorAnalytics() {
        log.info("Collecting user behavior analytics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get user behavior data by region
            Map<String, Map<String, Object>> userBehavior = socialCommerceClient.getUserBehaviorByRegion();
            
            for (Map.Entry<String, Map<String, Object>> entry : userBehavior.entrySet()) {
                String region = entry.getKey();
                Map<String, Object> behavior = entry.getValue();
                
                Double avgSessionDuration = convertToDouble(behavior.get("avgSessionDuration"));
                Double pagesPerSession = convertToDouble(behavior.get("pagesPerSession"));
                Double bounceRate = convertToDouble(behavior.get("bounceRate"));
                Double cartAbandonmentRate = convertToDouble(behavior.get("cartAbandonmentRate"));
                Double returnRate = convertToDouble(behavior.get("returnRate"));
                
                // Add session duration metric
                metrics.add(DashboardMetric.builder()
                        .metricName("user_session_duration_" + region)
                        .metricValue(avgSessionDuration)
                        .metricUnit("seconds")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("User Behavior Analytics")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add pages per session metric
                metrics.add(DashboardMetric.builder()
                        .metricName("user_pages_per_session_" + region)
                        .metricValue(pagesPerSession)
                        .metricUnit("count")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("User Behavior Analytics")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add bounce rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("user_bounce_rate_" + region)
                        .metricValue(bounceRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("User Behavior Analytics")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add cart abandonment rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("cart_abandonment_rate_" + region)
                        .metricValue(cartAbandonmentRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("User Behavior Analytics")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add customer return rate metric
                metrics.add(DashboardMetric.builder()
                        .metricName("customer_return_rate_" + region)
                        .metricValue(returnRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("User Behavior Analytics")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} user behavior metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting user behavior analytics", e);
        }
        
        return metrics;
    }
    
    /**
     * Get sentiment analysis metrics for products and brand
     *
     * @return List of sentiment analysis metrics
     */
    private List<DashboardMetric> getSentimentAnalysisMetrics() {
        log.info("Collecting sentiment analysis metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get sentiment data
            Map<String, Map<String, Object>> sentimentData = socialCommerceClient.getSentimentAnalysis();
            
            // Process brand sentiment
            Map<String, Object> brandSentiment = sentimentData.getOrDefault("brand", new HashMap<>());
            processSentimentMetrics(metrics, brandSentiment, "brand", null);
            
            // Process product sentiment
            for (Map.Entry<String, Map<String, Object>> entry : sentimentData.entrySet()) {
                if (!entry.getKey().equals("brand")) {
                    processSentimentMetrics(metrics, entry.getValue(), "product", entry.getKey());
                }
            }
            
            log.info("Collected {} sentiment analysis metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting sentiment analysis metrics", e);
        }
        
        return metrics;
    }
    
    /**
     * Helper method to process sentiment metrics
     */
    private void processSentimentMetrics(List<DashboardMetric> metrics, Map<String, Object> sentimentData, 
                                         String type, String entityId) {
        Double positiveSentiment = convertToDouble(sentimentData.get("positive"));
        Double neutralSentiment = convertToDouble(sentimentData.get("neutral"));
        Double negativeSentiment = convertToDouble(sentimentData.get("negative"));
        Double sentimentScore = convertToDouble(sentimentData.get("sentimentScore"));
        String region = (String) sentimentData.getOrDefault("region", null);
        
        String metricPrefix = type.equals("brand") ? "brand_sentiment" : "product_sentiment_" + entityId;
        
        // Add positive sentiment metric
        metrics.add(DashboardMetric.builder()
                .metricName(metricPrefix + "_positive")
                .metricValue(positiveSentiment)
                .metricUnit("percent")
                .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                .sourceService("Sentiment Analysis")
                .region(region)
                .timestamp(LocalDateTime.now())
                .dataPointType(DashboardMetric.DataPointType.INSTANT)
                .build());
        
        // Add neutral sentiment metric
        metrics.add(DashboardMetric.builder()
                .metricName(metricPrefix + "_neutral")
                .metricValue(neutralSentiment)
                .metricUnit("percent")
                .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                .sourceService("Sentiment Analysis")
                .region(region)
                .timestamp(LocalDateTime.now())
                .dataPointType(DashboardMetric.DataPointType.INSTANT)
                .build());
        
        // Add negative sentiment metric
        metrics.add(DashboardMetric.builder()
                .metricName(metricPrefix + "_negative")
                .metricValue(negativeSentiment)
                .metricUnit("percent")
                .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                .sourceService("Sentiment Analysis")
                .region(region)
                .timestamp(LocalDateTime.now())
                .dataPointType(DashboardMetric.DataPointType.INSTANT)
                .build());
        
        // Add overall sentiment score metric
        metrics.add(DashboardMetric.builder()
                .metricName(metricPrefix + "_score")
                .metricValue(sentimentScore)
                .metricUnit("score")
                .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                .sourceService("Sentiment Analysis")
                .region(region)
                .timestamp(LocalDateTime.now())
                .dataPointType(DashboardMetric.DataPointType.INSTANT)
                .build());
    }
    
    /**
     * Get conversion funnel metrics for purchase journey
     *
     * @return List of conversion funnel metrics
     */
    private List<DashboardMetric> getConversionFunnelMetrics() {
        log.info("Collecting conversion funnel metrics");
        List<DashboardMetric> metrics = new ArrayList<>();
        
        try {
            // Get conversion funnel data by region
            Map<String, Map<String, Object>> funnelData = socialCommerceClient.getConversionFunnelByRegion();
            
            for (Map.Entry<String, Map<String, Object>> entry : funnelData.entrySet()) {
                String region = entry.getKey();
                Map<String, Object> funnel = entry.getValue();
                
                Double visitors = convertToDouble(funnel.get("visitors"));
                Double productViews = convertToDouble(funnel.get("productViews"));
                Double addToCart = convertToDouble(funnel.get("addToCart"));
                Double checkout = convertToDouble(funnel.get("checkout"));
                Double purchase = convertToDouble(funnel.get("purchase"));
                
                // Calculate conversion rates between funnel steps
                Double viewToCartRate = visitors > 0 ? (addToCart / visitors) * 100 : 0.0;
                Double cartToCheckoutRate = addToCart > 0 ? (checkout / addToCart) * 100 : 0.0;
                Double checkoutToPurchaseRate = checkout > 0 ? (purchase / checkout) * 100 : 0.0;
                Double overallConversionRate = visitors > 0 ? (purchase / visitors) * 100 : 0.0;
                
                // Add view to cart conversion rate
                metrics.add(DashboardMetric.builder()
                        .metricName("funnel_view_to_cart_" + region)
                        .metricValue(viewToCartRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Conversion Funnel")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add cart to checkout conversion rate
                metrics.add(DashboardMetric.builder()
                        .metricName("funnel_cart_to_checkout_" + region)
                        .metricValue(cartToCheckoutRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Conversion Funnel")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add checkout to purchase conversion rate
                metrics.add(DashboardMetric.builder()
                        .metricName("funnel_checkout_to_purchase_" + region)
                        .metricValue(checkoutToPurchaseRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Conversion Funnel")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add overall conversion rate
                metrics.add(DashboardMetric.builder()
                        .metricName("funnel_overall_conversion_" + region)
                        .metricValue(overallConversionRate)
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Conversion Funnel")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
                
                // Add customer satisfaction for this region
                metrics.add(DashboardMetric.builder()
                        .metricName("customer_satisfaction_" + region)
                        .metricValue(convertToDouble(funnel.get("customerSatisfaction")))
                        .metricUnit("percent")
                        .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                        .sourceService("Customer Analytics")
                        .region(region)
                        .timestamp(LocalDateTime.now())
                        .dataPointType(DashboardMetric.DataPointType.INSTANT)
                        .build());
            }
            
            log.info("Collected {} conversion funnel metrics", metrics.size());
        } catch (Exception e) {
            log.error("Error collecting conversion funnel metrics", e);
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
