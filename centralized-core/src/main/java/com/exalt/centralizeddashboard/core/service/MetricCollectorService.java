package com.exalt.centralizeddashboard.core.service;

import com.exalt.centralizeddashboard.core.model.DashboardMetric;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Service interface for collecting metrics from various domains.
 * This service is responsible for fetching data from source systems
 * and normalizing it for storage in the dashboard database.
 */
public interface MetricCollectorService {

    /**
     * Collect metrics from all domains.
     *
     * @return a count of metrics collected from each domain
     */
    Map<DashboardMetric.SourceDomain, Integer> collectAllDomainMetrics();

    /**
     * Collect metrics from the Social Commerce domain.
     *
     * @return the list of metrics collected
     */
    List<DashboardMetric> collectSocialCommerceMetrics();

    /**
     * Collect metrics from the Warehousing domain.
     *
     * @return the list of metrics collected
     */
    List<DashboardMetric> collectWarehousingMetrics();

    /**
     * Collect metrics from the Courier Services domain.
     *
     * @return the list of metrics collected
     */
    List<DashboardMetric> collectCourierServicesMetrics();

    /**
     * Collect metrics for a specific domain and time range.
     *
     * @param domain the source domain
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return the list of metrics collected
     */
    List<DashboardMetric> collectMetricsForDomainAndTimeRange(
            DashboardMetric.SourceDomain domain, 
            LocalDateTime startTime, 
            LocalDateTime endTime
    );

    /**
     * Schedule metric collection for all domains.
     *
     * @param cronExpression the cron expression for scheduling
     * @return true if scheduling was successful, false otherwise
     */
    boolean scheduleMetricCollection(String cronExpression);

    /**
     * Manually refresh metrics for a specific domain.
     *
     * @param domain the source domain to refresh
     * @return the number of metrics refreshed
     */
    int refreshMetricsForDomain(DashboardMetric.SourceDomain domain);

    /**
     * Save a metric to the database.
     *
     * @param metric the metric to save
     * @return the saved metric
     */
    DashboardMetric saveMetric(DashboardMetric metric);
}