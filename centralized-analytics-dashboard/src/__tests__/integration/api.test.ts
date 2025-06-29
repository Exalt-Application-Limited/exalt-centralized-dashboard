// API Integration Tests
import { setupMSW } from '../mocks/server';

// Setup MSW server for all tests
setupMSW();

describe('API Integration Tests', () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

  describe('Authentication API', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'password123',
        }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('username', 'testuser');
      expect(data.user).toHaveProperty('roles');
    });

    it('should logout successfully', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token',
        },
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toHaveProperty('message');
    });
  });

  describe('Dashboard KPI API', () => {
    it('should fetch dashboard KPIs', async () => {
      const response = await fetch(`${API_BASE_URL}/dashboard/kpis`);
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('totalRevenue');
      expect(data).toHaveProperty('totalOrders');
      expect(data).toHaveProperty('avgOrderValue');
      expect(data).toHaveProperty('conversionRate');
      expect(data).toHaveProperty('activeUsers');
      expect(data).toHaveProperty('inventoryTurnover');
      expect(data).toHaveProperty('trends');
      
      // Validate data types
      expect(typeof data.totalRevenue).toBe('number');
      expect(typeof data.totalOrders).toBe('number');
      expect(typeof data.avgOrderValue).toBe('number');
      expect(typeof data.conversionRate).toBe('number');
    });
  });

  describe('Analytics API', () => {
    it('should fetch inventory analytics', async () => {
      const response = await fetch(`${API_BASE_URL}/analytics/inventory`);
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('summary');
      expect(data).toHaveProperty('items');
      expect(data).toHaveProperty('chartData');
      
      // Validate summary structure
      expect(data.summary).toHaveProperty('totalItems');
      expect(data.summary).toHaveProperty('lowStockItems');
      expect(data.summary).toHaveProperty('outOfStockItems');
      expect(data.summary).toHaveProperty('totalValue');
      
      // Validate items array
      expect(Array.isArray(data.items)).toBe(true);
      if (data.items.length > 0) {
        const item = data.items[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('stock');
        expect(item).toHaveProperty('status');
      }
    });

    it('should fetch order analytics', async () => {
      const response = await fetch(`${API_BASE_URL}/analytics/orders`);
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('summary');
      expect(data).toHaveProperty('chartData');
      expect(data).toHaveProperty('topProducts');
      
      expect(Array.isArray(data.chartData)).toBe(true);
      expect(Array.isArray(data.topProducts)).toBe(true);
    });

    it('should fetch shipping analytics', async () => {
      const response = await fetch(`${API_BASE_URL}/analytics/shipping`);
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('summary');
      expect(data).toHaveProperty('performanceData');
      expect(data).toHaveProperty('deliveryTrends');
      
      expect(data.summary).toHaveProperty('totalShipments');
      expect(data.summary).toHaveProperty('onTimeDelivery');
      expect(data.summary).toHaveProperty('avgDeliveryTime');
    });

    it('should fetch user analytics', async () => {
      const response = await fetch(`${API_BASE_URL}/analytics/users`);
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('summary');
      expect(data).toHaveProperty('demographics');
      expect(data).toHaveProperty('activityData');
      
      expect(Array.isArray(data.demographics)).toBe(true);
      expect(Array.isArray(data.activityData)).toBe(true);
    });
  });

  describe('Real-time API', () => {
    it('should fetch real-time metrics', async () => {
      const response = await fetch(`${API_BASE_URL}/realtime/metrics`);
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('metrics');
      
      expect(data.metrics).toHaveProperty('activeUsers');
      expect(data.metrics).toHaveProperty('currentOrders');
      expect(data.metrics).toHaveProperty('serverLoad');
      expect(data.metrics).toHaveProperty('responseTime');
      
      // Validate timestamp format
      expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
    });

    it('should fetch real-time alerts', async () => {
      const response = await fetch(`${API_BASE_URL}/realtime/alerts`);
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(Array.isArray(data)).toBe(true);
      
      if (data.length > 0) {
        const alert = data[0];
        expect(alert).toHaveProperty('id');
        expect(alert).toHaveProperty('type');
        expect(alert).toHaveProperty('message');
        expect(alert).toHaveProperty('timestamp');
        expect(alert).toHaveProperty('domain');
      }
    });
  });

  describe('Health Check API', () => {
    it('should return system health status', async () => {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('services');
      
      expect(['UP', 'DOWN', 'DEGRADED']).toContain(data.status);
      
      expect(data.services).toHaveProperty('database');
      expect(data.services).toHaveProperty('redis');
      expect(data.services).toHaveProperty('elasticsearch');
    });
  });

  describe('Error Handling', () => {
    it('should handle 500 server errors', async () => {
      const response = await fetch(`${API_BASE_URL}/test/error`);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('message');
    });

    it('should handle 401 unauthorized errors', async () => {
      const response = await fetch(`${API_BASE_URL}/test/unauthorized`);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle network errors gracefully', async () => {
      try {
        await fetch('http://localhost:9999/invalid-endpoint');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Request Headers and CORS', () => {
    it('should accept JSON content type', async () => {
      const response = await fetch(`${API_BASE_URL}/dashboard/kpis`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.ok).toBe(true);
    });

    it('should handle authorization headers', async () => {
      const response = await fetch(`${API_BASE_URL}/dashboard/kpis`, {
        headers: {
          'Authorization': 'Bearer mock-token',
        },
      });
      
      expect(response.ok).toBe(true);
    });
  });

  describe('Data Validation', () => {
    it('should validate KPI data ranges', async () => {
      const response = await fetch(`${API_BASE_URL}/dashboard/kpis`);
      const data = await response.json();
      
      // Revenue should be positive
      expect(data.totalRevenue).toBeGreaterThan(0);
      
      // Orders should be non-negative integers
      expect(data.totalOrders).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(data.totalOrders)).toBe(true);
      
      // Conversion rate should be between 0 and 100
      expect(data.conversionRate).toBeGreaterThanOrEqual(0);
      expect(data.conversionRate).toBeLessThanOrEqual(100);
      
      // Active users should be non-negative
      expect(data.activeUsers).toBeGreaterThanOrEqual(0);
    });

    it('should validate inventory data consistency', async () => {
      const response = await fetch(`${API_BASE_URL}/analytics/inventory`);
      const data = await response.json();
      
      // Stock levels should be non-negative
      data.items.forEach((item: any) => {
        expect(item.stock).toBeGreaterThanOrEqual(0);
        expect(item.reorderLevel).toBeGreaterThanOrEqual(0);
        
        // Status should match stock level
        if (item.stock === 0) {
          expect(item.status).toBe('Out of Stock');
        } else if (item.stock <= item.reorderLevel) {
          expect(item.status).toBe('Low Stock');
        } else {
          expect(item.status).toBe('In Stock');
        }
      });
    });
  });

  describe('Performance Tests', () => {
    it('should respond within acceptable time limits', async () => {
      const startTime = Date.now();
      
      const response = await fetch(`${API_BASE_URL}/dashboard/kpis`);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(response.ok).toBe(true);
      expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
    });

    it('should handle concurrent requests', async () => {
      const requests = [
        fetch(`${API_BASE_URL}/dashboard/kpis`),
        fetch(`${API_BASE_URL}/analytics/inventory`),
        fetch(`${API_BASE_URL}/analytics/orders`),
        fetch(`${API_BASE_URL}/realtime/metrics`),
      ];
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.ok).toBe(true);
      });
    });
  });
});
