package com.exalt.centralizeddashboard.core.controller;

import com.exalt.centralizeddashboard.core.BaseIntegrationTest;
import com.exalt.centralizeddashboard.core.TestUtils;
import com.exalt.centralizeddashboard.core.dto.DashboardKPIDto;
import com.exalt.centralizeddashboard.core.model.DashboardKPI;
import com.exalt.centralizeddashboard.core.model.DashboardMetric;
import com.exalt.centralizeddashboard.core.service.KPIService;
import com.exalt.centralizeddashboard.core.service.MetricCollectorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
@WithMockUser(username = "test-user", roles = {"ADMIN"})
class DashboardControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private KPIService kpiService;

    @MockBean
    private MetricCollectorService metricCollectorService;

    private DashboardKPI testKPI;
    private DashboardKPIDto testKPIDto;

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

        testKPIDto = DashboardKPIDto.builder()
                .id(1L)
                .kpiName("Test KPI")
                .kpiValue(85.5)
                .kpiUnit("%")
                .targetValue(90.0)
                .minThreshold(70.0)
                .maxThreshold(100.0)
                .kpiStatus("WARNING")
                .kpiCategory("OPERATIONAL")
                .calculationFormula("SUM(value)/COUNT(*)")
                .calculationPeriod("DAILY")
                .timestamp(LocalDateTime.now())
                .region("Global")
                .description("Test KPI Description")
                .build();
    }

    @Test
    @WithMockUser(username = "test-user", roles = {"ADMIN"})
    void getDashboardSummary_ShouldReturnDashboardSummary() throws Exception {
        // Mock service responses
        when(kpiService.getKPIsNeedingAttention())
                .thenReturn(Collections.singletonList(testKPI));
        when(kpiService.getKPIsByCategory(any(DashboardKPI.KPICategory.class)))
                .thenReturn(Collections.singletonList(testKPI));
        
        Map<DashboardMetric.SourceDomain, Integer> collectionResult = new HashMap<>();
        collectionResult.put(DashboardMetric.SourceDomain.SOCIAL_COMMERCE, 5);
        collectionResult.put(DashboardMetric.SourceDomain.WAREHOUSING, 3);
        collectionResult.put(DashboardMetric.SourceDomain.COURIER_SERVICES, 4);
        when(metricCollectorService.collectAllDomainMetrics())
                .thenReturn(collectionResult);

        // Perform request and verify response
        mockMvc.perform(get("/api/dashboard/summary")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attentionKPIs", hasSize(1)))
                .andExpect(jsonPath("$.attentionKPIs[0].kpiName", is("Test KPI")))
                .andExpect(jsonPath("$.kpisByCategory.OPERATIONAL", hasSize(1)))
                .andExpect(jsonPath("$.metricsCollected.SOCIAL_COMMERCE", is(5)))
                .andExpect(jsonPath("$.metricsCollected.WAREHOUSING", is(3)))
                .andExpect(jsonPath("$.metricsCollected.COURIER_SERVICES", is(4)));
    }

    @Test
    @WithMockUser(username = "test-user", roles = {"ADMIN"})
    void getCourierServicesDashboard_ShouldReturnCourierServicesData() throws Exception {
        // Mock service responses
        when(metricCollectorService.collectCourierServicesMetrics())
                .thenReturn(Collections.emptyList());

        // Perform request and verify response
        mockMvc.perform(get("/api/dashboard/courier-services")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metricsByService", is(notNullValue())));
    }

    @Test
    @WithMockUser(username = "test-user", roles = {"ADMIN"})
    void getDashboardSummary_WhenNoData_ShouldReturnEmptyCollections() throws Exception {
        // Mock empty service responses
        when(kpiService.getKPIsNeedingAttention()).thenReturn(Collections.emptyList());
        when(kpiService.getKPIsByCategory(any(DashboardKPI.KPICategory.class))).thenReturn(Collections.emptyList());
        when(metricCollectorService.collectAllDomainMetrics()).thenReturn(Collections.emptyMap());

        // Perform request and verify response
        mockMvc.perform(get("/api/dashboard/summary")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attentionKPIs", hasSize(0)))
                .andExpect(jsonPath("$.kpisByCategory", is(notNullValue())))
                .andExpect(jsonPath("$.metricsCollected", is(notNullValue())));
    }
}
