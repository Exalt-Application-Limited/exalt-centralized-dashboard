package com.exalt.centralizeddashboard.core.service;

import com.exalt.centralizeddashboard.core.model.DashboardKPI;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service interface for KPI management and calculation.
 * This service is responsible for calculating KPIs based on metrics
 * and providing KPI data for the dashboard.
 */
public interface KPIService {

    /**
     * Calculate all KPIs based on the latest metrics.
     *
     * @return the number of KPIs calculated
     */
    int calculateAllKPIs();

    /**
     * Calculate KPIs for a specific category.
     *
     * @param category the KPI category
     * @return the list of KPIs calculated
     */
    List<DashboardKPI> calculateKPIsByCategory(DashboardKPI.KPICategory category);

    /**
     * Get the latest value for a specific KPI.
     *
     * @param kpiName the name of the KPI
     * @return an optional containing the KPI if found, empty otherwise
     */
    Optional<DashboardKPI> getLatestKPI(String kpiName);

    /**
     * Get KPIs by category.
     *
     * @param category the KPI category
     * @return a list of KPIs in the specified category
     */
    List<DashboardKPI> getKPIsByCategory(DashboardKPI.KPICategory category);

    /**
     * Get KPIs for a specific region.
     *
     * @param region the region
     * @return a list of KPIs for the specified region
     */
    List<DashboardKPI> getKPIsByRegion(String region);

    /**
     * Get KPIs with warning or critical status.
     *
     * @return a list of KPIs that need attention
     */
    List<DashboardKPI> getKPIsNeedingAttention();

    /**
     * Get KPI trend over time.
     *
     * @param kpiName the name of the KPI
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return a map with timestamps as keys and KPI values as values
     */
    Map<LocalDateTime, Double> getKPITrend(String kpiName, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * Compare KPI values between regions.
     *
     * @param kpiName the name of the KPI
     * @param regions the list of regions to compare
     * @return a map with regions as keys and KPI values as values
     */
    Map<String, Double> compareKPIAcrossRegions(String kpiName, List<String> regions);

    /**
     * Create or update a KPI definition.
     *
     * @param kpi the KPI to create or update
     * @return the saved KPI
     */
    DashboardKPI saveKPI(DashboardKPI kpi);

    /**
     * Delete a KPI by ID.
     *
     * @param kpiId the ID of the KPI to delete
     * @return true if successful, false otherwise
     */
    boolean deleteKPI(Long kpiId);

    /**
     * Recalculate KPIs for a specific entity after it has changed.
     *
     * @param subject the subject/entity type that changed
     * @param subjectId the ID of the entity that changed
     * @return true if recalculation was successful, false otherwise
     */
    boolean recalculateKPIsForEntity(String subject, String subjectId);

    /**
     * Update the status of a KPI based on threshold conditions.
     *
     * @param kpiName the name of the KPI to update
     * @param sourceDomain the source domain of the KPI
     * @param thresholdValue the threshold value to check against
     * @return true if update was successful, false otherwise
     */
    boolean updateKPIStatus(String kpiName, String sourceDomain, String thresholdValue);
}