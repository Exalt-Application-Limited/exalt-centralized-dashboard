package com.exalt.centralizeddashboard.core;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.test.web.servlet.MvcResult;

import java.io.UnsupportedEncodingException;

public class TestUtils {
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    public static String asJsonString(final Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert object to JSON string", e);
        }
    }
    
    public static <T> T fromJson(MvcResult result, Class<T> clazz) 
            throws UnsupportedEncodingException, JsonProcessingException {
        String contentAsString = result.getResponse().getContentAsString();
        return objectMapper.readValue(contentAsString, clazz);
    }
    
    public static String getAuthHeader(String token) {
        return "Bearer " + token;
    }
    
    // Add other common test utilities here
}
