package com.exalt.centralizeddashboard.core.service.impl;

import com.exalt.centralizeddashboard.core.model.DashboardKPI;
import com.exalt.centralizeddashboard.core.model.DashboardMetric;
import com.exalt.centralizeddashboard.core.repository.DashboardKPIRepository;
import com.exalt.centralizeddashboard.core.repository.DashboardMetricRepository;
import com.exalt.centralizeddashboard.core.service.KPIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of the KPIService interface.
 * This service calculates and manages KPIs based on collected metrics.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KPIServiceImpl implements KPIService {

    private final DashboardKPIRepository kpiRepository;
    private final DashboardMetricRepository metricRepository;

    /**
     * Calculate all KPIs based on the latest metrics.
     *
     * @return the number of KPIs calculated
     */
    @Override
    @Transactional
    public int calculateAllKPIs() {
        log.info("Starting calculation of all KPIs");
        int count = 0;
        
        // Calculate KPIs for each category
        for (DashboardKPI.KPICategory category : DashboardKPI.KPICategory.values()) {
            List<DashboardKPI> kpis = calculateKPIsByCategory(category);
            count += kpis.size();
        }
        
        log.info("Completed calculation of all KPIs. Total: {}", count);
        return count;
    }

    /**
     * Calculate KPIs for a specific category.
     *
     * @param category the KPI category
     * @return the list of KPIs calculated
     */
    @Override
    @Transactional
    public List<DashboardKPI> calculateKPIsByCategory(DashboardKPI.KPICategory category) {
        log.info("Calculating KPIs for category: {}", category);
        List<DashboardKPI> calculatedKPIs = new ArrayList<>();
        
        try {
            switch (category) {
                case FINANCIAL:
                    calculatedKPIs.addAll(calculateFinancialKPIs());
                    break;
                case OPERATIONAL:
                    calculatedKPIs.addAll(calculateOperationalKPIs());
                    break;
                case CUSTOMER:
                    calculatedKPIs.addAll(calculateCustomerKPIs());
                    break;
                case GROWTH:
                    calculatedKPIs.addAll(calculateGrowthKPIs());
                    break;
                case EFFICIENCY:
                    calculatedKPIs.addAll(calculateEfficiencyKPIs());
                    break;
                case QUALITY:
                    calculatedKPIs.addAll(calculateQualityKPIs());
                    break;
                case SUSTAINABILITY:
                    calculatedKPIs.addAll(calculateSustainabilityKPIs());
                    break;
                default:
                    log.warn("Unknown KPI category: {}", category);
            }
            
            // Save all calculated KPIs to the repository
            if (!calculatedKPIs.isEmpty()) {
                kpiRepository.saveAll(calculatedKPIs);
                log.info("Saved {} KPIs for category: {}", calculatedKPIs.size(), category);
            }
        } catch (Exception e) {
            log.error("Error calculating KPIs for category: {}", category, e);
        }
        
        return calculatedKPIs;
    }

    /**
     * Get the latest value for a specific KPI.
     *
     * @param kpiName the name of the KPI
     * @return an optional containing the KPI if found, empty otherwise
     */
    @Override
    @Cacheable(value = "kpiCache", key = "#kpiName")
    public Optional<DashboardKPI> getLatestKPI(String kpiName) {
        log.debug("Getting latest KPI for name: {}", kpiName);
        return kpiRepository.findFirstByKpiNameOrderByTimestampDesc(kpiName);
    }

    /**
     * Get KPIs by category.
     *
     * @param category the KPI category
     * @return a list of KPIs in the specified category
     */
    @Override
    @Cacheable(value = "kpiCategoryCache", key = "#category")
    public List<DashboardKPI> getKPIsByCategory(DashboardKPI.KPICategory category) {
        log.debug("Getting KPIs for category: {}", category);
        return kpiRepository.findByKpiCategory(category);
    }

    /**
     * Get KPIs for a specific region.
     *
     * @param region the region
     * @return a list of KPIs for the specified region
     */
    @Override
    @Cacheable(value = "kpiRegionCache", key = "#region")
    public List<DashboardKPI> getKPIsByRegion(String region) {
        log.debug("Getting KPIs for region: {}", region);
        return kpiRepository.findByRegion(region);
    }

    /**
     * Get KPIs with warning or critical status.
     *
     * @return a list of KPIs that need attention
     */
    @Override
    public List<DashboardKPI> getKPIsNeedingAttention() {
        log.debug("Getting KPIs that need attention");
        List<DashboardKPI> attentionKPIs = new ArrayList<>();
        attentionKPIs.addAll(kpiRepository.findKPIsBelowThreshold());
        attentionKPIs.addAll(kpiRepository.findKPIsAboveThreshold());
        
        return attentionKPIs.stream()
                .sorted(Comparator.comparing(DashboardKPI::getKpiStatus)
                        .thenComparing(DashboardKPI::getKpiCategory))
                .collect(Collectors.toList());
    }

    /**
     * Get KPI trend over time.
     *
     * @param kpiName the name of the KPI
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return a map with timestamps as keys and KPI values as values
     */
    @Override
    public Map<LocalDateTime, Double> getKPITrend(String kpiName, LocalDateTime startTime, LocalDateTime endTime) {
        log.debug("Getting trend for KPI: {} from {} to {}", kpiName, startTime, endTime);
        
        List<DashboardKPI> kpiTrend = kpiRepository.findKPITrend(kpiName, startTime, endTime);
        Map<LocalDateTime, Double> trendMap = new LinkedHashMap<>();
        
        kpiTrend.forEach(kpi -> trendMap.put(kpi.getTimestamp(), kpi.getKpiValue()));
        
        return trendMap;
    }

    /**
     * Compare KPI values between regions.
     *
     * @param kpiName the name of the KPI
     * @param regions the list of regions to compare
     * @return a map with regions as keys and KPI values as values
     */
    @Override
    public Map<String, Double> compareKPIAcrossRegions(String kpiName, List<String> regions) {
        log.debug("Comparing KPI: {} across regions: {}", kpiName, regions);
        Map<String, Double> comparisonMap = new HashMap<>();
        
        for (String region : regions) {
            List<DashboardKPI> regionKPIs = kpiRepository.findByRegion(region);
            Optional<DashboardKPI> latestKPI = regionKPIs.stream()
                    .filter(kpi -> kpi.getKpiName().equals(kpiName))
                    .max(Comparator.comparing(DashboardKPI::getTimestamp));
            
            latestKPI.ifPresent(kpi -> comparisonMap.put(region, kpi.getKpiValue()));
        }
        
        return comparisonMap;
    }

    /**
     * Create or update a KPI definition.
     *
     * @param kpi the KPI to create or update
     * @return the saved KPI
     */
    @Override
    @Transactional
    public DashboardKPI saveKPI(DashboardKPI kpi) {
        log.info("Saving KPI: {}", kpi.getKpiName());
        return kpiRepository.save(kpi);
    }

    /**
     * Delete a KPI by ID.
     *
     * @param kpiId the ID of the KPI to delete
     * @return true if successful, false otherwise
     */
    @Override
    @Transactional
    public boolean deleteKPI(Long kpiId) {
        log.info("Deleting KPI with ID: {}", kpiId);
        try {
            kpiRepository.deleteById(kpiId);
            return true;
        } catch (Exception e) {
            log.error("Error deleting KPI with ID: {}", kpiId, e);
            return false;
        }
    }

    /**
     * Recalculate KPIs for a specific entity after it has changed.
     *
     * @param subject the subject/entity type that changed
     * @param subjectId the ID of the entity that changed
     * @return true if recalculation was successful, false otherwise
     */
    @Override
    @Transactional
    public boolean recalculateKPIsForEntity(String subject, String subjectId) {
        log.info("Recalculating KPIs for entity: {} with ID: {}", subject, subjectId);
        
        try {
            // Determine which KPI categories to recalculate based on the subject
            Set<DashboardKPI.KPICategory> categoriesToRecalculate = determineCategoriesToRecalculate(subject);
            
            int totalRecalculated = 0;
            for (DashboardKPI.KPICategory category : categoriesToRecalculate) {
                List<DashboardKPI> recalculatedKPIs = calculateKPIsByCategory(category);
                totalRecalculated += recalculatedKPIs.size();
            }
            
            log.info("Successfully recalculated {} KPIs for entity: {} with ID: {}", 
                    totalRecalculated, subject, subjectId);
            return true;
            
        } catch (Exception e) {
            log.error("Error recalculating KPIs for entity: {} with ID: {}", subject, subjectId, e);
            return false;
        }
    }

    /**
     * Update the status of a KPI based on threshold conditions.
     *
     * @param kpiName the name of the KPI to update
     * @param sourceDomain the source domain of the KPI
     * @param thresholdValue the threshold value to check against
     * @return true if update was successful, false otherwise
     */
    @Override
    @Transactional
    public boolean updateKPIStatus(String kpiName, String sourceDomain, String thresholdValue) {
        log.info("Updating KPI status for: {} in domain: {} with threshold: {}", 
                kpiName, sourceDomain, thresholdValue);
        
        try {
            // Find the KPI by name and optionally by source domain
            Optional<DashboardKPI> kpiOptional = kpiRepository.findFirstByKpiNameOrderByTimestampDesc(kpiName);
            
            if (kpiOptional.isPresent()) {
                DashboardKPI kpi = kpiOptional.get();
                
                // Parse threshold value and determine new status
                double threshold = Double.parseDouble(thresholdValue);
                DashboardKPI.KPIStatus newStatus = determineKPIStatusFromThreshold(kpi, threshold);
                
                // Update the KPI status if it has changed
                if (kpi.getKpiStatus() != newStatus) {
                    kpi.setKpiStatus(newStatus);
                    kpi.setUpdatedAt(LocalDateTime.now());
                    kpiRepository.save(kpi);
                    
                    log.info("Updated KPI {} status from {} to {}", 
                            kpiName, kpi.getKpiStatus(), newStatus);
                }
                
                return true;
            } else {
                log.warn("KPI not found for name: {} in domain: {}", kpiName, sourceDomain);
                return false;
            }
            
        } catch (NumberFormatException e) {
            log.error("Invalid threshold value: {} for KPI: {}", thresholdValue, kpiName, e);
            return false;
        } catch (Exception e) {
            log.error("Error updating KPI status for: {} in domain: {}", kpiName, sourceDomain, e);
            return false;
        }
    }

    /**
     * Scheduled task to calculate KPIs.
     * By default, runs every hour.
     */
    @Scheduled(cron = "0 0 * * * *")
    public void scheduledKPICalculation() {
        log.info("Running scheduled KPI calculation");
        calculateAllKPIs();
    }

    /**
     * Calculate financial KPIs based on metrics.
     *
     * @return a list of calculated financial KPIs
     */
    private List<DashboardKPI> calculateFinancialKPIs() {
        log.debug("Calculating Financial KPIs");
        List<DashboardKPI> kpis = new ArrayList<>();
        
        try {
            // Calculate global Revenue KPI
            List<DashboardMetric> revenueMetrics = metricRepository.findByMetricNameAndSourceDomain(
                    "revenue", DashboardMetric.SourceDomain.COURIER_SERVICES);
            
            if (!revenueMetrics.isEmpty()) {
                double totalRevenue = revenueMetrics.stream()
                        .mapToDouble(DashboardMetric::getMetricValue)
                        .sum();
                
                DashboardKPI revenueKPI = DashboardKPI.builder()
                        .kpiName("Total Revenue")
                        .kpiValue(totalRevenue)
                        .kpiUnit("USD")
                        .kpiCategory(DashboardKPI.KPICategory.FINANCIAL)
                        .kpiStatus(determineKPIStatus(totalRevenue, 500000, 750000))
                        .timestamp(LocalDateTime.now())
                        .calculationPeriod(DashboardKPI.CalculationPeriod.DAILY)
                        .build();
                
                kpis.add(revenueKPI);
            }
            
            // Calculate global Cost KPI
            List<DashboardMetric> costMetrics = metricRepository.findByMetricNameAndSourceDomain(
                    "operational_cost", DashboardMetric.SourceDomain.COURIER_SERVICES);
            
            if (!costMetrics.isEmpty()) {
                double totalCost = costMetrics.stream()
                        .mapToDouble(DashboardMetric::getMetricValue)
                        .sum();
                
                DashboardKPI costKPI = DashboardKPI.builder()
                        .kpiName("Total Operational Cost")
                        .kpiValue(totalCost)
                        .kpiUnit("USD")
                        .kpiCategory(DashboardKPI.KPICategory.FINANCIAL)
                        .kpiStatus(determineKPIStatus(400000, totalCost, 300000))  // Lower cost is better
                        .timestamp(LocalDateTime.now())
                        .calculationPeriod(DashboardKPI.CalculationPeriod.DAILY)
                        .build();
                
                kpis.add(costKPI);
                
                // If we have both revenue and cost, calculate profit
                if (!revenueMetrics.isEmpty()) {
                    double totalRevenue = revenueMetrics.stream()
                            .mapToDouble(DashboardMetric::getMetricValue)
                            .sum();
                    
                    double profit = totalRevenue - totalCost;
                    
                    DashboardKPI profitKPI = DashboardKPI.builder()
                            .kpiName("Total Profit")
                            .kpiValue(profit)
                            .kpiUnit("USD")
                            .kpiCategory(DashboardKPI.KPICategory.FINANCIAL)
                            .kpiStatus(determineKPIStatus(profit, 200000, 350000))
                            .timestamp(LocalDateTime.now())
                            .calculationPeriod(DashboardKPI.CalculationPeriod.DAILY)
                            .build();
                    
                    kpis.add(profitKPI);
                }
            }
            
        } catch (Exception e) {
            log.error("Error calculating Financial KPIs", e);
        }
        
        return kpis;
    }

    /**
     * Calculate operational KPIs based on metrics.
     *
     * @return a list of calculated operational KPIs
     */
    private List<DashboardKPI> calculateOperationalKPIs() {
        log.debug("Calculating Operational KPIs");
        List<DashboardKPI> kpis = new ArrayList<>();
        
        try {
            // Calculate Delivery Success Rate KPI based on collected metrics
            List<DashboardMetric> deliverySuccessMetrics = metricRepository.findByMetricNameAndSourceDomain(
                    "global_delivery_success_rate", DashboardMetric.SourceDomain.COURIER_SERVICES);
            
            if (!deliverySuccessMetrics.isEmpty()) {
                // Use the latest value
                DashboardMetric latestMetric = deliverySuccessMetrics.stream()
                        .max(Comparator.comparing(DashboardMetric::getTimestamp))
                        .orElse(null);
                
                if (latestMetric != null) {
                    DashboardKPI deliverySuccessKPI = DashboardKPI.builder()
                            .kpiName("Delivery Success Rate")
                            .kpiValue(latestMetric.getMetricValue())
                            .kpiUnit("percent")
                            .kpiCategory(DashboardKPI.KPICategory.OPERATIONAL)
                            .kpiStatus(determineKPIStatus(latestMetric.getMetricValue(), 95.0, 98.0))
                            .timestamp(LocalDateTime.now())
                            .calculationPeriod(DashboardKPI.CalculationPeriod.DAILY)
                            .build();
                    
                    kpis.add(deliverySuccessKPI);
                }
            }
            
            // Calculate Average Delivery Time KPI
            List<DashboardMetric> deliveryTimeMetrics = metricRepository.findByMetricNameAndSourceDomain(
                    "global_average_delivery_time", DashboardMetric.SourceDomain.COURIER_SERVICES);
            
            if (!deliveryTimeMetrics.isEmpty()) {
                // Use the latest value
                DashboardMetric latestMetric = deliveryTimeMetrics.stream()
                        .max(Comparator.comparing(DashboardMetric::getTimestamp))
                        .orElse(null);
                
                if (latestMetric != null) {
                    DashboardKPI deliveryTimeKPI = DashboardKPI.builder()
                            .kpiName("Average Delivery Time")
                            .kpiValue(latestMetric.getMetricValue())
                            .kpiUnit("hours")
                            .kpiCategory(DashboardKPI.KPICategory.OPERATIONAL)
                            .kpiStatus(determineKPIStatus(36.0, latestMetric.getMetricValue(), 24.0))  // Lower time is better
                            .timestamp(LocalDateTime.now())
                            .calculationPeriod(DashboardKPI.CalculationPeriod.DAILY)
                            .build();
                    
                    kpis.add(deliveryTimeKPI);
                }
            }
            
        } catch (Exception e) {
            log.error("Error calculating Operational KPIs", e);
        }
        
        return kpis;
    }

    /**
     * Calculate customer KPIs based on metrics.
     *
     * @return a list of calculated customer KPIs
     */
    private List<DashboardKPI> calculateCustomerKPIs() {
        log.debug("Calculating Customer KPIs");
        List<DashboardKPI> kpis = new ArrayList<>();
        
        // TODO: Implement customer KPI calculations when customer metrics are available
        
        return kpis;
    }

    /**
     * Calculate growth KPIs based on metrics.
     *
     * @return a list of calculated growth KPIs
     */
    private List<DashboardKPI> calculateGrowthKPIs() {
        log.debug("Calculating Growth KPIs");
        List<DashboardKPI> kpis = new ArrayList<>();
        
        // TODO: Implement growth KPI calculations when relevant metrics are available
        
        return kpis;
    }

    /**
     * Calculate efficiency KPIs based on metrics.
     *
     * @return a list of calculated efficiency KPIs
     */
    private List<DashboardKPI> calculateEfficiencyKPIs() {
        log.debug("Calculating Efficiency KPIs");
        List<DashboardKPI> kpis = new ArrayList<>();
        
        try {
            // Calculate Courier Utilization KPI
            List<DashboardMetric> utilizationMetrics = metricRepository.findByMetricNameAndSourceDomain(
                    "global_courier_utilization", DashboardMetric.SourceDomain.COURIER_SERVICES);
            
            if (!utilizationMetrics.isEmpty()) {
                // Use the latest value
                DashboardMetric latestMetric = utilizationMetrics.stream()
                        .max(Comparator.comparing(DashboardMetric::getTimestamp))
                        .orElse(null);
                
                if (latestMetric != null) {
                    DashboardKPI utilizationKPI = DashboardKPI.builder()
                            .kpiName("Courier Utilization Rate")
                            .kpiValue(latestMetric.getMetricValue())
                            .kpiUnit("percent")
                            .kpiCategory(DashboardKPI.KPICategory.EFFICIENCY)
                            .kpiStatus(determineKPIStatus(latestMetric.getMetricValue(), 80.0, 90.0))
                            .timestamp(LocalDateTime.now())
                            .calculationPeriod(DashboardKPI.CalculationPeriod.DAILY)
                            .build();
                    
                    kpis.add(utilizationKPI);
                }
            }
            
            // Calculate Driver Efficiency KPI
            List<DashboardMetric> driverEfficiencyMetrics = metricRepository.findByMetricNameAndSourceDomain(
                    "driver_efficiency", DashboardMetric.SourceDomain.COURIER_SERVICES);
            
            if (!driverEfficiencyMetrics.isEmpty()) {
                // Use the latest value
                DashboardMetric latestMetric = driverEfficiencyMetrics.stream()
                        .max(Comparator.comparing(DashboardMetric::getTimestamp))
                        .orElse(null);
                
                if (latestMetric != null) {
                    DashboardKPI driverEfficiencyKPI = DashboardKPI.builder()
                            .kpiName("Driver Efficiency")
                            .kpiValue(latestMetric.getMetricValue())
                            .kpiUnit("percent")
                            .kpiCategory(DashboardKPI.KPICategory.EFFICIENCY)
                            .kpiStatus(determineKPIStatus(latestMetric.getMetricValue(), 85.0, 95.0))
                            .timestamp(LocalDateTime.now())
                            .calculationPeriod(DashboardKPI.CalculationPeriod.DAILY)
                            .build();
                    
                    kpis.add(driverEfficiencyKPI);
                }
            }
            
        } catch (Exception e) {
            log.error("Error calculating Efficiency KPIs", e);
        }
        
        return kpis;
    }

    /**
     * Calculate quality KPIs based on metrics.
     *
     * @return a list of calculated quality KPIs
     */
    private List<DashboardKPI> calculateQualityKPIs() {
        log.debug("Calculating Quality KPIs");
        List<DashboardKPI> kpis = new ArrayList<>();
        
        try {
            // Collect regional on-time delivery metrics to calculate a global average
            List<DashboardMetric> onTimeDeliveryMetrics = metricRepository.findByMetricNameAndSourceDomain(
                    "local_on_time_delivery", DashboardMetric.SourceDomain.COURIER_SERVICES);
            
            if (!onTimeDeliveryMetrics.isEmpty()) {
                double averageOnTimeDelivery = onTimeDeliveryMetrics.stream()
                        .mapToDouble(DashboardMetric::getMetricValue)
                        .average()
                        .orElse(0.0);
                
                DashboardKPI onTimeDeliveryKPI = DashboardKPI.builder()
                        .kpiName("Global On-Time Delivery Rate")
                        .kpiValue(averageOnTimeDelivery)
                        .kpiUnit("percent")
                        .kpiCategory(DashboardKPI.KPICategory.QUALITY)
                        .kpiStatus(determineKPIStatus(averageOnTimeDelivery, 90.0, 95.0))
                        .timestamp(LocalDateTime.now())
                        .calculationPeriod(DashboardKPI.CalculationPeriod.DAILY)
                        .build();
                
                kpis.add(onTimeDeliveryKPI);
            }
            
        } catch (Exception e) {
            log.error("Error calculating Quality KPIs", e);
        }
        
        return kpis;
    }

    /**
     * Calculate sustainability KPIs based on metrics.
     *
     * @return a list of calculated sustainability KPIs
     */
    private List<DashboardKPI> calculateSustainabilityKPIs() {
        log.debug("Calculating Sustainability KPIs");
        List<DashboardKPI> kpis = new ArrayList<>();
        
        try {
            // Calculate Fuel Efficiency KPI
            List<DashboardMetric> fuelConsumptionMetrics = metricRepository.findByMetricNameAndSourceDomain(
                    "fuel_consumption_rate", DashboardMetric.SourceDomain.COURIER_SERVICES);
            
            if (!fuelConsumptionMetrics.isEmpty()) {
                // Use the latest value
                DashboardMetric latestMetric = fuelConsumptionMetrics.stream()
                        .max(Comparator.comparing(DashboardMetric::getTimestamp))
                        .orElse(null);
                
                if (latestMetric != null) {
                    DashboardKPI fuelEfficiencyKPI = DashboardKPI.builder()
                            .kpiName("Fuel Consumption Rate")
                            .kpiValue(latestMetric.getMetricValue())
                            .kpiUnit("liters/100km")
                            .kpiCategory(DashboardKPI.KPICategory.SUSTAINABILITY)
                            .kpiStatus(determineKPIStatus(9.0, latestMetric.getMetricValue(), 6.0))  // Lower consumption is better
                            .timestamp(LocalDateTime.now())
                            .calculationPeriod(DashboardKPI.CalculationPeriod.DAILY)
                            .build();
                    
                    kpis.add(fuelEfficiencyKPI);
                }
            }
            
        } catch (Exception e) {
            log.error("Error calculating Sustainability KPIs", e);
        }
        
        return kpis;
    }

    /**
     * Determine the KPI status based on threshold values.
     * For KPIs where higher values are better.
     *
     * @param value the KPI value
     * @param warningThreshold the warning threshold
     * @param excellentThreshold the excellent threshold
     * @return the KPI status
     */
    private DashboardKPI.KPIStatus determineKPIStatus(double value, double warningThreshold, double excellentThreshold) {
        if (value >= excellentThreshold) {
            return DashboardKPI.KPIStatus.EXCELLENT;
        } else if (value >= warningThreshold) {
            return DashboardKPI.KPIStatus.GOOD;
        } else if (value >= warningThreshold * 0.8) {
            return DashboardKPI.KPIStatus.WARNING;
        } else {
            return DashboardKPI.KPIStatus.CRITICAL;
        }
    }

    /**
     * Determine which KPI categories to recalculate based on the changed entity.
     *
     * @param subject the subject/entity type that changed
     * @return a set of KPI categories that should be recalculated
     */
    private Set<DashboardKPI.KPICategory> determineCategoriesToRecalculate(String subject) {
        Set<DashboardKPI.KPICategory> categories = new HashSet<>();
        
        if (subject == null) {
            return categories;
        }
        
        String subjectLower = subject.toLowerCase();
        
        // Map entity types to relevant KPI categories
        if (subjectLower.contains("order") || subjectLower.contains("purchase") || subjectLower.contains("sale")) {
            categories.add(DashboardKPI.KPICategory.FINANCIAL);
            categories.add(DashboardKPI.KPICategory.OPERATIONAL);
        }
        
        if (subjectLower.contains("delivery") || subjectLower.contains("shipping") || subjectLower.contains("courier")) {
            categories.add(DashboardKPI.KPICategory.OPERATIONAL);
            categories.add(DashboardKPI.KPICategory.QUALITY);
            categories.add(DashboardKPI.KPICategory.EFFICIENCY);
        }
        
        if (subjectLower.contains("customer") || subjectLower.contains("user") || subjectLower.contains("review")) {
            categories.add(DashboardKPI.KPICategory.CUSTOMER);
            categories.add(DashboardKPI.KPICategory.QUALITY);
        }
        
        if (subjectLower.contains("inventory") || subjectLower.contains("warehouse") || subjectLower.contains("stock")) {
            categories.add(DashboardKPI.KPICategory.OPERATIONAL);
            categories.add(DashboardKPI.KPICategory.EFFICIENCY);
        }
        
        if (subjectLower.contains("driver") || subjectLower.contains("vehicle") || subjectLower.contains("fuel")) {
            categories.add(DashboardKPI.KPICategory.EFFICIENCY);
            categories.add(DashboardKPI.KPICategory.SUSTAINABILITY);
        }
        
        if (subjectLower.contains("promotion") || subjectLower.contains("marketing") || subjectLower.contains("engagement")) {
            categories.add(DashboardKPI.KPICategory.GROWTH);
            categories.add(DashboardKPI.KPICategory.CUSTOMER);
        }
        
        // If no specific mapping found, recalculate operational and efficiency KPIs as defaults
        if (categories.isEmpty()) {
            categories.add(DashboardKPI.KPICategory.OPERATIONAL);
            categories.add(DashboardKPI.KPICategory.EFFICIENCY);
        }
        
        return categories;
    }

    /**
     * Determine KPI status based on a threshold value and the KPI's current configuration.
     *
     * @param kpi the KPI to evaluate
     * @param thresholdValue the threshold value to compare against
     * @return the appropriate KPI status
     */
    private DashboardKPI.KPIStatus determineKPIStatusFromThreshold(DashboardKPI kpi, double thresholdValue) {
        double currentValue = kpi.getKpiValue();
        
        // Use existing thresholds if available
        if (kpi.getMinThreshold() != null && kpi.getMaxThreshold() != null) {
            if (currentValue < kpi.getMinThreshold()) {
                return DashboardKPI.KPIStatus.CRITICAL;
            } else if (currentValue > kpi.getMaxThreshold()) {
                // For some KPIs, exceeding max threshold might be excellent (e.g., revenue)
                // For others, it might be critical (e.g., costs)
                return isHigherValueBetter(kpi) ? DashboardKPI.KPIStatus.EXCELLENT : DashboardKPI.KPIStatus.CRITICAL;
            } else {
                // Value is within acceptable range
                double range = kpi.getMaxThreshold() - kpi.getMinThreshold();
                double position = (currentValue - kpi.getMinThreshold()) / range;
                
                if (position > 0.8) {
                    return DashboardKPI.KPIStatus.EXCELLENT;
                } else if (position > 0.6) {
                    return DashboardKPI.KPIStatus.GOOD;
                } else {
                    return DashboardKPI.KPIStatus.WARNING;
                }
            }
        } else {
            // Use threshold value as a general benchmark
            if (isHigherValueBetter(kpi)) {
                if (currentValue >= thresholdValue * 1.2) {
                    return DashboardKPI.KPIStatus.EXCELLENT;
                } else if (currentValue >= thresholdValue) {
                    return DashboardKPI.KPIStatus.GOOD;
                } else if (currentValue >= thresholdValue * 0.8) {
                    return DashboardKPI.KPIStatus.WARNING;
                } else {
                    return DashboardKPI.KPIStatus.CRITICAL;
                }
            } else {
                // Lower values are better (e.g., delivery time, costs)
                if (currentValue <= thresholdValue * 0.8) {
                    return DashboardKPI.KPIStatus.EXCELLENT;
                } else if (currentValue <= thresholdValue) {
                    return DashboardKPI.KPIStatus.GOOD;
                } else if (currentValue <= thresholdValue * 1.2) {
                    return DashboardKPI.KPIStatus.WARNING;
                } else {
                    return DashboardKPI.KPIStatus.CRITICAL;
                }
            }
        }
    }

    /**
     * Determine if higher values are better for a specific KPI.
     *
     * @param kpi the KPI to evaluate
     * @return true if higher values are better, false if lower values are better
     */
    private boolean isHigherValueBetter(DashboardKPI kpi) {
        String kpiNameLower = kpi.getKpiName().toLowerCase();
        
        // KPIs where higher values are better
        if (kpiNameLower.contains("success") || kpiNameLower.contains("rate") || 
            kpiNameLower.contains("revenue") || kpiNameLower.contains("profit") ||
            kpiNameLower.contains("utilization") || kpiNameLower.contains("efficiency") ||
            kpiNameLower.contains("satisfaction") || kpiNameLower.contains("quality")) {
            return true;
        }
        
        // KPIs where lower values are better
        if (kpiNameLower.contains("time") || kpiNameLower.contains("cost") ||
            kpiNameLower.contains("delay") || kpiNameLower.contains("consumption") ||
            kpiNameLower.contains("error") || kpiNameLower.contains("failure")) {
            return false;
        }
        
        // Default assumption: higher is better
        return true;
    }
}