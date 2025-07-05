package com.gogidix.centralizeddashboard.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Redis Cache Configuration
 * Configures Redis caching for improved performance across the application
 */
@Configuration
@EnableCaching
public class RedisCacheConfig {

    @Value("${spring.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.redis.port:6379}")
    private int redisPort;

    @Value("${spring.redis.password:}")
    private String redisPassword;

    @Value("${spring.cache.redis.time-to-live:3600}")
    private long timeToLive;

    /**
     * Creates the Redis connection factory
     *
     * @return RedisConnectionFactory
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration();
        redisConfig.setHostName(redisHost);
        redisConfig.setPort(redisPort);
        
        if (!redisPassword.isEmpty()) {
            redisConfig.setPassword(redisPassword);
        }
        
        return new LettuceConnectionFactory(redisConfig);
    }

    /**
     * Creates the Redis template for complex objects
     *
     * @param connectionFactory Redis connection factory
     * @return RedisTemplate configured with appropriate serializers
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        // Use Jackson JSON serializer for values
        GenericJackson2JsonRedisSerializer jackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        template.setValueSerializer(jackson2JsonRedisSerializer);
        
        // Use String serializer for keys
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        
        template.afterPropertiesSet();
        return template;
    }

    /**
     * Creates the primary cache manager using Redis
     *
     * @param redisConnectionFactory Redis connection factory
     * @return RedisCacheManager
     */
    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        // Create default configuration with JSON serialization
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(timeToLive))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())
                )
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer())
                );
        
        // Create cache configurations with different TTLs for specific caches
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Short-lived caches for frequently changing data
        cacheConfigurations.put("dashboardMetrics", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        cacheConfigurations.put("realtimeData", defaultConfig.entryTtl(Duration.ofMinutes(1)));
        
        // Medium-lived caches for semi-static data
        cacheConfigurations.put("dashboardKpis", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigurations.put("exportTemplates", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        
        // Long-lived caches for relatively static data
        cacheConfigurations.put("domainConfigurations", defaultConfig.entryTtl(Duration.ofHours(1)));
        cacheConfigurations.put("userPreferences", defaultConfig.entryTtl(Duration.ofHours(2)));
        
        // Build the cache manager
        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }

    /**
     * Creates a fallback Caffeine cache manager for use when Redis is unavailable
     * This bean is only active in the 'local' profile
     *
     * @return CaffeineCacheManager
     */
    @Bean
    @Profile("local")
    public org.springframework.cache.caffeine.CaffeineCacheManager fallbackCacheManager() {
        org.springframework.cache.caffeine.CaffeineCacheManager cacheManager = 
                new org.springframework.cache.caffeine.CaffeineCacheManager();
        cacheManager.setCacheSpecification("maximumSize=1000,expireAfterAccess=600s");
        return cacheManager;
    }
}
