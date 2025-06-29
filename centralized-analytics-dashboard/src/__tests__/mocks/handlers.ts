// Mock Service Worker handlers for API testing
import { rest } from 'msw';

// Mock API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export const handlers = [
  // Authentication endpoints
  rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          roles: ['USER', 'ADMIN'],
        },
      })
    );
  }),

  rest.post(`${API_BASE_URL}/auth/logout`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Logged out successfully' }));
  }),

  // Dashboard KPIs
  rest.get(`${API_BASE_URL}/dashboard/kpis`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalRevenue: 1250000,
        totalOrders: 3450,
        avgOrderValue: 362.32,
        conversionRate: 3.2,
        activeUsers: 12850,
        inventoryTurnover: 8.5,
        trends: {
          revenue: 5.9,
          orders: 7.8,
          aov: -1.7,
          conversion: 10.3,
          users: 14.7,
          turnover: 8.7,
        },
      })
    );
  }),

  // Analytics data
  rest.get(`${API_BASE_URL}/analytics/inventory`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        summary: {
          totalItems: 1245,
          lowStockItems: 23,
          outOfStockItems: 5,
          totalValue: 875000,
        },
        items: [
          { id: 1, name: 'Product A', stock: 150, reorderLevel: 50, status: 'In Stock', value: 15000 },
          { id: 2, name: 'Product B', stock: 25, reorderLevel: 30, status: 'Low Stock', value: 7500 },
          { id: 3, name: 'Product C', stock: 0, reorderLevel: 20, status: 'Out of Stock', value: 0 },
        ],
        chartData: [
          { category: 'Electronics', inStock: 450, lowStock: 12, outOfStock: 2 },
          { category: 'Clothing', inStock: 320, lowStock: 8, outOfStock: 1 },
          { category: 'Home', inStock: 275, lowStock: 3, outOfStock: 2 },
        ],
      })
    );
  }),

  rest.get(`${API_BASE_URL}/analytics/orders`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        summary: {
          totalOrders: 3450,
          totalRevenue: 1250000,
          avgOrderValue: 362.32,
          conversionRate: 3.2,
        },
        chartData: [
          { date: '2025-05-01', orders: 120, revenue: 43500 },
          { date: '2025-05-02', orders: 135, revenue: 48900 },
          { date: '2025-05-03', orders: 110, revenue: 39800 },
          { date: '2025-05-04', orders: 145, revenue: 52300 },
        ],
        topProducts: [
          { name: 'Product A', orders: 450, revenue: 162000 },
          { name: 'Product B', orders: 320, revenue: 115200 },
          { name: 'Product C', orders: 280, revenue: 100800 },
        ],
      })
    );
  }),

  rest.get(`${API_BASE_URL}/analytics/shipping`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        summary: {
          totalShipments: 3200,
          onTimeDelivery: 87.5,
          avgDeliveryTime: 2.3,
          pendingShipments: 125,
        },
        performanceData: [
          { carrier: 'DHL', onTime: 92, avgDays: 1.8, cost: 15.50 },
          { carrier: 'FedEx', onTime: 88, avgDays: 2.1, cost: 18.20 },
          { carrier: 'UPS', onTime: 85, avgDays: 2.5, cost: 16.80 },
        ],
        deliveryTrends: [
          { date: '2025-05-01', onTime: 88, delayed: 12 },
          { date: '2025-05-02', onTime: 92, delayed: 8 },
          { date: '2025-05-03', onTime: 85, delayed: 15 },
        ],
      })
    );
  }),

  rest.get(`${API_BASE_URL}/analytics/users`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        summary: {
          totalUsers: 12850,
          activeUsers: 8420,
          newUsers: 324,
          userGrowth: 14.7,
        },
        demographics: [
          { ageGroup: '18-24', count: 2850, percentage: 22.2 },
          { ageGroup: '25-34', count: 4200, percentage: 32.7 },
          { ageGroup: '35-44', count: 3150, percentage: 24.5 },
          { ageGroup: '45-54', count: 1890, percentage: 14.7 },
          { ageGroup: '55+', count: 760, percentage: 5.9 },
        ],
        activityData: [
          { date: '2025-05-01', pageViews: 15420, sessions: 8200, bounceRate: 35.2 },
          { date: '2025-05-02', pageViews: 16890, sessions: 8750, bounceRate: 32.8 },
          { date: '2025-05-03', pageViews: 14230, sessions: 7920, bounceRate: 38.1 },
        ],
      })
    );
  }),

  // Real-time data endpoints
  rest.get(`${API_BASE_URL}/realtime/metrics`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        timestamp: new Date().toISOString(),
        metrics: {
          activeUsers: Math.floor(Math.random() * 1000) + 500,
          currentOrders: Math.floor(Math.random() * 50) + 10,
          serverLoad: Math.random() * 100,
          responseTime: Math.random() * 500 + 100,
        },
      })
    );
  }),

  rest.get(`${API_BASE_URL}/realtime/alerts`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          type: 'warning',
          message: 'Low stock alert for Product B',
          timestamp: new Date().toISOString(),
          domain: 'inventory',
        },
        {
          id: 2,
          type: 'info',
          message: 'New order received: #12345',
          timestamp: new Date().toISOString(),
          domain: 'orders',
        },
      ])
    );
  }),

  // Health check endpoints
  rest.get(`${API_BASE_URL}/health`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'UP',
        services: {
          database: 'UP',
          redis: 'UP',
          elasticsearch: 'UP',
        },
      })
    );
  }),

  // Error responses for testing error handling
  rest.get(`${API_BASE_URL}/test/error`, (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        error: 'Internal Server Error',
        message: 'This is a test error for error handling',
      })
    );
  }),

  rest.get(`${API_BASE_URL}/test/unauthorized`, (req, res, ctx) => {
    return res(
      ctx.status(401),
      ctx.json({
        error: 'Unauthorized',
        message: 'Authentication required',
      })
    );
  }),
];

// Export default for easy importing
export default handlers;
