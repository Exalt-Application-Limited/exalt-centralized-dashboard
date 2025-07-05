package com.gogidix.centralizeddashboard.core.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Service for data synchronization between domains.
 * Responsible for keeping data consistent across domain boundaries
 * through event-based synchronization.
 */
public interface DataSynchronizationService {

    /**
     * Trigger a synchronization of all data from a specific domain.
     *
     * @param domainName the name of the domain to sync from
     * @return true if synchronization was successful, false otherwise
     */
    boolean synchronizeDomain(String domainName);
    
    /**
     * Trigger a synchronization of specific data from a domain.
     *
     * @param domainName the name of the domain to sync from
     * @param dataType the type of data to synchronize (e.g., "metrics", "kpis", "alerts")
     * @return true if synchronization was successful, false otherwise
     */
    boolean synchronizeDomainData(String domainName, String dataType);
    
    /**
     * Schedule periodic synchronization for a domain.
     *
     * @param domainName the name of the domain to sync from
     * @param intervalMinutes the interval in minutes between synchronizations
     * @return the ID of the scheduled synchronization job
     */
    String schedulePeriodicSync(String domainName, int intervalMinutes);
    
    /**
     * Cancel a previously scheduled synchronization.
     *
     * @param syncJobId the ID of the synchronization job to cancel
     * @return true if cancellation was successful, false otherwise
     */
    boolean cancelScheduledSync(String syncJobId);
    
    /**
     * Get information about the last synchronization operation for a domain.
     *
     * @param domainName the name of the domain
     * @return a map containing information about the last sync (timestamp, success, metrics synced)
     */
    Map<String, Object> getLastSyncInfo(String domainName);
    
    /**
     * Get all active synchronization schedules.
     *
     * @return a list of maps containing schedule information
     */
    List<Map<String, Object>> getActiveSyncSchedules();
}
