package com.exalt.centralizeddashboard.core.service;

import com.exalt.centralizeddashboard.core.model.DashboardKPI;
import com.exalt.centralizeddashboard.core.model.DashboardMetric;
import com.exalt.centralizeddashboard.core.repository.DashboardKPIRepository;
import com.exalt.centralizeddashboard.core.repository.DashboardMetricRepository;
import com.exalt.centralizeddashboard.core.service.impl.KPIServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KPIServiceImplTest {

    @Mock
    private DashboardKPIRepository kpiRepository;

    @Mock
    private DashboardMetricRepository metricRepository;

    @InjectMocks
    private KPIServiceImpl kpiService;

    private DashboardKPI testKPI;
    private DashboardMetric testMetric;

    @BeforeEach
    void setUp() {
        // Setup test data
        testKPI = DashboardKPI.builder()
                .id(1L)
                .kpiName("Test KPI")
                .kpiValue(85.5)
                .kpiUnit("%")
                .targetValue(90.0)
                .minThreshold(70.0)
                .maxThreshold(100.0)
                .kpiStatus(DashboardKPI.KPIStatus.WARNING)
                .kpiCategory(DashboardKPI.KPICategory.OPERATIONAL)
                .calculationFormula("SUM(value)/COUNT(*)")
                .calculationPeriod(DashboardKPI.CalculationPeriod.DAILY)
                .timestamp(LocalDateTime.now())
                .region("Global")
                .description("Test KPI Description")
                .build();

        testMetric = DashboardMetric.builder()
                .id(1L)
                .metricName("Test Metric")
                .metricValue(85.5)
                .metricUnit("%")
                .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                .sourceService("test-service")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Test
    void calculateAllKPIs_ShouldCalculateAllCategories() {
        // Given - Mock metrics that KPIs depend on
        DashboardMetric revenueMetric = DashboardMetric.builder()
                .id(1L)
                .metricName("revenue")
                .metricValue(500000.0)
                .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                .timestamp(LocalDateTime.now())
                .build();

        DashboardMetric deliverySuccessMetric = DashboardMetric.builder()
                .id(2L)
                .metricName("global_delivery_success_rate")
                .metricValue(95.5)
                .sourceDomain(DashboardMetric.SourceDomain.COURIER_SERVICES)
                .timestamp(LocalDateTime.now())
                .build();

        // Mock all metric queries to return appropriate data or empty lists
        // Financial KPIs
        when(metricRepository.findByMetricNameAndSourceDomain("revenue", DashboardMetric.SourceDomain.COURIER_SERVICES))
                .thenReturn(Collections.singletonList(revenueMetric));
        when(metricRepository.findByMetricNameAndSourceDomain("operational_cost", DashboardMetric.SourceDomain.COURIER_SERVICES))
                .thenReturn(Collections.emptyList());
        
        // Operational KPIs
        when(metricRepository.findByMetricNameAndSourceDomain("global_delivery_success_rate", DashboardMetric.SourceDomain.COURIER_SERVICES))
                .thenReturn(Collections.singletonList(deliverySuccessMetric));
        when(metricRepository.findByMetricNameAndSourceDomain("global_average_delivery_time", DashboardMetric.SourceDomain.COURIER_SERVICES))
                .thenReturn(Collections.emptyList());
        
        // Efficiency KPIs
        when(metricRepository.findByMetricNameAndSourceDomain("global_courier_utilization", DashboardMetric.SourceDomain.COURIER_SERVICES))
                .thenReturn(Collections.singletonList(deliverySuccessMetric));
        when(metricRepository.findByMetricNameAndSourceDomain("driver_efficiency", DashboardMetric.SourceDomain.COURIER_SERVICES))
                .thenReturn(Collections.emptyList());
        
        // Quality KPIs
        when(metricRepository.findByMetricNameAndSourceDomain("local_on_time_delivery", DashboardMetric.SourceDomain.COURIER_SERVICES))
                .thenReturn(Collections.singletonList(deliverySuccessMetric));
        
        // Sustainability KPIs
        when(metricRepository.findByMetricNameAndSourceDomain("fuel_consumption_rate", DashboardMetric.SourceDomain.COURIER_SERVICES))
                .thenReturn(Collections.singletonList(revenueMetric));
        
        // Mock saveAll to return saved KPIs
        when(kpiRepository.saveAll(any())).thenReturn(Collections.singletonList(testKPI));

        // When
        int count = kpiService.calculateAllKPIs();

        // Then
        assertTrue(count > 0, "Should calculate at least one KPI");
        verify(kpiRepository, atLeastOnce()).saveAll(any());
    }

    @Test
    void getKPIsByCategory_ShouldReturnKPIsForCategory() {
        // Given
        DashboardKPI.KPICategory category = DashboardKPI.KPICategory.OPERATIONAL;
        // Note: The service actually calls findByKpiCategory, not findByKpiCategoryOrderByTimestampDesc
        when(kpiRepository.findByKpiCategory(category))
                .thenReturn(Collections.singletonList(testKPI));

        // When
        List<DashboardKPI> result = kpiService.getKPIsByCategory(category);

        // Then
        assertNotNull(result, "Result should not be null");
        assertFalse(result.isEmpty(), "Result should not be empty");
        assertEquals(1, result.size(), "Should return one KPI");
        assertEquals(category, result.get(0).getKpiCategory(), "Should return KPIs for the specified category");
    }

    @Test
    void getKPIsNeedingAttention_ShouldReturnKPIsNeedingAttention() {
        // Given - The service calls findKPIsBelowThreshold and findKPIsAboveThreshold, not findByKpiStatusIn
        when(kpiRepository.findKPIsBelowThreshold()).thenReturn(Collections.singletonList(testKPI));
        when(kpiRepository.findKPIsAboveThreshold()).thenReturn(Collections.emptyList());

        // When
        List<DashboardKPI> result = kpiService.getKPIsNeedingAttention();

        // Then
        assertNotNull(result, "Result should not be null");
        assertFalse(result.isEmpty(), "Should return KPIs needing attention");
        assertEquals(1, result.size(), "Should return one KPI needing attention");
    }

    @Test
    void getLatestKPI_ShouldReturnLatestKPI() {
        // Given
        String kpiName = "Test KPI";
        // Note: The service actually calls findFirstByKpiNameOrderByTimestampDesc, not findTopByKpiNameOrderByTimestampDesc
        when(kpiRepository.findFirstByKpiNameOrderByTimestampDesc(kpiName))
                .thenReturn(Optional.of(testKPI));

        // When
        Optional<DashboardKPI> result = kpiService.getLatestKPI(kpiName);

        // Then
        assertTrue(result.isPresent(), "Should return a KPI");
        assertEquals(kpiName, result.get().getKpiName(), "Should return the correct KPI");
    }

    @Test
    void saveKPI_ShouldSaveAndReturnKPI() {
        // Given
        when(kpiRepository.save(any(DashboardKPI.class))).thenReturn(testKPI);

        // When
        DashboardKPI result = kpiService.saveKPI(testKPI);

        // Then
        assertNotNull(result, "Saved KPI should not be null");
        assertEquals(testKPI.getKpiName(), result.getKpiName(), "Should save and return the KPI");
        verify(kpiRepository, times(1)).save(testKPI);
    }

    @Test
    void deleteKPI_ShouldDeleteKPI() {
        // Given
        Long kpiId = 1L;
        doNothing().when(kpiRepository).deleteById(kpiId);

        // When
        boolean result = kpiService.deleteKPI(kpiId);

        // Then
        assertTrue(result, "Should return true when deletion is successful");
        verify(kpiRepository, times(1)).deleteById(kpiId);
    }

    @Test
    void deleteKPI_WhenKpiNotExists_ShouldReturnFalse() {
        // Given
        Long kpiId = 999L;
        // The service doesn't check existsById, it catches exceptions from deleteById
        // So we need to make deleteById throw an exception to simulate a non-existent KPI
        doThrow(new RuntimeException("KPI not found")).when(kpiRepository).deleteById(kpiId);

        // When
        boolean result = kpiService.deleteKPI(kpiId);

        // Then
        assertFalse(result, "Should return false when deletion fails");
        verify(kpiRepository, times(1)).deleteById(kpiId);
    }
}
