package com.exalt.centralizeddashboard.core.security;

import com.exalt.centralizeddashboard.core.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Security authentication and authorization tests for the centralized dashboard
 */
@AutoConfigureMockMvc
public class SecurityAuthenticationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Should allow access to whitelist URLs without authentication")
    public void testWhitelistedEndpoints() throws Exception {
        // Test access to Swagger UI
        mockMvc.perform(get("/swagger-ui.html")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Test access to health endpoint
        mockMvc.perform(get("/actuator/health")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should deny access to protected endpoints without authentication")
    public void testProtectedEndpointsWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/dashboard/metrics")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should allow access to admin endpoints with ADMIN role")
    public void testAdminEndpointsWithAdminRole() throws Exception {
        mockMvc.perform(get("/api/dashboard/admin/settings")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should deny access to admin endpoints without ADMIN role")
    public void testAdminEndpointsWithNonAdminRole() throws Exception {
        mockMvc.perform(get("/api/dashboard/admin/settings")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_MANAGER")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should allow access to metrics with ADMIN role")
    public void testMetricsWithAdminRole() throws Exception {
        mockMvc.perform(get("/api/dashboard/metrics/system")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should allow access to metrics with ANALYST role")
    public void testMetricsWithAnalystRole() throws Exception {
        mockMvc.perform(get("/api/dashboard/metrics/system")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ANALYST")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should allow access to reports with MANAGER role")
    public void testReportsWithManagerRole() throws Exception {
        mockMvc.perform(get("/api/dashboard/reports/sales")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_MANAGER")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should validate JWT token expiration")
    public void testJwtTokenExpiration() throws Exception {
        mockMvc.perform(get("/api/dashboard/metrics/system")
                .with(jwt().jwt(builder -> builder.expiresAt(
                        java.time.Instant.now().minusSeconds(3600)))
                        .authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
