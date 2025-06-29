package com.exalt.centralizeddashboard.analytics.aggregation.model;

/**
 * Enum representing different types of analytics events 
 * that can be collected and processed
 */
public enum EventType {
    // User activity events
    PAGE_VIEW,
    PRODUCT_VIEW,
    SEARCH,
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CHECKOUT_START,
    CHECKOUT_COMPLETE,
    USER_REGISTRATION,
    USER_LOGIN,
    USER_LOGOUT,
    
    // Seller activity events
    PRODUCT_CREATE,
    PRODUCT_UPDATE,
    PRODUCT_DELETE,
    OFFER_CREATE,
    OFFER_UPDATE,
    OFFER_DELETE,
    
    // Order events
    ORDER_CREATED,
    ORDER_UPDATED,
    ORDER_FULFILLED,
    ORDER_CANCELLED,
    
    // Payment events
    PAYMENT_INITIATED,
    PAYMENT_COMPLETED,
    PAYMENT_FAILED,
    REFUND_INITIATED,
    REFUND_COMPLETED,
    
    // Inventory events
    INVENTORY_UPDATED,
    LOW_STOCK_ALERT,
    OUT_OF_STOCK,
    
    // Warehouse events
    WAREHOUSE_TASK_CREATED,
    WAREHOUSE_TASK_COMPLETED,
    
    // System events
    SERVICE_ERROR,
    SERVICE_HEALTH_CHECK,
    API_RATE_LIMIT_EXCEEDED,
    
    // Other events
    CUSTOM
} 