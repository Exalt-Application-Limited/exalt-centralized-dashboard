package com.gogidix.centralizeddashboard.core.controller;

import com.gogidix.centralizeddashboard.core.BaseIntegrationTest;
import com.gogidix.centralizeddashboard.core.TestUtils;
import com.gogidix.centralizeddashboard.core.dto.CrossDomainSummaryDto;
import com.gogidix.centralizeddashboard.core.dto.DashboardMetricDto;
import com.gogidix.centralizeddashboard.core.dto.DomainHealthDto;
import com.gogidix.centralizeddashboard.core.integration.CrossDomainIntegrationService;
import com.gogidix.centralizeddashboard.core.model.DashboardMetric;
import com.gogidix.centralizeddashboard.core.service.CrossDomainDashboardService;
import com.gogidix.centralizeddashboard.core.service.MetricCollectorService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
@WithMockUser(username = "test-user", roles = {"ADMIN"})
class CrossDomainControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CrossDomainIntegrationService crossDomainIntegrationService;

    @MockBean
    private MetricCollectorService metricCollectorService;

    @MockBean
    private CrossDomainDashboardService crossDomainDashboardService;

    private DashboardMetric testMetric;
    private DashboardMetricDto testMetricDto;

    @BeforeEach
    void setUp() {
        // Setup test data
        testMetric = DashboardMetric.builder()
                .id(1L)
                .metricName("test_metric")
                .metricValue(100.0)
                .metricUnit("count")
                .sourceDomain(DashboardMetric.SourceDomain.SOCIAL_COMMERCE)
                .sourceService("test-service")
                .timestamp(LocalDateTime.now())
                .build();

        testMetricDto = DashboardMetricDto.builder()
                .id(1L)
                .metricName("test_metric")
                .metricValue(100.0)
                .metricUnit("count")
                .sourceDomain("SOCIAL_COMMERCE")
                .sourceService("test-service")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Test
    void collectAllDomainMetrics_ShouldReturnCollectedMetrics() throws Exception {
        // Given
        when(crossDomainIntegrationService.fetchAllDomainMetrics())
                .thenReturn(Arrays.asList(testMetric));
        doNothing().when(metricCollectorService).saveMetric(any(DashboardMetric.class));

        // When & Then
        mockMvc.perform(post("/api/dashboard/cross-domain/metrics/collect")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].metricName", is("test_metric")));

        verify(crossDomainIntegrationService, times(1)).fetchAllDomainMetrics();
        verify(metricCollectorService, times(1)).saveMetric(any(DashboardMetric.class));
    }

    @Test
    void getDomainStatus_ShouldReturnDomainStatus() throws Exception {
        // Given
        Map<String, String> statusMap = new HashMap<>();
        statusMap.put("SOCIAL_COMMERCE", "UP");
        statusMap.put("WAREHOUSING", "UP");
        statusMap.put("COURIER_SERVICES", "DOWN");
        
        when(crossDomainIntegrationService.getDomainStatus()).thenReturn(statusMap);

        // When & Then
        mockMvc.perform(get("/api/dashboard/cross-domain/status")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.SOCIAL_COMMERCE", is("UP")))
                .andExpect(jsonPath("$.WAREHOUSING", is("UP")))
                .andExpect(jsonPath("$.COURIER_SERVICES", is("DOWN")));
    }

    @Test
    void collectDomainMetrics_WithValidDomain_ShouldReturnMetrics() throws Exception {
        // Given
        when(crossDomainIntegrationService.fetchSocialCommerceMetrics())
                .thenReturn(Arrays.asList(testMetric));
        doNothing().when(metricCollectorService).saveMetric(any(DashboardMetric.class));

        // When & Then
        mockMvc.perform(post("/api/dashboard/cross-domain/metrics/collect/social")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].sourceDomain", is("SOCIAL_COMMERCE")));

        verify(crossDomainIntegrationService, times(1)).fetchSocialCommerceMetrics();
        verify(metricCollectorService, times(1)).saveMetric(any(DashboardMetric.class));
    }

    @Test
    void collectDomainMetrics_WithInvalidDomain_ShouldReturnBadRequest() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/dashboard/cross-domain/metrics/collect/invalid")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getCrossDomainSummary_ShouldReturnSummary() throws Exception {
        // Given
        CrossDomainSummaryDto summaryDto = CrossDomainSummaryDto.builder()
                .totalMetrics(150)
                .lastUpdated(LocalDateTime.now().toString())
                .domainHealth(Arrays.asList(
                        DomainHealthDto.builder().domainName("SOCIAL_COMMERCE").status("HEALTHY").healthScore(90).build(),
                        DomainHealthDto.builder().domainName("WAREHOUSING").status("DEGRADED").healthScore(70).build(),
                        DomainHealthDto.builder().domainName("COURIER_SERVICES").status("UNHEALTHY").healthScore(40).build()
                ))
                .build();

        when(crossDomainDashboardService.getCrossDomainSummary()).thenReturn(summaryDto);

        // When & Then
        mockMvc.perform(get("/api/dashboard/cross-domain/summary")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalMetrics", is(150)))
                .andExpect(jsonPath("$.domainHealth", hasSize(3)))
                .andExpect(jsonPath("$.domainHealth[0].domainName", is("SOCIAL_COMMERCE")))
                .andExpect(jsonPath("$.domainHealth[0].status", is("HEALTHY")))
                .andExpect(jsonPath("$.domainHealth[1].domainName", is("WAREHOUSING")))
                .andExpect(jsonPath("$.domainHealth[1].status", is("DEGRADED")))
                .andExpect(jsonPath("$.domainHealth[2].domainName", is("COURIER_SERVICES")))
                .andExpect(jsonPath("$.domainHealth[2].status", is("UNHEALTHY")));
    }

    @Test
    void getDomainHealth_ShouldReturnHealthStatus() throws Exception {
        // Given
        when(crossDomainDashboardService.getDomainHealth("social"))
                .thenReturn("HEALTHY");

        // When & Then
        mockMvc.perform(get("/api/dashboard/cross-domain/health/social")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("HEALTHY"));
    }

    @Test
    void getDomainMetrics_ShouldReturnDomainMetrics() throws Exception {
        // Given
        when(crossDomainDashboardService.getDomainMetrics("social"))
                .thenReturn(Arrays.asList(testMetricDto));

        // When & Then
        mockMvc.perform(get("/api/dashboard/cross-domain/metrics/social")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].sourceDomain", is("SOCIAL_COMMERCE")));
    }
}
