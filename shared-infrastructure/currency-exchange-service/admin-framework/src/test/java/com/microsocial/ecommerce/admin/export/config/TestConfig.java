package com.exalt.shared.ecommerce.admin.export.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsocial.ecommerce.admin.export.ExportService;
import com.microsocial.ecommerce.admin.export.handler.*;
import com.microsocial.ecommerce.admin.export.repository.ExportTemplateRepository;
import com.microsocial.ecommerce.admin.export.service.ExportTemplateService;
import com.microsocial.ecommerce.admin.export.service.TemplateProcessor;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import java.util.ArrayList;
import java.util.List;

/**
 * Test configuration for the Export Service tests.
 * Provides mock and test-specific beans.
 */
@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    @Primary
    public TemplateProcessor templateProcessor(ObjectMapper objectMapper) {
        return new TemplateProcessor(objectMapper);
    }

    @Bean
    @Primary
    public ExportTemplateService exportTemplateService(ExportTemplateRepository templateRepository) {
        return new ExportTemplateService(templateRepository);
    }

    @Bean
    @Primary
    public ExportService exportService(
            List<ExportHandler> exportHandlers,
            List<ExportTemplateHandler> templateHandlers,
            ExportTemplateService exportTemplateService,
            TemplateProcessor templateProcessor) {
        return new com.microsocial.ecommerce.admin.export.ExportService() {
            @Override
            public <T> void exportData(List<T> data, com.microsocial.ecommerce.admin.export.ExportFormat format, java.io.OutputStream outputStream, java.util.Map<String, Object> options) {
                // Mock implementation
            }

            @Override
            public <T> void exportWithTemplate(List<T> data, String templateName, java.io.OutputStream outputStream, java.util.Map<String, Object> options) {
                // Mock implementation
            }

            @Override
            public java.util.List<com.microsocial.ecommerce.admin.export.ExportFormat> getSupportedFormats() {
                return java.util.List.of(com.microsocial.ecommerce.admin.export.ExportFormat.CSV, 
                                       com.microsocial.ecommerce.admin.export.ExportFormat.EXCEL,
                                       com.microsocial.ecommerce.admin.export.ExportFormat.PDF,
                                       com.microsocial.ecommerce.admin.export.ExportFormat.JSON,
                                       com.microsocial.ecommerce.admin.export.ExportFormat.XML);
            }

            @Override
            public boolean isFormatSupported(com.microsocial.ecommerce.admin.export.ExportFormat format) {
                return true;
            }
        };
    }

    @Bean
    @Primary
    public List<ExportHandler> exportHandlers(ObjectMapper objectMapper) {
        List<ExportHandler> handlers = new ArrayList<>();
        handlers.add(new CsvExportHandler());
        handlers.add(new ExcelExportHandler());
        handlers.add(new PdfExportHandler());
        handlers.add(new JsonExportHandler(objectMapper));
        handlers.add(new XmlExportHandler(objectMapper));
        return handlers;
    }

    @Bean
    @Primary
    public List<ExportTemplateHandler> templateHandlers() {
        return new ArrayList<>();
    }
}
