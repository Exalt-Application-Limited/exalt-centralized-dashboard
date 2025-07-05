package com.gogidix.centralizeddashboard.core.repository;

import com.gogidix.centralizeddashboard.core.model.DashboardKPI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for DashboardKPI entity operations.
 */
@Repository
public interface DashboardKPIRepository extends JpaRepository<DashboardKPI, Long> {
    
    /**
     * Find KPIs by name.
     *
     * @param kpiName the name of the KPI
     * @return a list of KPIs with the given name
     */
    List<DashboardKPI> findByKpiName(String kpiName);
    
    /**
     * Find KPIs by category.
     *
     * @param kpiCategory the category of the KPI
     * @return a list of KPIs in the specified category
     */
    List<DashboardKPI> findByKpiCategory(DashboardKPI.KPICategory kpiCategory);
    
    /**
     * Find KPIs with a status other than the specified one.
     *
     * @param kpiStatus the KPI status to exclude
     * @return a list of KPIs with status not matching the parameter
     */
    List<DashboardKPI> findByKpiStatusNot(DashboardKPI.KPIStatus kpiStatus);
    
    /**
     * Find KPIs by domain.
     *
     * @param domain the domain name
     * @return a list of KPIs for the specified domain
     */
    @Query("SELECT k FROM DashboardKPI k WHERE k.domain = :domain")
    List<DashboardKPI> findByDomain(@Param("domain") String domain);
    
    /**
     * Find top 10 KPIs ordered by last updated timestamp descending.
     *
     * @return a list of the 10 most recently updated KPIs
     */
    List<DashboardKPI> findTop10ByOrderByUpdatedAtDesc();
    
    /**
     * Find KPIs by status.
     *
     * @param kpiStatus the status of the KPI
     * @return a list of KPIs with the specified status
     */
    List<DashboardKPI> findByKpiStatus(DashboardKPI.KPIStatus kpiStatus);
    
    /**
     * Find KPIs by region.
     *
     * @param region the region to filter by
     * @return a list of KPIs from the specified region
     */
    List<DashboardKPI> findByRegion(String region);
    
    /**
     * Find KPIs by time range.
     *
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return a list of KPIs within the time range
     */
    List<DashboardKPI> findByTimestampBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * Find KPIs by category and time range.
     *
     * @param kpiCategory the category of the KPI
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return a list of KPIs in the specified category within the time range
     */
    List<DashboardKPI> findByKpiCategoryAndTimestampBetween(
            DashboardKPI.KPICategory kpiCategory, 
            LocalDateTime startTime, 
            LocalDateTime endTime
    );
    
    /**
     * Find KPIs by category ordered by timestamp descending.
     *
     * @param kpiCategory the category of the KPI
     * @return a list of KPIs in the specified category ordered by timestamp descending
     */
    List<DashboardKPI> findByKpiCategoryOrderByTimestampDesc(DashboardKPI.KPICategory kpiCategory);
    
    /**
     * Find KPIs by status list.
     *
     * @param kpiStatuses the list of KPI statuses to filter by
     * @return a list of KPIs with the specified statuses
     */
    List<DashboardKPI> findByKpiStatusIn(List<DashboardKPI.KPIStatus> kpiStatuses);
    
    /**
     * Find the top KPI by name ordered by timestamp descending.
     *
     * @param kpiName the name of the KPI
     * @return an optional containing the latest KPI with the given name
     */
    Optional<DashboardKPI> findTopByKpiNameOrderByTimestampDesc(String kpiName);
    
    /**
     * Get the latest KPI value for a specific KPI name.
     *
     * @param kpiName the name of the KPI
     * @return an optional containing the latest KPI, or empty if not found
     */
    Optional<DashboardKPI> findFirstByKpiNameOrderByTimestampDesc(String kpiName);
    
    /**
     * Get KPIs below their minimum threshold.
     *
     * @return a list of KPIs that are below their minimum threshold
     */
    @Query("SELECT k FROM DashboardKPI k WHERE k.kpiValue < k.minThreshold AND k.kpiStatus IN ('WARNING', 'CRITICAL')")
    List<DashboardKPI> findKPIsBelowThreshold();
    
    /**
     * Get KPIs above their maximum threshold.
     *
     * @return a list of KPIs that are above their maximum threshold
     */
    @Query("SELECT k FROM DashboardKPI k WHERE k.kpiValue > k.maxThreshold AND k.kpiStatus IN ('WARNING', 'CRITICAL')")
    List<DashboardKPI> findKPIsAboveThreshold();
    
    /**
     * Get KPI trend over time.
     *
     * @param kpiName the name of the KPI
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return a list of KPI values over time for the specified KPI
     */
    @Query("SELECT k FROM DashboardKPI k WHERE k.kpiName = :kpiName AND k.timestamp BETWEEN :startTime AND :endTime ORDER BY k.timestamp")
    List<DashboardKPI> findKPITrend(
            @Param("kpiName") String kpiName,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}