package com.gogidix.centralizeddashboard.metrics.repository;

import com.gogidix.centralizeddashboard.metrics.model.HealthStatus;
import com.gogidix.centralizeddashboard.metrics.model.ServiceHealth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for service health statuses
 */
@Repository
public interface ServiceHealthRepository extends JpaRepository<ServiceHealth, String> {

    /**
     * Find health statuses by service name
     */
    List<ServiceHealth> findByServiceName(String serviceName);
    
    /**
     * Find health statuses by instance ID
     */
    List<ServiceHealth> findByInstanceId(String instanceId);
    
    /**
     * Find health statuses by health status
     */
    List<ServiceHealth> findByStatus(HealthStatus status);
    
    /**
     * Find health statuses by service name and instance ID
     */
    Optional<ServiceHealth> findByServiceNameAndInstanceId(String serviceName, String instanceId);
    
    /**
     * Find health statuses by service name and status
     */
    List<ServiceHealth> findByServiceNameAndStatus(String serviceName, HealthStatus status);
    
    /**
     * Find health statuses that haven't been updated recently
     */
    List<ServiceHealth> findByLastUpdatedBefore(LocalDateTime cutoffTime);
    
    /**
     * Find health statuses that haven't been checked recently
     */
    List<ServiceHealth> findByLastCheckTimeBefore(LocalDateTime cutoffTime);
    
    /**
     * Count services by status
     */
    @Query("SELECT s.status, COUNT(s) FROM ServiceHealth s GROUP BY s.status")
    List<Object[]> countByStatusGrouped();
    
    /**
     * Count service instances by service name
     */
    @Query("SELECT s.serviceName, COUNT(s) FROM ServiceHealth s GROUP BY s.serviceName")
    List<Object[]> countByServiceNameGrouped();
    
    /**
     * Count services by status for a specific service name
     */
    @Query("SELECT s.status, COUNT(s) FROM ServiceHealth s WHERE s.serviceName = ?1 GROUP BY s.status")
    List<Object[]> countByStatusForService(String serviceName);
    
    /**
     * Delete health statuses that haven't been updated for a long time
     */
    void deleteByLastUpdatedBefore(LocalDateTime cutoffTime);
} 