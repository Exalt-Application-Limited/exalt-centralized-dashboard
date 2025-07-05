package com.gogidix.centralizeddashboard.analytics.aggregation.scheduler;

import com.gogidix.centralizeddashboard.analytics.aggregation.model.TimeGranularity;
import com.gogidix.centralizeddashboard.analytics.aggregation.service.DataAggregationService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Scheduler for periodic data aggregation
 */
@Component
public class DataAggregationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DataAggregationScheduler.class);
    
    private final DataAggregationService dataAggregationService;
    
    @Autowired
    public DataAggregationScheduler(DataAggregationService dataAggregationService) {
        this.dataAggregationService = dataAggregationService;
    }
    
    /**
     * Run hourly aggregation job
     */
    @Scheduled(cron = "0 10 * * * ?") // Run at 10 minutes past every hour
    public void runHourlyAggregation() {
        logger.info("Running hourly data aggregation");
        
        LocalDateTime end = LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
        LocalDateTime start = end.minusHours(1);
        
        try {
            dataAggregationService.aggregateData(start, end, TimeGranularity.HOUR);
            logger.info("Hourly data aggregation completed successfully");
        } catch (Exception e) {
            logger.error("Error running hourly data aggregation: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Run daily aggregation job
     */
    @Scheduled(cron = "0 20 0 * * ?") // Run at 00:20 every day
    public void runDailyAggregation() {
        logger.info("Running daily data aggregation");
        
        LocalDateTime end = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime start = end.minusDays(1);
        
        try {
            dataAggregationService.aggregateData(start, end, TimeGranularity.DAY);
            logger.info("Daily data aggregation completed successfully");
        } catch (Exception e) {
            logger.error("Error running daily data aggregation: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Run weekly aggregation job
     */
    @Scheduled(cron = "0 30 0 ? * MON") // Run at 00:30 every Monday
    public void runWeeklyAggregation() {
        logger.info("Running weekly data aggregation");
        
        LocalDateTime end = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime start = end.minusDays(7);
        
        try {
            dataAggregationService.aggregateData(start, end, TimeGranularity.WEEK);
            logger.info("Weekly data aggregation completed successfully");
        } catch (Exception e) {
            logger.error("Error running weekly data aggregation: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Run monthly aggregation job
     */
    @Scheduled(cron = "0 40 0 1 * ?") // Run at 00:40 on the 1st day of each month
    public void runMonthlyAggregation() {
        logger.info("Running monthly data aggregation");
        
        LocalDateTime end = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime start = end.minusMonths(1);
        
        try {
            dataAggregationService.aggregateData(start, end, TimeGranularity.MONTH);
            logger.info("Monthly data aggregation completed successfully");
        } catch (Exception e) {
            logger.error("Error running monthly data aggregation: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Run quarterly aggregation job
     */
    @Scheduled(cron = "0 50 0 1 1,4,7,10 ?") // Run at 00:50 on the 1st day of Jan, Apr, Jul, and Oct
    public void runQuarterlyAggregation() {
        logger.info("Running quarterly data aggregation");
        
        LocalDateTime end = LocalDateTime.now()
                .withDayOfMonth(1)
                .withHour(0)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
        
        // Round to start of quarter
        int month = end.getMonthValue();
        int quarterStartMonth = ((month - 1) / 3) * 3 + 1;
        end = end.withMonth(quarterStartMonth);
        
        LocalDateTime start = end.minusMonths(3);
        
        try {
            dataAggregationService.aggregateData(start, end, TimeGranularity.QUARTER);
            logger.info("Quarterly data aggregation completed successfully");
        } catch (Exception e) {
            logger.error("Error running quarterly data aggregation: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Run metrics pruning job
     */
    @Scheduled(cron = "0 0 2 * * ?") // Run at 02:00 every day
    public void runMetricsPruning() {
        logger.info("Running metrics pruning job");
        
        // Keep metrics for 1 year
        LocalDateTime cutoffDate = LocalDateTime.now().minusYears(1);
        
        try {
            int prunedCount = dataAggregationService.pruneOldMetrics(cutoffDate);
            logger.info("Metrics pruning completed successfully. Pruned {} old metrics", prunedCount);
        } catch (Exception e) {
            logger.error("Error running metrics pruning job: {}", e.getMessage(), e);
        }
    }
} 