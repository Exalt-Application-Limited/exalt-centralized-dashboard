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
 * Client for integrating with the Social Commerce domain.
 * Handles communication with Social Commerce services to fetch metrics and data.
 */
@Component
@Slf4j
public class SocialCommerceClient {

    private final RestTemplate restTemplate;
    
    @Value("${service.social-commerce.url}")
    private String socialCommerceBaseUrl;
    
    @Value("${service.social-commerce.analytics.url:${service.social-commerce.url}/analytics}")
    private String analyticsUrl;
    
    @Value("${service.social-commerce.engagement.url:${service.social-commerce.url}/engagement}")
    private String engagementUrl;
    
    @Value("${service.social-commerce.sales.url:${service.social-commerce.url}/sales}")
    private String salesUrl;

    public SocialCommerceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch analytics metrics from the Social Commerce domain.
     * These metrics provide insights into user behavior and platform usage.
     *
     * @return a list of analytics metrics
     */
    @CircuitBreaker(name = "socialCommerceAnalytics", fallbackMethod = "getDefaultAnalyticsMetrics")
    public List<Map<String, Object>> getAnalyticsMetrics() {
        log.info("Fetching analytics metrics from Social Commerce domain");
        try {
            String url = analyticsUrl + "/api/metrics";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} analytics metrics from Social Commerce domain", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching analytics metrics from Social Commerce domain", e);
            throw e;
        }
    }

    /**
     * Fallback method for analytics metrics in case of circuit breaker activation.
     *
     * @param e the exception that triggered the fallback
     * @return a default list of metrics
     */
    public List<Map<String, Object>> getDefaultAnalyticsMetrics(Exception e) {
        log.warn("Circuit breaker activated for Social Commerce analytics metrics. Using default values.", e);
        List<Map<String, Object>> defaultMetrics = new ArrayList<>();
        
        // Create default active users metric
        Map<String, Object> activeUsersMetric = new HashMap<>();
        activeUsersMetric.put("metricName", "active_users");
        activeUsersMetric.put("metricValue", 1250.0);
        activeUsersMetric.put("metricUnit", "count");
        activeUsersMetric.put("timestamp", LocalDateTime.now());
        
        // Create default new posts metric
        Map<String, Object> newPostsMetric = new HashMap<>();
        newPostsMetric.put("metricName", "new_posts");
        newPostsMetric.put("metricValue", 780.0);
        newPostsMetric.put("metricUnit", "count");
        newPostsMetric.put("timestamp", LocalDateTime.now());
        
        defaultMetrics.add(activeUsersMetric);
        defaultMetrics.add(newPostsMetric);
        
        return defaultMetrics;
    }

    /**
     * Fetch engagement metrics from the Social Commerce domain.
     * These metrics provide insights into user engagement with content and products.
     *
     * @return a list of engagement metrics
     */
    @CircuitBreaker(name = "socialCommerceEngagement", fallbackMethod = "getDefaultEngagementMetrics")
    public List<Map<String, Object>> getEngagementMetrics() {
        log.info("Fetching engagement metrics from Social Commerce domain");
        try {
            String url = engagementUrl + "/api/metrics";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} engagement metrics from Social Commerce domain", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching engagement metrics from Social Commerce domain", e);
            throw e;
        }
    }

    /**
     * Fallback method for engagement metrics in case of circuit breaker activation.
     *
     * @param e the exception that triggered the fallback
     * @return a default list of metrics
     */
    public List<Map<String, Object>> getDefaultEngagementMetrics(Exception e) {
        log.warn("Circuit breaker activated for Social Commerce engagement metrics. Using default values.", e);
        List<Map<String, Object>> defaultMetrics = new ArrayList<>();
        
        // Create default engagement rate metric
        Map<String, Object> engagementRateMetric = new HashMap<>();
        engagementRateMetric.put("metricName", "engagement_rate");
        engagementRateMetric.put("metricValue", 4.8);
        engagementRateMetric.put("metricUnit", "percent");
        engagementRateMetric.put("timestamp", LocalDateTime.now());
        
        // Create default likes per post metric
        Map<String, Object> likesPerPostMetric = new HashMap<>();
        likesPerPostMetric.put("metricName", "likes_per_post");
        likesPerPostMetric.put("metricValue", 12.3);
        likesPerPostMetric.put("metricUnit", "count");
        likesPerPostMetric.put("timestamp", LocalDateTime.now());
        
        defaultMetrics.add(engagementRateMetric);
        defaultMetrics.add(likesPerPostMetric);
        
        return defaultMetrics;
    }

    /**
     * Fetch sales metrics from the Social Commerce domain.
     * These metrics provide insights into sales performance and conversion rates.
     *
     * @return a list of sales metrics
     */
    @CircuitBreaker(name = "socialCommerceSales", fallbackMethod = "getDefaultSalesMetrics")
    public List<Map<String, Object>> getSalesMetrics() {
        log.info("Fetching sales metrics from Social Commerce domain");
        try {
            String url = salesUrl + "/api/metrics";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} sales metrics from Social Commerce domain", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching sales metrics from Social Commerce domain", e);
            throw e;
        }
    }

    /**
     * Fallback method for sales metrics in case of circuit breaker activation.
     *
     * @param e the exception that triggered the fallback
     * @return a default list of metrics
     */
    public List<Map<String, Object>> getDefaultSalesMetrics(Exception e) {
        log.warn("Circuit breaker activated for Social Commerce sales metrics. Using default values.", e);
        List<Map<String, Object>> defaultMetrics = new ArrayList<>();
        
        // Create default conversion rate metric
        Map<String, Object> conversionRateMetric = new HashMap<>();
        conversionRateMetric.put("metricName", "conversion_rate");
        conversionRateMetric.put("metricValue", 2.3);
        conversionRateMetric.put("metricUnit", "percent");
        conversionRateMetric.put("timestamp", LocalDateTime.now());
        
        // Create default average order value metric
        Map<String, Object> avgOrderValueMetric = new HashMap<>();
        avgOrderValueMetric.put("metricName", "average_order_value");
        avgOrderValueMetric.put("metricValue", 87.5);
        avgOrderValueMetric.put("metricUnit", "USD");
        avgOrderValueMetric.put("timestamp", LocalDateTime.now());
        
        defaultMetrics.add(conversionRateMetric);
        defaultMetrics.add(avgOrderValueMetric);
        
        return defaultMetrics;
    }

    /**
     * Fetch all metrics from the Social Commerce domain.
     * This provides a comprehensive view of the entire Social Commerce operation.
     *
     * @return a consolidated map of metrics by category
     */
    public Map<String, List<Map<String, Object>>> getAllSocialCommerceMetrics() {
        log.info("Fetching all metrics from Social Commerce domain");
        Map<String, List<Map<String, Object>>> allMetrics = new HashMap<>();
        
        try {
            // Get metrics from all categories
            List<Map<String, Object>> analyticsMetrics = getAnalyticsMetrics();
            List<Map<String, Object>> engagementMetrics = getEngagementMetrics();
            List<Map<String, Object>> salesMetrics = getSalesMetrics();
            
            // Consolidate metrics by category
            allMetrics.put("analytics", analyticsMetrics);
            allMetrics.put("engagement", engagementMetrics);
            allMetrics.put("sales", salesMetrics);
            
            log.info("Successfully fetched all metrics from Social Commerce domain");
        } catch (Exception e) {
            log.error("Error fetching all metrics from Social Commerce domain", e);
            // Even if some metrics fail, return what we have
        }
        
        return allMetrics;
    }

    /**
     * Fetch trending products data from Social Commerce domain.
     *
     * @return map of trending products data
     */
    @CircuitBreaker(name = "socialCommerceTrending", fallbackMethod = "getDefaultTrendingProducts")
    public Map<String, Map<String, Object>> getTrendingProducts() {
        log.info("Fetching trending products from Social Commerce");
        try {
            String url = salesUrl + "/trending-products";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching trending products from Social Commerce", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultTrendingProducts(Exception e) {
        log.warn("Using default trending products due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> productData = new HashMap<>();
        productData.put("productId", "default-product");
        productData.put("trendScore", 75.0);
        productData.put("salesVolume", 1000);
        defaultData.put("default-product", productData);
        return defaultData;
    }

    /**
     * Fetch customer segments data from Social Commerce domain.
     *
     * @return map of customer segments data
     */
    @CircuitBreaker(name = "socialCommerceSegments", fallbackMethod = "getDefaultCustomerSegments")
    public Map<String, Map<String, Object>> getCustomerSegments() {
        log.info("Fetching customer segments from Social Commerce");
        try {
            String url = analyticsUrl + "/customer-segments";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching customer segments from Social Commerce", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultCustomerSegments(Exception e) {
        log.warn("Using default customer segments due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> segmentData = new HashMap<>();
        segmentData.put("segmentId", "default-segment");
        segmentData.put("customerCount", 5000);
        segmentData.put("engagementRate", 65.0);
        defaultData.put("default-segment", segmentData);
        return defaultData;
    }

    /**
     * Fetch marketing campaigns data from Social Commerce domain.
     *
     * @return list of marketing campaigns data
     */
    @CircuitBreaker(name = "socialCommerceCampaigns", fallbackMethod = "getDefaultMarketingCampaigns")
    public List<Map<String, Object>> getMarketingCampaigns() {
        log.info("Fetching marketing campaigns from Social Commerce");
        try {
            String url = analyticsUrl + "/marketing-campaigns";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching marketing campaigns from Social Commerce", e);
            throw e;
        }
    }

    public List<Map<String, Object>> getDefaultMarketingCampaigns(Exception e) {
        log.warn("Using default marketing campaigns due to circuit breaker", e);
        List<Map<String, Object>> defaultData = new ArrayList<>();
        Map<String, Object> campaignData = new HashMap<>();
        campaignData.put("campaignId", "default-campaign");
        campaignData.put("performance", 70.0);
        campaignData.put("reach", 10000);
        campaignData.put("conversions", 500);
        defaultData.add(campaignData);
        return defaultData;
    }

    /**
     * Fetch user behavior data by region from Social Commerce domain.
     *
     * @return map of user behavior data by region
     */
    @CircuitBreaker(name = "socialCommerceUserBehavior", fallbackMethod = "getDefaultUserBehaviorByRegion")
    public Map<String, Map<String, Object>> getUserBehaviorByRegion() {
        log.info("Fetching user behavior by region from Social Commerce");
        try {
            String url = analyticsUrl + "/user-behavior/region";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching user behavior by region from Social Commerce", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultUserBehaviorByRegion(Exception e) {
        log.warn("Using default user behavior by region due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> behaviorData = new HashMap<>();
        behaviorData.put("pageViews", 10000);
        behaviorData.put("sessionDuration", 5.5);
        behaviorData.put("bounceRate", 35.0);
        defaultData.put("US", behaviorData);
        return defaultData;
    }

    /**
     * Fetch sentiment analysis data from Social Commerce domain.
     *
     * @return map of sentiment analysis data
     */
    @CircuitBreaker(name = "socialCommerceSentiment", fallbackMethod = "getDefaultSentimentAnalysis")
    public Map<String, Map<String, Object>> getSentimentAnalysis() {
        log.info("Fetching sentiment analysis from Social Commerce");
        try {
            String url = analyticsUrl + "/sentiment-analysis";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching sentiment analysis from Social Commerce", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultSentimentAnalysis(Exception e) {
        log.warn("Using default sentiment analysis due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> sentimentData = new HashMap<>();
        sentimentData.put("positive", 70.0);
        sentimentData.put("neutral", 20.0);
        sentimentData.put("negative", 10.0);
        defaultData.put("overall", sentimentData);
        return defaultData;
    }

    /**
     * Fetch conversion funnel data by region from Social Commerce domain.
     *
     * @return map of conversion funnel data by region
     */
    @CircuitBreaker(name = "socialCommerceConversionFunnel", fallbackMethod = "getDefaultConversionFunnelByRegion")
    public Map<String, Map<String, Object>> getConversionFunnelByRegion() {
        log.info("Fetching conversion funnel by region from Social Commerce");
        try {
            String url = analyticsUrl + "/conversion-funnel/region";
            ResponseEntity<Map<String, Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching conversion funnel by region from Social Commerce", e);
            throw e;
        }
    }

    public Map<String, Map<String, Object>> getDefaultConversionFunnelByRegion(Exception e) {
        log.warn("Using default conversion funnel by region due to circuit breaker", e);
        Map<String, Map<String, Object>> defaultData = new HashMap<>();
        Map<String, Object> funnelData = new HashMap<>();
        funnelData.put("views", 10000);
        funnelData.put("clicks", 2000);
        funnelData.put("conversions", 200);
        funnelData.put("conversionRate", 2.0);
        defaultData.put("US", funnelData);
        return defaultData;
    }

    /**
     * Get Social Commerce metrics - simplified method for backward compatibility
     * @return consolidated list of all metrics
     */
    public List<Map<String, Object>> getSocialCommerceMetrics() {
        log.info("Fetching social commerce metrics");
        List<Map<String, Object>> allMetrics = new ArrayList<>();
        
        // Aggregate all metrics into a single list
        Map<String, List<Map<String, Object>>> categorizedMetrics = getAllSocialCommerceMetrics();
        categorizedMetrics.values().forEach(allMetrics::addAll);
        
        return allMetrics;
    }

    /**
     * Get service status for health checks
     * @return status map
     */
    public Map<String, Object> getServiceStatus() {
        log.info("Fetching service status for Social Commerce");
        Map<String, Object> status = new HashMap<>();
        status.put("service", "social-commerce");
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now());
        
        try {
            // Try to fetch a simple metric to verify connectivity
            getAnalyticsMetrics();
            status.put("health", "HEALTHY");
        } catch (Exception e) {
            status.put("health", "DEGRADED");
            status.put("error", e.getMessage());
        }
        
        return status;
    }
}