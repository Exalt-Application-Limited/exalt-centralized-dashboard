package com.gogidix.centralizeddashboard.core.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

/**
 * OpenAPI/Swagger Configuration
 * Provides API documentation for the Centralized Dashboard REST endpoints
 */
@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:Centralized Dashboard}")
    private String applicationName;

    @Value("${openapi.server.url:http://localhost:8085}")
    private String serverUrl;

    /**
     * Configure OpenAPI documentation
     *
     * @return OpenAPI configuration
     */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(servers())
                .components(securityComponents())
                .security(List.of(new SecurityRequirement().addList("bearerAuth")));
    }

    /**
     * Configure API information
     *
     * @return API Info
     */
    private Info apiInfo() {
        return new Info()
                .title("Centralized Dashboard API")
                .description("REST API documentation for the Micro-Social-Ecommerce Centralized Dashboard")
                .version("1.0.0")
                .contact(new Contact()
                        .name("Micro-Services Social-Ecommerce App")
                        .url("https://github.com/orgs/Micro-Services-Social-Ecommerce-App/repositories")
                        .email("techoneacces@yahoo.com"))
                .license(new License()
                        .name("MIT License")
                        .url("https://opensource.org/licenses/MIT"));
    }

    /**
     * Configure server information
     *
     * @return List of servers
     */
    private List<Server> servers() {
        Server devServer = new Server()
                .url(serverUrl)
                .description("Development Server");

        Server stagingServer = new Server()
                .url(serverUrl.replace("localhost", "staging.microecosystem.com"))
                .description("Staging Server");

        Server productionServer = new Server()
                .url(serverUrl.replace("localhost", "api.microecosystem.com"))
                .description("Production Server");

        return Arrays.asList(devServer, stagingServer, productionServer);
    }

    /**
     * Configure security components
     *
     * @return Security components
     */
    private Components securityComponents() {
        return new Components()
                .addSecuritySchemes("bearerAuth", 
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT Authentication. Enter the JWT token in the format: Bearer {token}"));
    }
}
