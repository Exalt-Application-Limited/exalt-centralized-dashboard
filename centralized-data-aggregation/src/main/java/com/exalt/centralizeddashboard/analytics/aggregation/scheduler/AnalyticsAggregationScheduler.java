package com.exalt.centralizeddashboard.analytics.aggregation.scheduler;

import com.exalt.centralizeddashboard.analytics.aggregation.service.AnalyticsService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Scheduler for periodic analytics data aggregation
 */
@Component
public class AnalyticsAggregationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsAggregationScheduler.class);
    
    private final AnalyticsService analyticsService;
    
    @Autowired
    public AnalyticsAggregationScheduler(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }
    
    /**
     * Run hourly aggregation job
     * Aggregates data from the previous hour
     */
    @Scheduled(cron = "0 0 * * * ?") // Run at the top of every hour
    public void runHourlyAggregation() {
        logger.info("Running hourly analytics aggregation");
        
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusHours(1);
        
        try {
            analyticsService.performDataAggregation(start, end);
            logger.info("Hourly analytics aggregation completed successfully");
        } catch (Exception e) {
            logger.error("Error running hourly analytics aggregation: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Run daily aggregation job
     * Aggregates data from the previous day
     */
    @Scheduled(cron = "0 5 0 * * ?") // Run at 00:05 every day
    public void runDailyAggregation() {
        logger.info("Running daily analytics aggregation");
        
        LocalDateTime end = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime start = end.minusDays(1);
        
        try {
            analyticsService.performDataAggregation(start, end);
            logger.info("Daily analytics aggregation completed successfully");
        } catch (Exception e) {
            logger.error("Error running daily analytics aggregation: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Run weekly aggregation job
     * Aggregates data from the previous week
     */
    @Scheduled(cron = "0 15 0 ? * MON") // Run at 00:15 every Monday
    public void runWeeklyAggregation() {
        logger.info("Running weekly analytics aggregation");
        
        LocalDateTime end = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime start = end.minusDays(7);
        
        try {
            analyticsService.performDataAggregation(start, end);
            logger.info("Weekly analytics aggregation completed successfully");
        } catch (Exception e) {
            logger.error("Error running weekly analytics aggregation: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Run monthly aggregation job
     * Aggregates data from the previous month
     */
    @Scheduled(cron = "0 30 0 1 * ?") // Run at 00:30 on the 1st day of each month
    public void runMonthlyAggregation() {
        logger.info("Running monthly analytics aggregation");
        
        LocalDateTime end = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime start = end.minusMonths(1);
        
        try {
            analyticsService.performDataAggregation(start, end);
            logger.info("Monthly analytics aggregation completed successfully");
        } catch (Exception e) {
            logger.error("Error running monthly analytics aggregation: {}", e.getMessage(), e);
        }
    }
} 