package com.gogidix.centralizeddashboard.core.controller;

import com.gogidix.centralizeddashboard.core.integration.admin.AdminFrameworkClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for Admin Framework integration.
 * Provides endpoints for accessing Admin Framework functionality directly from the
 * centralized dashboard, enabling cross-system navigation and unified user experience.
 */
@RestController
@RequestMapping("/api/admin-framework")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin Framework Integration", description = "Endpoints for integrating with the Admin Framework services")
@SecurityRequirement(name = "bearerAuth")
public class AdminFrameworkIntegrationController {

    private final AdminFrameworkClient adminFrameworkClient;

    /**
     * Validates a user's authentication token with the Admin Framework.
     * 
     * @param jwt the authentication token
     * @return validation result with user details
     */
    @Operation(summary = "Validate authentication token", description = "Validates the current user's JWT token with the Admin Framework and returns user details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token successfully validated", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized, invalid token", content = @Content),
        @ApiResponse(responseCode = "503", description = "Admin Framework service unavailable", content = @Content)
    })
    @GetMapping("/auth/validate")
    public ResponseEntity<Map<String, Object>> validateToken(
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        log.info("Validating token with Admin Framework");
        Map<String, Object> validationResult = adminFrameworkClient.validateToken(jwt.getTokenValue());
        return ResponseEntity.ok(validationResult);
    }

    /**
     * Gets all export templates from the Admin Framework.
     * 
     * @return list of export templates
     */
    @Operation(summary = "Get all export templates", description = "Retrieves all available export templates from the Admin Framework")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved export templates", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
        @ApiResponse(responseCode = "503", description = "Admin Framework service unavailable", content = @Content)
    })
    @GetMapping("/export/templates")
    public ResponseEntity<List<Map<String, Object>>> getExportTemplates() {
        log.info("Fetching export templates from Admin Framework");
        List<Map<String, Object>> templates = adminFrameworkClient.getExportTemplates();
        return ResponseEntity.ok(templates);
    }

    /**
     * Gets export templates for a specific entity type from the Admin Framework.
     * 
     * @param entityType the entity type to filter templates by
     * @return list of export templates for the specified entity type
     */
    @Operation(summary = "Get export templates by entity type", description = "Retrieves export templates for a specific entity type from the Admin Framework")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved export templates", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
        @ApiResponse(responseCode = "404", description = "No templates found for entity type", content = @Content),
        @ApiResponse(responseCode = "503", description = "Admin Framework service unavailable", content = @Content)
    })
    @GetMapping("/export/templates/entity-type/{entityType}")
    public ResponseEntity<List<Map<String, Object>>> getExportTemplatesByEntityType(
            @Parameter(description = "Entity type to filter templates by", required = true, example = "product") 
            @PathVariable String entityType) {
        log.info("Fetching export templates for entity type {} from Admin Framework", entityType);
        List<Map<String, Object>> templates = adminFrameworkClient.getExportTemplatesByEntityType(entityType);
        return ResponseEntity.ok(templates);
    }

    /**
     * Exports data using a specific template from the Admin Framework.
     * 
     * @param templateId the export template ID
     * @param data the data to export
     * @return the exported data
     */
    @Operation(summary = "Export data using a template", 
            description = "Exports data using a specific template from the Admin Framework. Supports various formats including CSV, Excel, PDF, JSON, and XML")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Data successfully exported", 
                content = @Content(mediaType = "*/*", schema = @Schema(type = "string", format = "binary"))),
        @ApiResponse(responseCode = "400", description = "Invalid request parameters", content = @Content),
        @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
        @ApiResponse(responseCode = "404", description = "Template not found", content = @Content),
        @ApiResponse(responseCode = "503", description = "Admin Framework service unavailable", content = @Content)
    })
    @PostMapping("/export/process/{templateId}")
    public ResponseEntity<byte[]> exportData(
            @Parameter(description = "Export template ID to use", required = true, example = "template-123") 
            @PathVariable String templateId,
            @Parameter(description = "Data to export and export format options", required = true) 
            @RequestBody Map<String, Object> data) {
        log.info("Exporting data using template {} from Admin Framework", templateId);
        byte[] exportedData = adminFrameworkClient.exportData(templateId, data);
        
        // Determine content type based on export format (should be in the data map)
        String format = (String) data.getOrDefault("format", "CSV");
        MediaType mediaType = switch (format.toUpperCase()) {
            case "EXCEL" -> MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            case "PDF" -> MediaType.APPLICATION_PDF;
            case "JSON" -> MediaType.APPLICATION_JSON;
            case "XML" -> MediaType.APPLICATION_XML;
            default -> MediaType.parseMediaType("text/csv");
        };
        
        // Set filename based on template ID and format
        String filename = "export_" + templateId + "." + format.toLowerCase();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDispositionFormData("attachment", filename);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(exportedData);
    }

    /**
     * Gets user information from the Admin Framework.
     * 
     * @param username the username to look up
     * @return user information
     */
    @Operation(summary = "Get user information", description = "Retrieves detailed user information from the Admin Framework by username")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user information", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
        @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
        @ApiResponse(responseCode = "503", description = "Admin Framework service unavailable", content = @Content)
    })
    @GetMapping("/users/{username}")
    public ResponseEntity<Map<String, Object>> getUserInfo(
            @Parameter(description = "Username to look up", required = true, example = "john.doe") 
            @PathVariable String username) {
        log.info("Fetching user info for {} from Admin Framework", username);
        Map<String, Object> userInfo = adminFrameworkClient.getUserInfo(username);
        return ResponseEntity.ok(userInfo);
    }

    /**
     * Gets the current user's information from the Admin Framework.
     * 
     * @param jwt the authentication token
     * @return user information
     */
    @Operation(summary = "Get current user information", description = "Retrieves the current authenticated user's information from the Admin Framework")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user information", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
        @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
        @ApiResponse(responseCode = "503", description = "Admin Framework service unavailable", content = @Content)
    })
    @GetMapping("/users/me")
    public ResponseEntity<Map<String, Object>> getCurrentUserInfo(
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaim("preferred_username");
        log.info("Fetching current user info for {} from Admin Framework", username);
        Map<String, Object> userInfo = adminFrameworkClient.getUserInfo(username);
        return ResponseEntity.ok(userInfo);
    }

    /**
     * Health check endpoint for Admin Framework connectivity.
     * 
     * @return status message
     */
    @Operation(summary = "Health check", description = "Checks connectivity to the Admin Framework service")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Admin Framework is available", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
        @ApiResponse(responseCode = "503", description = "Admin Framework service unavailable", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
    })
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        try {
            // Just attempt to get templates as a connectivity test
            adminFrameworkClient.getExportTemplates();
            
            Map<String, Object> status = Map.of(
                "status", "UP",
                "message", "Successfully connected to Admin Framework",
                "timestamp", System.currentTimeMillis()
            );
            
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            Map<String, Object> status = Map.of(
                "status", "DOWN",
                "message", "Failed to connect to Admin Framework: " + e.getMessage(),
                "timestamp", System.currentTimeMillis()
            );
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(status);
        }
    }
}
