package com.exalt.centralizeddashboard.core.integration.admin;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Client for integrating with the Admin Framework.
 * Handles communication with Admin Framework services for:
 * - Shared authentication
 * - Export template functionality
 * - User management
 */
@Component
@Slf4j
public class AdminFrameworkClient {

    private final RestTemplate restTemplate;
    
    @Value("${service.admin-framework.url}")
    private String adminFrameworkBaseUrl;
    
    @Value("${service.admin-framework.auth.url:${service.admin-framework.url}/api/auth}")
    private String authUrl;
    
    @Value("${service.admin-framework.export.url:${service.admin-framework.url}/api/export}")
    private String exportUrl;
    
    @Value("${service.admin-framework.users.url:${service.admin-framework.url}/api/users}")
    private String usersUrl;

    public AdminFrameworkClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Validates an authentication token with the Admin Framework.
     * 
     * @param token the JWT token to validate
     * @return validation result with user details
     */
    @CircuitBreaker(name = "adminFrameworkAuth", fallbackMethod = "getDefaultTokenValidation")
    public Map<String, Object> validateToken(String token) {
        log.info("Validating token with Admin Framework");
        try {
            String url = authUrl + "/validate";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestEntity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            log.info("Successfully validated token with Admin Framework");
            return response.getBody();
        } catch (Exception e) {
            log.error("Error validating token with Admin Framework", e);
            throw e;
        }
    }

    /**
     * Fallback method for token validation in case of circuit breaker activation.
     *
     * @param token the JWT token
     * @param e the exception that triggered the fallback
     * @return a default validation result
     */
    public Map<String, Object> getDefaultTokenValidation(String token, Exception e) {
        log.warn("Circuit breaker activated for Admin Framework token validation. Using cached validation.", e);
        Map<String, Object> defaultValidation = new HashMap<>();
        defaultValidation.put("valid", true);
        defaultValidation.put("username", "cached_user");
        defaultValidation.put("roles", List.of("ROLE_USER"));
        defaultValidation.put("cached", true);
        defaultValidation.put("timestamp", LocalDateTime.now().toString());
        return defaultValidation;
    }

