package com.exalt.centralizeddashboard.core.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages cross-domain authorization by propagating authentication tokens
 * and checking authorization across domain boundaries.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CrossDomainAuthorizationManager {

    private final RestTemplate restTemplate;
    
    // Cache for authorization decisions to reduce network traffic
    private final Map<String, Boolean> authorizationCache = new ConcurrentHashMap<>();
    
    /**
     * Checks if the current user is authorized to access a specific domain resource.
     *
     * @param domain the domain to check authorization for
     * @param resource the resource path within the domain
     * @param requiredPermission the permission required (e.g., READ, WRITE)
     * @return true if authorized, false otherwise
     */
    public boolean isAuthorizedForDomain(String domain, String resource, String requiredPermission) {
        String cacheKey = generateCacheKey(domain, resource, requiredPermission);
        
        // Check cache first
        if (authorizationCache.containsKey(cacheKey)) {
            return authorizationCache.get(cacheKey);
        }
        
        try {
            String token = extractCurrentToken();
            if (token == null) {
                log.warn("No authentication token found for cross-domain authorization check");
                return false;
            }
            
            String domainAuthUrl = getDomainAuthorizationUrl(domain);
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("resource", resource);
            requestBody.put("permission", requiredPermission);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                    domainAuthUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );
            
            Boolean authorized = false;
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                authorized = (Boolean) response.getBody().getOrDefault("authorized", false);
            }
            
            // Cache the result
            authorizationCache.put(cacheKey, authorized);
            
            return authorized;
        } catch (Exception e) {
            log.error("Error during cross-domain authorization check for domain: {}, resource: {}", 
                    domain, resource, e);
            return false;
        }
    }
    
    /**
     * Propagates the current authentication token to a domain API call.
     *
     * @param headers the HTTP headers to augment with authentication
     */
    public void propagateAuthentication(HttpHeaders headers) {
        String token = extractCurrentToken();
        if (token != null) {
            headers.setBearerAuth(token);
            headers.set("X-Forwarded-From", "centralized-dashboard");
        }
    }
    
    /**
     * Clears the authorization cache for a specific user.
     * Should be called when user permissions change.
     *
     * @param userId the ID of the user to clear cache for
     */
    public void clearCacheForUser(String userId) {
        // In a more sophisticated implementation, we would only clear entries for this user
        // For now, clear the entire cache as a simple implementation
        authorizationCache.clear();
        log.info("Authorization cache cleared for user: {}", userId);
    }
    
    /**
     * Extracts the current JWT token from the security context.
     *
     * @return the JWT token or null if not available
     */
    private String extractCurrentToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication instanceof JwtAuthenticationToken) {
            return ((JwtAuthenticationToken) authentication).getToken().getTokenValue();
        } else if (authentication != null && authentication.getCredentials() instanceof String) {
            return (String) authentication.getCredentials();
        }
        
        return null;
    }
    
    /**
     * Generates a cache key for authorization decisions.
     *
     * @param domain the domain
     * @param resource the resource
     * @param permission the required permission
     * @return a unique cache key
     */
    private String generateCacheKey(String domain, String resource, String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = "anonymous";
        
        if (authentication != null && authentication.getPrincipal() instanceof OAuth2AuthenticatedPrincipal) {
            OAuth2AuthenticatedPrincipal principal = (OAuth2AuthenticatedPrincipal) authentication.getPrincipal();
            userId = principal.getAttribute("sub");
        }
        
        return userId + ":" + domain + ":" + resource + ":" + permission;
    }
    
    /**
     * Gets the authorization endpoint URL for a specific domain.
     *
     * @param domain the domain name
     * @return the authorization URL
     */
    private String getDomainAuthorizationUrl(String domain) {
        // This would typically be configured in application properties or service discovery
        switch (domain.toLowerCase()) {
            case "social-commerce":
                return "http://social-commerce-service/api/auth/check-permission";
            case "warehousing":
                return "http://warehousing-service/api/auth/check-permission";
            case "courier-services":
                return "http://courier-services/api/auth/check-permission";
            default:
                throw new IllegalArgumentException("Unknown domain: " + domain);
        }
    }
}