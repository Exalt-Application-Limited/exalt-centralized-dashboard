package com.gogidix.centralizeddashboard.dataaggregation.repository;

import com.gogidix.centralizeddashboard.dataaggregation.dto.AggregationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

/**
 * Repository for caching and retrieving aggregation results using Redis.
 */
@Repository
public class AggregationCacheRepository {
    private static final Logger logger = LoggerFactory.getLogger(AggregationCacheRepository.class);
    private static final String CACHE_PREFIX = "aggregation:result:";
    private static final long DEFAULT_CACHE_TTL = 15; // 15 minutes
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    public AggregationCacheRepository(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    
    /**
     * Saves an aggregation result to the cache with a specified key.
     * 
     * @param cacheKey The cache key
     * @param result The aggregation result to cache
     */
    public void saveResult(String cacheKey, AggregationResult result) {
        String redisKey = CACHE_PREFIX + cacheKey;
        logger.debug("Saving aggregation result to cache with key: {}", redisKey);
        
        try {
            redisTemplate.opsForValue().set(redisKey, result, DEFAULT_CACHE_TTL, TimeUnit.MINUTES);
        } catch (Exception e) {
            logger.error("Error saving aggregation result to cache: {}", e.getMessage());
        }
    }
    
    /**
     * Retrieves an aggregation result from the cache by key.
     * 
     * @param cacheKey The cache key
     * @return The aggregation result, or null if not found
     */
    public AggregationResult getResult(String cacheKey) {
        String redisKey = CACHE_PREFIX + cacheKey;
        logger.debug("Retrieving aggregation result from cache with key: {}", redisKey);
        
        try {
            Object result = redisTemplate.opsForValue().get(redisKey);
            if (result instanceof AggregationResult) {
                logger.debug("Cache hit for key: {}", redisKey);
                return (AggregationResult) result;
            }
        } catch (Exception e) {
            logger.error("Error retrieving aggregation result from cache: {}", e.getMessage());
        }
        
        logger.debug("Cache miss for key: {}", redisKey);
        return null;
    }
    
    /**
     * Invalidates a cached aggregation result by key.
     * 
     * @param cacheKey The cache key to invalidate
     */
    public void invalidateResult(String cacheKey) {
        String redisKey = CACHE_PREFIX + cacheKey;
        logger.debug("Invalidating aggregation result in cache with key: {}", redisKey);
        
        try {
            redisTemplate.delete(redisKey);
        } catch (Exception e) {
            logger.error("Error invalidating aggregation result in cache: {}", e.getMessage());
        }
    }
    
    /**
     * Invalidates all cached aggregation results.
     */
    public void invalidateAllResults() {
        logger.debug("Invalidating all aggregation results in cache");
        
        try {
            // Get all keys matching the pattern
            var keys = redisTemplate.keys(CACHE_PREFIX + "*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                logger.debug("Invalidated {} cache entries", keys.size());
            }
        } catch (Exception e) {
            logger.error("Error invalidating all aggregation results in cache: {}", e.getMessage());
        }
    }
} 