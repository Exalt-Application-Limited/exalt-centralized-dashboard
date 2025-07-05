package com.gogidix.centralizeddashboard.dataaggregation.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Configuration properties for service endpoints used by the data aggregation service.
 */
@Component
@ConfigurationProperties(prefix = "app.services")
public class ServiceProperties {
    private List<ServiceConfig> services = new ArrayList<>();
    
    public List<ServiceConfig> getServices() {
        return services;
    }
    
    public void setServices(List<ServiceConfig> services) {
        this.services = services;
    }
    
    /**
     * Inner class representing a single service configuration.
     */
    public static class ServiceConfig {
        private String name;
        private String url;
        private boolean enabled = true;
        private int timeout = 5000; // Default timeout in ms
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getUrl() {
            return url;
        }
        
        public void setUrl(String url) {
            this.url = url;
        }
        
        public boolean isEnabled() {
            return enabled;
        }
        
        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }
        
        public int getTimeout() {
            return timeout;
        }
        
        public void setTimeout(int timeout) {
            this.timeout = timeout;
        }
    }
} 