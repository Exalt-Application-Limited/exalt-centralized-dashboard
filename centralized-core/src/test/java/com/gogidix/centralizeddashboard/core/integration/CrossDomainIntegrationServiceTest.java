package com.gogidix.centralizeddashboard.core.integration;

import com.gogidix.centralizeddashboard.core.BaseUnitTest;
import com.gogidix.centralizeddashboard.core.model.DashboardMetric;
import com.gogidix.centralizeddashboard.core.model.DashboardMetric.SourceDomain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CrossDomainIntegrationServiceTest extends BaseUnitTest {

    @Mock
    private CourierServiceClient courierServiceClient;

    @Mock
    private SocialCommerceClient socialCommerceClient;

    @Mock
    private WarehousingClient warehousingClient;

    @InjectMocks
    private CrossDomainIntegrationService crossDomainIntegrationService;

    private Map<String, List<Map<String, Object>>> mockCourierData;
    private Map<String, Object> mockSocialCommerceData;
    private Map<String, Object> mockWarehousingData;

    @BeforeEach
    void setUp() {
        // Setup mock courier data
        mockCourierData = new HashMap<>();
        List<Map<String, Object>> hqMetrics = new ArrayList<>();
        hqMetrics.add(createMockMetric("total_shipments", 1500.0, "count"));
        hqMetrics.add(createMockMetric("on_time_delivery_rate", 95.5, "percent"));
        mockCourierData.put("hqAdmin", hqMetrics);

        List<Map<String, Object>> regionalMetrics = new ArrayList<>();
        regionalMetrics.add(createMockMetric("regional_shipments", 350.0, "count"));
        mockCourierData.put("regionalAdmin", regionalMetrics);

        // Setup mock social commerce data
        mockSocialCommerceData = new HashMap<>();
        mockSocialCommerceData.put("active_users", 1250);
        mockSocialCommerceData.put("engagement_rate", 4.8);
        mockSocialCommerceData.put("conversion_rate", 2.3);

        // Setup mock warehousing data
        mockWarehousingData = new HashMap<>();
        mockWarehousingData.put("inventory_count", 12500);
        mockWarehousingData.put("fulfillment_rate", 97.5);
    }

    @Test
    void fetchAllDomainMetrics_ShouldReturnCombinedMetrics() {
        // Given
        when(courierServiceClient.getAllCourierMetrics()).thenReturn(mockCourierData);
        when(socialCommerceClient.getAllSocialCommerceMetrics()).thenReturn(getMockSocialCommerceListData());
        when(warehousingClient.getAllWarehousingMetrics()).thenReturn(getMockWarehousingListData());

        // When
        List<DashboardMetric> result = crossDomainIntegrationService.fetchAllDomainMetrics();

        // Then
        assertNotNull(result);
        assertTrue(result.size() >= 5); // Should have at least 5 metrics total
        
        // Verify metrics from all domains are included
        assertTrue(result.stream().anyMatch(m -> m.getSourceDomain() == SourceDomain.COURIER_SERVICES));
        assertTrue(result.stream().anyMatch(m -> m.getSourceDomain() == SourceDomain.SOCIAL_COMMERCE));
        assertTrue(result.stream().anyMatch(m -> m.getSourceDomain() == SourceDomain.WAREHOUSING));
        
        // Verify all expected metrics are present
        assertTrue(containsMetric(result, "total_shipments"));
        assertTrue(containsMetric(result, "on_time_delivery_rate"));
        assertTrue(containsMetric(result, "regional_shipments"));
        assertTrue(containsMetric(result, "active_users"));
        assertTrue(containsMetric(result, "inventory_count"));
        
        verify(courierServiceClient, times(1)).getAllCourierMetrics();
        verify(socialCommerceClient, times(1)).getAllSocialCommerceMetrics();
        verify(warehousingClient, times(1)).getAllWarehousingMetrics();
    }

    @Test
    void fetchCourierServicesMetrics_ShouldTransformDataCorrectly() {
        // Given
        when(courierServiceClient.getAllCourierMetrics()).thenReturn(mockCourierData);

        // When
        List<DashboardMetric> result = crossDomainIntegrationService.fetchCourierServicesMetrics();

        // Then
        assertNotNull(result);
        assertEquals(3, result.size()); // 2 from HQ + 1 from Regional
        
        // Verify metric transformation
        DashboardMetric shipmentMetric = result.stream()
                .filter(m -> m.getMetricName().equals("total_shipments"))
                .findFirst()
                .orElseThrow();
                
        assertEquals(1500.0, shipmentMetric.getMetricValue());
        assertEquals("count", shipmentMetric.getMetricUnit());
        assertEquals(SourceDomain.COURIER_SERVICES, shipmentMetric.getSourceDomain());
        assertEquals("HQ Admin", shipmentMetric.getSourceService());
        
        verify(courierServiceClient, times(1)).getAllCourierMetrics();
    }

    @Test
    void fetchSocialCommerceMetrics_ShouldTransformDataCorrectly() {
        // Given
        when(socialCommerceClient.getAllSocialCommerceMetrics()).thenReturn(getMockSocialCommerceListData());

        // When
        List<DashboardMetric> result = crossDomainIntegrationService.fetchSocialCommerceMetrics();

        // Then
        assertNotNull(result);
        assertEquals(3, result.size());
        
        // Verify metric transformation
        DashboardMetric usersMetric = result.stream()
                .filter(m -> m.getMetricName().equals("active_users"))
                .findFirst()
                .orElseThrow();
                
        assertEquals(1250.0, usersMetric.getMetricValue());
        assertEquals("count", usersMetric.getMetricUnit());
        assertEquals(SourceDomain.SOCIAL_COMMERCE, usersMetric.getSourceDomain());
        
        verify(socialCommerceClient, times(1)).getAllSocialCommerceMetrics();
    }

    @Test
    void fetchWarehousingMetrics_ShouldTransformDataCorrectly() {
        // Given
        when(warehousingClient.getAllWarehousingMetrics()).thenReturn(getMockWarehousingListData());

        // When
        List<DashboardMetric> result = crossDomainIntegrationService.fetchWarehousingMetrics();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        
        // Verify metric transformation
        DashboardMetric inventoryMetric = result.stream()
                .filter(m -> m.getMetricName().equals("inventory_count"))
                .findFirst()
                .orElseThrow();
                
        assertEquals(12500.0, inventoryMetric.getMetricValue());
        assertEquals("count", inventoryMetric.getMetricUnit());
        assertEquals(SourceDomain.WAREHOUSING, inventoryMetric.getSourceDomain());
        
        verify(warehousingClient, times(1)).getAllWarehousingMetrics();
    }

    @Test
    void getDomainStatus_ShouldReturnStatusFromAllDomains() {
        // Given - Mock the actual methods that getDomainStatus() calls
        when(courierServiceClient.getHqAdminMetrics()).thenReturn(new ArrayList<>());
        when(socialCommerceClient.getAnalyticsMetrics()).thenReturn(new ArrayList<>());
        when(warehousingClient.getInventoryMetrics()).thenThrow(new RuntimeException("Service down"));

        // When
        Map<String, String> statusMap = crossDomainIntegrationService.getDomainStatus();

        // Then
        assertNotNull(statusMap);
        assertEquals(3, statusMap.size());
        assertEquals("UP", statusMap.get("courierServices"));
        assertEquals("UP", statusMap.get("socialCommerce"));
        assertEquals("DOWN", statusMap.get("warehousing"));
        
        verify(courierServiceClient, times(1)).getHqAdminMetrics();
        verify(socialCommerceClient, times(1)).getAnalyticsMetrics();
        verify(warehousingClient, times(1)).getInventoryMetrics();
    }

    @Test
    void fetchAllDomainMetrics_ShouldHandleClientErrorsGracefully() {
        // Given
        when(courierServiceClient.getAllCourierMetrics()).thenThrow(new RuntimeException("Service unavailable"));
        when(socialCommerceClient.getAllSocialCommerceMetrics()).thenReturn(getMockSocialCommerceListData());
        when(warehousingClient.getAllWarehousingMetrics()).thenReturn(getMockWarehousingListData());

        // When
        List<DashboardMetric> result = crossDomainIntegrationService.fetchAllDomainMetrics();

        // Then - Should still return metrics from working services
        assertNotNull(result);
        assertFalse(result.isEmpty());
        
        // Verify metrics from working services are included
        assertTrue(result.stream().anyMatch(m -> m.getSourceDomain() == SourceDomain.SOCIAL_COMMERCE));
        assertTrue(result.stream().anyMatch(m -> m.getSourceDomain() == SourceDomain.WAREHOUSING));
        
        // Verify error was logged (would need a test appender to verify this)
        // Log verification is typically done with a test appender if needed
    }

    private Map<String, Object> createMockMetric(String name, Object value, String unit) {
        Map<String, Object> metric = new HashMap<>();
        metric.put("metricName", name);
        metric.put("metricValue", value);
        metric.put("metricUnit", unit);
        return metric;
    }
    
    private boolean containsMetric(List<DashboardMetric> metrics, String metricName) {
        return metrics.stream().anyMatch(m -> m.getMetricName().equals(metricName));
    }
    
    private Map<String, List<Map<String, Object>>> getMockSocialCommerceListData() {
        Map<String, List<Map<String, Object>>> data = new HashMap<>();
        List<Map<String, Object>> analyticsMetrics = new ArrayList<>();
        analyticsMetrics.add(createMockMetric("active_users", 1250.0, "count"));
        analyticsMetrics.add(createMockMetric("engagement_rate", 4.8, "percent"));
        analyticsMetrics.add(createMockMetric("conversion_rate", 2.3, "percent"));
        data.put("analytics", analyticsMetrics);
        data.put("engagement", new ArrayList<>());
        data.put("sales", new ArrayList<>());
        return data;
    }
    
    private Map<String, List<Map<String, Object>>> getMockWarehousingListData() {
        Map<String, List<Map<String, Object>>> data = new HashMap<>();
        List<Map<String, Object>> inventoryMetrics = new ArrayList<>();
        inventoryMetrics.add(createMockMetric("inventory_count", 12500.0, "count"));
        inventoryMetrics.add(createMockMetric("fulfillment_rate", 97.5, "percent"));
        data.put("inventory", inventoryMetrics);
        data.put("operations", new ArrayList<>());
        data.put("fulfillment", new ArrayList<>());
        return data;
    }
    
    private Map<String, Object> createServiceStatusMap(String status) {
        Map<String, Object> serviceStatus = new HashMap<>();
        serviceStatus.put("status", status);
        serviceStatus.put("health", status.equals("UP") ? "HEALTHY" : "DEGRADED");
        return serviceStatus;
    }
}
