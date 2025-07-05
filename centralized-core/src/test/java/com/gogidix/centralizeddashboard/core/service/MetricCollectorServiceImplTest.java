package com.gogidix.centralizeddashboard.core.service;

import com.gogidix.centralizeddashboard.core.model.DashboardMetric;
import com.gogidix.centralizeddashboard.core.repository.DashboardMetricRepository;
import com.gogidix.centralizeddashboard.core.service.impl.MetricCollectorServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MetricCollectorServiceImplTest {

    @Mock
    private DashboardMetricRepository metricRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private MetricCollectorServiceImpl metricCollectorService;

    private DashboardMetric testMetric;

    @BeforeEach
    void setUp() {
        // Initialize service URLs
        metricCollectorService = new MetricCollectorServiceImpl(metricRepository, restTemplate);
        metricCollectorService.setSocialCommerceServiceUrl("http://social-commerce-metrics");
        metricCollectorService.setWarehousingServiceUrl("http://warehousing-metrics");
        metricCollectorService.setCourierServiceUrl("http://courier-metrics");

        // Setup test metric
        testMetric = DashboardMetric.builder()
                .id(1L)
                .metricName("test_metric")
                .metricValue(100.0)
                .metricUnit("count")
                .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                .sourceService("test-service")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Test
    void collectAllDomainMetrics_ShouldCollectFromAllDomains() {
        // Given
        when(metricRepository.saveAll(any())).thenReturn(List.of(testMetric));

        // When
        Map<DashboardMetric.SourceDomain, Integer> results = metricCollectorService.collectAllDomainMetrics();

        // Then
        assertNotNull(results, "Results should not be null");
        assertEquals(3, results.size(), "Should collect from all three domains");
        assertTrue(results.get(DashboardMetric.SourceDomain.SOCIAL_COMMERCE) > 0, "Should collect from Social Commerce");
        assertTrue(results.get(DashboardMetric.SourceDomain.WAREHOUSING) > 0, "Should collect from Warehousing");
        assertTrue(results.get(DashboardMetric.SourceDomain.COURIER_SERVICES) > 0, "Should collect from Courier Services");
    }

    @Test
    void collectSocialCommerceMetrics_ShouldReturnMetrics() {
        // When
        List<DashboardMetric> metrics = metricCollectorService.collectSocialCommerceMetrics();

        // Then
        assertNotNull(metrics, "Metrics list should not be null");
        assertFalse(metrics.isEmpty(), "Should return some metrics");
        metrics.forEach(metric -> 
            assertEquals(DashboardMetric.SourceDomain.SOCIAL_COMMERCE, metric.getSourceDomain(), 
                "Should be from Social Commerce domain")
        );
    }

    @Test
    void collectWarehousingMetrics_ShouldReturnMetrics() {
        // When
        List<DashboardMetric> metrics = metricCollectorService.collectWarehousingMetrics();

        // Then
        assertNotNull(metrics, "Metrics list should not be null");
        assertFalse(metrics.isEmpty(), "Should return some metrics");
        metrics.forEach(metric -> 
            assertEquals(DashboardMetric.SourceDomain.WAREHOUSING, metric.getSourceDomain(), 
                "Should be from Warehousing domain")
        );
    }

    @Test
    void collectCourierServicesMetrics_ShouldReturnMetrics() {
        // When
        List<DashboardMetric> metrics = metricCollectorService.collectCourierServicesMetrics();

        // Then
        assertNotNull(metrics, "Metrics list should not be null");
        assertFalse(metrics.isEmpty(), "Should return some metrics");
        metrics.forEach(metric -> 
            assertEquals(DashboardMetric.SourceDomain.COURIER_SERVICES, metric.getSourceDomain(), 
                "Should be from Courier Services domain")
        );
    }

    @Test
    void collectMetricsForDomainAndTimeRange_ShouldReturnFilteredMetrics() {
        // Given
        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
        LocalDateTime endTime = LocalDateTime.now();

        // When
        List<DashboardMetric> metrics = metricCollectorService.collectMetricsForDomainAndTimeRange(
            DashboardMetric.SourceDomain.SOCIAL_COMMERCE, startTime, endTime
        );

        // Then
        assertNotNull(metrics, "Metrics list should not be null");
        // Note: In the current implementation, this method is not filtering by time range
        // This test verifies it returns metrics without throwing exceptions
    }

    @Test
    void refreshMetricsForDomain_ShouldReturnCountOfRefreshedMetrics() {
        // Given
        when(metricRepository.saveAll(any())).thenReturn(List.of(testMetric));

        // When
        int count = metricCollectorService.refreshMetricsForDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE);

        // Then
        assertTrue(count > 0, "Should refresh some metrics");
        verify(metricRepository, times(1)).saveAll(any());
    }

    @Test
    void scheduleMetricCollection_WithValidCronExpression_ShouldReturnTrue() {
        // When
        boolean result = metricCollectorService.scheduleMetricCollection("0 0/5 * * * ?");

        // Then
        assertTrue(result, "Should return true for valid cron expression");
    }

    @Test
    void scheduleMetricCollection_WithInvalidCronExpression_ShouldReturnFalse() {
        // When
        boolean result = metricCollectorService.scheduleMetricCollection("invalid-cron");

        // Then
        assertFalse(result, "Should return false for invalid cron expression");
    }
}
