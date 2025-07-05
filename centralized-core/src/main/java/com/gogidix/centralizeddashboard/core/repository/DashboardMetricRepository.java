package com.gogidix.centralizeddashboard.core.repository;

import com.gogidix.centralizeddashboard.core.model.DashboardMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for DashboardMetric entity operations.
 */
@Repository
public interface DashboardMetricRepository extends JpaRepository<DashboardMetric, Long> {
    
    /**
     * Find metrics by source domain.
     *
     * @param sourceDomain the source domain to filter by
     * @return a list of metrics from the specified domain
     */
    List<DashboardMetric> findBySourceDomain(DashboardMetric.SourceDomain sourceDomain);
    
    /**
     * Find metrics by metric name and source domain.
     *
     * @param metricName the name of the metric
     * @param sourceDomain the source domain
     * @return a list of metrics matching the criteria
     */
    List<DashboardMetric> findByMetricNameAndSourceDomain(String metricName, DashboardMetric.SourceDomain sourceDomain);
    
    /**
     * Find the most recent metric for a given source domain.
     *
     * @param sourceDomain the source domain
     * @return the most recent metric from the specified domain
     */
    DashboardMetric findTopBySourceDomainOrderByTimestampDesc(DashboardMetric.SourceDomain sourceDomain);
    
    /**
     * Count metrics by source domain.
     *
     * @param sourceDomain the source domain
     * @return the count of metrics for the specified domain
     */
    Long countBySourceDomain(DashboardMetric.SourceDomain sourceDomain);
    
    /**
     * Find top 10 metrics for a given source domain ordered by timestamp descending.
     *
     * @param sourceDomain the source domain
     * @return a list of the 10 most recent metrics from the specified domain
     */
    List<DashboardMetric> findTop10BySourceDomainOrderByTimestampDesc(DashboardMetric.SourceDomain sourceDomain);
    
    /**
     * Find metrics by source domain and time range.
     *
     * @param sourceDomain the source domain
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return a list of metrics within the time range from the specified domain
     */
    List<DashboardMetric> findBySourceDomainAndTimestampBetween(
            DashboardMetric.SourceDomain sourceDomain, 
            LocalDateTime startTime, 
            LocalDateTime endTime
    );
    
    /**
     * Find metrics by region and time range.
     *
     * @param region the region to filter by
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return a list of metrics within the time range from the specified region
     */
    List<DashboardMetric> findByRegionAndTimestampBetween(
            String region, 
            LocalDateTime startTime, 
            LocalDateTime endTime
    );
    
    /**
     * Get average metric value grouped by day for a specific metric and domain.
     *
     * @param metricName the name of the metric
     * @param sourceDomain the source domain
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return a list of average metric values per day
     */
    @Query("SELECT FUNCTION('DATE', m.timestamp) as day, AVG(m.metricValue) as average " +
           "FROM DashboardMetric m " +
           "WHERE m.metricName = :metricName " +
           "AND m.sourceDomain = :sourceDomain " +
           "AND m.timestamp BETWEEN :startTime AND :endTime " +
           "GROUP BY FUNCTION('DATE', m.timestamp) " +
           "ORDER BY day")
    List<Object[]> getAverageMetricValueByDay(
            @Param("metricName") String metricName,
            @Param("sourceDomain") DashboardMetric.SourceDomain sourceDomain,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
    
    /**
     * Get the latest metrics for a specific domain, limited by count.
     *
     * @param sourceDomain the source domain
     * @param limit the maximum number of results to return
     * @return a list of the latest metrics from the specified domain
     */
    @Query("SELECT m FROM DashboardMetric m " +
           "WHERE m.sourceDomain = :sourceDomain " +
           "ORDER BY m.timestamp DESC")
    List<DashboardMetric> findLatestBySourceDomain(
            @Param("sourceDomain") DashboardMetric.SourceDomain sourceDomain,
            @Param("limit") int limit
    );
}