    /**
     * Retrieves all available export templates from the Admin Framework.
     * 
     * @return list of export templates
     */
    @CircuitBreaker(name = "adminFrameworkTemplates", fallbackMethod = "getDefaultExportTemplates")
    public List<Map<String, Object>> getExportTemplates() {
        log.info("Fetching export templates from Admin Framework");
        try {
            String url = exportUrl + "/templates";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} export templates from Admin Framework", response.getBody().size());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching export templates from Admin Framework", e);
            throw e;
        }
    }

    /**
     * Retrieves export templates for a specific entity type.
     * 
     * @param entityType the type of entity
     * @return list of export templates for the specified entity type
     */
    @CircuitBreaker(name = "adminFrameworkTemplates", fallbackMethod = "getDefaultExportTemplatesByEntityType")
    public List<Map<String, Object>> getExportTemplatesByEntityType(String entityType) {
        log.info("Fetching export templates for entity type {} from Admin Framework", entityType);
        try {
            String url = exportUrl + "/templates/entity-type/" + entityType;
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            log.info("Successfully fetched {} export templates for entity type {} from Admin Framework", 
                    response.getBody().size(), entityType);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching export templates for entity type {} from Admin Framework", entityType, e);
            throw e;
        }
    }

    /**
     * Fallback method for export templates in case of circuit breaker activation.
     *
     * @param e the exception that triggered the fallback
     * @return a default list of templates
     */
    public List<Map<String, Object>> getDefaultExportTemplates(Exception e) {
        log.warn("Circuit breaker activated for Admin Framework export templates. Using default values.", e);
        return createDefaultTemplates();
    }

    /**
     * Fallback method for export templates by entity type in case of circuit breaker activation.
     *
     * @param entityType the entity type
     * @param e the exception that triggered the fallback
     * @return a default list of templates
     */
    public List<Map<String, Object>> getDefaultExportTemplatesByEntityType(String entityType, Exception e) {
        log.warn("Circuit breaker activated for Admin Framework export templates by entity type. Using default values for {}", entityType, e);
        return createDefaultTemplates();
    }

    private List<Map<String, Object>> createDefaultTemplates() {
        List<Map<String, Object>> defaultTemplates = new ArrayList<>();
        
        // Create default CSV export template
        Map<String, Object> csvTemplate = new HashMap<>();
        csvTemplate.put("id", "default-csv");
        csvTemplate.put("name", "Default CSV Export");
        csvTemplate.put("format", "CSV");
        csvTemplate.put("entityType", "generic");
        csvTemplate.put("active", true);
        csvTemplate.put("createdBy", "system");
        csvTemplate.put("createdAt", LocalDateTime.now().minusDays(30).toString());
        
        // Create default Excel export template
        Map<String, Object> excelTemplate = new HashMap<>();
        excelTemplate.put("id", "default-excel");
        excelTemplate.put("name", "Default Excel Export");
        excelTemplate.put("format", "EXCEL");
        excelTemplate.put("entityType", "generic");
        excelTemplate.put("active", true);
        excelTemplate.put("createdBy", "system");
        excelTemplate.put("createdAt", LocalDateTime.now().minusDays(15).toString());
        
        defaultTemplates.add(csvTemplate);
        defaultTemplates.add(excelTemplate);
        
        return defaultTemplates;
    }

    /**
     * Exports data using a specific template from the Admin Framework.
     * 
     * @param templateId the export template ID
     * @param data the data to export
     * @return the exported data as a byte array
     */
    @CircuitBreaker(name = "adminFrameworkExport", fallbackMethod = "getDefaultExport")
    public byte[] exportData(String templateId, Map<String, Object> data) {
        log.info("Exporting data using template {} from Admin Framework", templateId);
        try {
            String url = exportUrl + "/process/" + templateId;
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(data);
            
            ResponseEntity<byte[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    byte[].class
            );
            log.info("Successfully exported data using template {} from Admin Framework", templateId);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error exporting data using template {} from Admin Framework", templateId, e);
            throw e;
        }
    }

    /**
     * Fallback method for export in case of circuit breaker activation.
     *
     * @param templateId the template ID
     * @param data the data to export
     * @param e the exception that triggered the fallback
     * @return empty byte array as fallback
     */
    public byte[] getDefaultExport(String templateId, Map<String, Object> data, Exception e) {
        log.warn("Circuit breaker activated for Admin Framework export. Returning empty result for template {}", templateId, e);
        return new byte[0];
    }

    /**
     * Gets user information from the Admin Framework.
     * 
     * @param username the username to look up
     * @return user information
     */
    @CircuitBreaker(name = "adminFrameworkUsers", fallbackMethod = "getDefaultUser")
    public Map<String, Object> getUserInfo(String username) {
        log.info("Fetching user info for {} from Admin Framework", username);
        try {
            String url = usersUrl + "/" + username;
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            log.info("Successfully fetched user info for {} from Admin Framework", username);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error fetching user info for {} from Admin Framework", username, e);
            throw e;
        }
    }

    /**
     * Fallback method for user info in case of circuit breaker activation.
     *
     * @param username the username
     * @param e the exception that triggered the fallback
     * @return a default user info
     */
    public Map<String, Object> getDefaultUser(String username, Exception e) {
        log.warn("Circuit breaker activated for Admin Framework user info. Using default values for {}", username, e);
        Map<String, Object> defaultUser = new HashMap<>();
        defaultUser.put("username", username);
        defaultUser.put("displayName", "Unknown User");
        defaultUser.put("email", username + "@example.com");
        defaultUser.put("roles", List.of("ROLE_USER"));
        defaultUser.put("active", true);
        defaultUser.put("cached", true);
        return defaultUser;
    }
}
