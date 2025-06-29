package com.exalt.centralizeddashboard.core.performance;

import com.exalt.centralizeddashboard.core.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Performance tests for the centralized dashboard API endpoints.
 * These tests measure response times under various load conditions.
 */
@AutoConfigureMockMvc
@Tag("performance")
public class ApiPerformanceTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final int CONCURRENT_USERS = 50;
    private static final long MAX_RESPONSE_TIME_MS = 500; // 500ms maximum acceptable response time

    @Test
    @DisplayName("Dashboard metrics endpoint should handle concurrent requests efficiently")
    public void testMetricsEndpointPerformance() throws Exception {
        // Single request benchmark first
        Instant start = Instant.now();
        mockMvc.perform(get("/api/dashboard/metrics/summary")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
        Duration singleRequestDuration = Duration.between(start, Instant.now());
        
        System.out.println("Single request duration: " + singleRequestDuration.toMillis() + "ms");
        
        // Test concurrent requests
        ExecutorService executorService = Executors.newFixedThreadPool(CONCURRENT_USERS);
        List<CompletableFuture<Long>> futures = new ArrayList<>();
        
        for (int i = 0; i < CONCURRENT_USERS; i++) {
            CompletableFuture<Long> future = CompletableFuture.supplyAsync(() -> {
                try {
                    Instant requestStart = Instant.now();
                    mockMvc.perform(get("/api/dashboard/metrics/summary")
                            .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                            .contentType(MediaType.APPLICATION_JSON))
                            .andExpect(status().isOk());
                    return Duration.between(requestStart, Instant.now()).toMillis();
                } catch (Exception e) {
                    e.printStackTrace();
                    return -1L;
                }
            }, executorService);
            
            futures.add(future);
        }
        
        // Wait for all requests to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        
        // Calculate average response time
        double averageResponseTime = futures.stream()
                .mapToLong(CompletableFuture::join)
                .filter(time -> time > 0)
                .average()
                .orElse(0);
        
        System.out.println("Average response time under load (" + CONCURRENT_USERS + " concurrent users): " 
                + averageResponseTime + "ms");
        
        // Assert that the average response time is within acceptable limits
        assertTrue(averageResponseTime < MAX_RESPONSE_TIME_MS, 
                "Average response time " + averageResponseTime + "ms exceeds maximum acceptable time of " + MAX_RESPONSE_TIME_MS + "ms");
        
        executorService.shutdown();
    }
    
    @Test
    @DisplayName("Real-time data endpoint should handle high request rates")
    public void testRealTimeDataEndpointPerformance() throws Exception {
        ExecutorService executorService = Executors.newFixedThreadPool(CONCURRENT_USERS);
        List<CompletableFuture<Long>> futures = new ArrayList<>();
        
        for (int i = 0; i < CONCURRENT_USERS; i++) {
            CompletableFuture<Long> future = CompletableFuture.supplyAsync(() -> {
                try {
                    Instant requestStart = Instant.now();
                    mockMvc.perform(get("/api/dashboard/realtime/data")
                            .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                            .contentType(MediaType.APPLICATION_JSON))
                            .andExpect(status().isOk());
                    return Duration.between(requestStart, Instant.now()).toMillis();
                } catch (Exception e) {
                    e.printStackTrace();
                    return -1L;
                }
            }, executorService);
            
            futures.add(future);
        }
        
        // Wait for all requests to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        
        // Calculate average response time
        double averageResponseTime = futures.stream()
                .mapToLong(CompletableFuture::join)
                .filter(time -> time > 0)
                .average()
                .orElse(0);
        
        System.out.println("Real-time data endpoint average response time under load: " + averageResponseTime + "ms");
        
        // Assert that the average response time is within acceptable limits
        assertTrue(averageResponseTime < MAX_RESPONSE_TIME_MS, 
                "Real-time data endpoint average response time " + averageResponseTime + 
                "ms exceeds maximum acceptable time of " + MAX_RESPONSE_TIME_MS + "ms");
        
        executorService.shutdown();
    }

    @Test
    @DisplayName("Dashboard should handle sustained load over time")
    public void testSustainedLoad() throws Exception {
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        List<CompletableFuture<Double>> futures = new ArrayList<>();
        
        // Run 10 sequences of 20 requests each
        for (int i = 0; i < 10; i++) {
            final int sequence = i;
            CompletableFuture<Double> future = CompletableFuture.supplyAsync(() -> {
                try {
                    List<Long> responseTimes = new ArrayList<>();
                    
                    for (int j = 0; j < 20; j++) {
                        Instant requestStart = Instant.now();
                        mockMvc.perform(get("/api/dashboard/metrics/summary")
                                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk());
                        
                        long responseTime = Duration.between(requestStart, Instant.now()).toMillis();
                        responseTimes.add(responseTime);
                        
                        // Small delay between requests
                        Thread.sleep(100);
                    }
                    
                    double avgTime = responseTimes.stream().mapToLong(Long::valueOf).average().orElse(0);
                    System.out.println("Sequence " + sequence + " average response time: " + avgTime + "ms");
                    return avgTime;
                    
                } catch (Exception e) {
                    e.printStackTrace();
                    return -1.0;
                }
            }, executorService);
            
            futures.add(future);
        }
        
        // Wait for all sequences to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        
        // Calculate overall average response time
        double overallAverage = futures.stream()
                .mapToDouble(CompletableFuture::join)
                .filter(time -> time > 0)
                .average()
                .orElse(0);
        
        System.out.println("Overall average response time under sustained load: " + overallAverage + "ms");
        
        // Verify performance is consistent across all sequences
        boolean performanceConsistent = futures.stream()
                .mapToDouble(CompletableFuture::join)
                .filter(time -> time > 0)
                .allMatch(time -> time < MAX_RESPONSE_TIME_MS);
        
        assertTrue(performanceConsistent, "Performance degraded under sustained load");
        executorService.shutdown();
    }
}
