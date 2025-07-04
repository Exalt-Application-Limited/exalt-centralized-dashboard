import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { authService } from './authService';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Domain service endpoints
export const API_ENDPOINTS = {
  // Shared Infrastructure
  AUTH: `${API_BASE_URL}/api/v1/auth`,
  USERS: `${API_BASE_URL}/api/v1/users`,
  NOTIFICATIONS: `${API_BASE_URL}/api/v1/notifications`,
  FILES: `${API_BASE_URL}/api/v1/files`,
  ANALYTICS: `${API_BASE_URL}/api/v1/analytics`,
  
  // Centralized Dashboard
  DASHBOARD: `${API_BASE_URL}/api/v1/dashboard`,
  METRICS: `${API_BASE_URL}/api/v1/metrics`,
  REPORTS: `${API_BASE_URL}/api/v1/reports`,
  AGGREGATION: `${API_BASE_URL}/api/v1/data-aggregation`,
  
  // Social Commerce
  SOCIAL_COMMERCE: `${API_BASE_URL}/api/v1/social-commerce`,
  ORDERS: `${API_BASE_URL}/api/v1/orders`,
  PRODUCTS: `${API_BASE_URL}/api/v1/products`,
  VENDORS: `${API_BASE_URL}/api/v1/vendors`,
  MARKETPLACE: `${API_BASE_URL}/api/v1/marketplace`,
  
  // Warehousing
  WAREHOUSING: `${API_BASE_URL}/api/v1/warehousing`,
  INVENTORY: `${API_BASE_URL}/api/v1/inventory`,
  FULFILLMENT: `${API_BASE_URL}/api/v1/fulfillment`,
  STORAGE: `${API_BASE_URL}/api/v1/storage`,
  
  // Courier Services
  COURIER: `${API_BASE_URL}/api/v1/courier`,
  SHIPMENTS: `${API_BASE_URL}/api/v1/shipments`,
  TRACKING: `${API_BASE_URL}/api/v1/tracking`,
  DELIVERY: `${API_BASE_URL}/api/v1/delivery`,
  
  // Haulage Logistics
  HAULAGE: `${API_BASE_URL}/api/v1/haulage`,
  LOGISTICS: `${API_BASE_URL}/api/v1/logistics`,
  FLEET: `${API_BASE_URL}/api/v1/fleet`,
  ROUTES: `${API_BASE_URL}/api/v1/routes`,
};

// Create API client
const createApiClient = (baseURL: string = API_BASE_URL): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await authService.refreshToken();
          const token = authService.getToken();
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// API service class
class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = createApiClient();
  }

  // Generic CRUD operations
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  // Domain-specific service methods

  // Dashboard Services
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.get<DashboardMetrics>('/api/v1/dashboard/metrics');
  }

  async getDomainHealth(): Promise<DomainHealth[]> {
    return this.get<DomainHealth[]>('/api/v1/dashboard/domain-health');
  }

  async getGlobalPerformance(timeRange: string): Promise<GlobalPerformance> {
    return this.get<GlobalPerformance>(`/api/v1/dashboard/performance?range=${timeRange}`);
  }

  // Social Commerce Services
  async getSocialCommerceMetrics(): Promise<SocialCommerceMetrics> {
    return this.get<SocialCommerceMetrics>('/api/v1/social-commerce/metrics');
  }

  async getOrderAnalytics(filters: OrderFilters): Promise<OrderAnalytics> {
    return this.post<OrderAnalytics>('/api/v1/orders/analytics', filters);
  }

  async getVendorPerformance(): Promise<VendorPerformance[]> {
    return this.get<VendorPerformance[]>('/api/v1/vendors/performance');
  }

  // Warehousing Services
  async getWarehousingMetrics(): Promise<WarehousingMetrics> {
    return this.get<WarehousingMetrics>('/api/v1/warehousing/metrics');
  }

  async getInventoryLevels(): Promise<InventoryLevel[]> {
    return this.get<InventoryLevel[]>('/api/v1/inventory/levels');
  }

  async getFulfillmentStatus(): Promise<FulfillmentStatus> {
    return this.get<FulfillmentStatus>('/api/v1/fulfillment/status');
  }

  // Courier Services
  async getCourierMetrics(): Promise<CourierMetrics> {
    return this.get<CourierMetrics>('/api/v1/courier/metrics');
  }

  async getShipmentTracking(shipmentId: string): Promise<ShipmentTracking> {
    return this.get<ShipmentTracking>(`/api/v1/tracking/${shipmentId}`);
  }

  async getDeliveryPerformance(): Promise<DeliveryPerformance> {
    return this.get<DeliveryPerformance>('/api/v1/delivery/performance');
  }

  // Haulage Logistics Services
  async getHaulageMetrics(): Promise<HaulageMetrics> {
    return this.get<HaulageMetrics>('/api/v1/haulage/metrics');
  }

  async getFleetStatus(): Promise<FleetStatus[]> {
    return this.get<FleetStatus[]>('/api/v1/fleet/status');
  }

  async getRouteOptimization(): Promise<RouteOptimization> {
    return this.get<RouteOptimization>('/api/v1/routes/optimization');
  }

  // Shared Infrastructure Services
  async getSystemHealth(): Promise<SystemHealth> {
    return this.get<SystemHealth>('/api/v1/system/health');
  }

  async getInfrastructureMetrics(): Promise<InfrastructureMetrics> {
    return this.get<InfrastructureMetrics>('/api/v1/infrastructure/metrics');
  }

  async getNotifications(): Promise<Notification[]> {
    return this.get<Notification[]>('/api/v1/notifications');
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.patch(`/api/v1/notifications/${notificationId}/read`);
  }

  // Stakeholder Management
  async getStakeholders(): Promise<Stakeholder[]> {
    return this.get<Stakeholder[]>('/api/v1/stakeholders');
  }

  async inviteStakeholder(invitation: StakeholderInvitation): Promise<void> {
    await this.post('/api/v1/stakeholders/invite', invitation);
  }

  async updateStakeholderRole(stakeholderId: string, role: string): Promise<void> {
    await this.patch(`/api/v1/stakeholders/${stakeholderId}/role`, { role });
  }

  // File upload
  async uploadFile(file: File, category: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    return this.post<FileUploadResponse>('/api/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

// Type definitions
export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  systemHealth: number;
  domains: {
    socialCommerce: DomainMetric;
    warehousing: DomainMetric;
    courier: DomainMetric;
    haulage: DomainMetric;
    infrastructure: DomainMetric;
  };
}

export interface DomainMetric {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  performance: number;
  users: number;
  revenue?: number;
}

export interface DomainHealth {
  domain: string;
  status: 'healthy' | 'warning' | 'critical';
  services: ServiceHealth[];
  lastChecked: string;
}

export interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  uptime: number;
}

export interface GlobalPerformance {
  revenue: TimeSeries[];
  orders: TimeSeries[];
  users: TimeSeries[];
  performance: TimeSeries[];
}

export interface TimeSeries {
  timestamp: string;
  value: number;
}

export interface SocialCommerceMetrics {
  totalRevenue: number;
  orderCount: number;
  vendorCount: number;
  customerCount: number;
  conversionRate: number;
  averageOrderValue: number;
}

export interface OrderFilters {
  startDate?: string;
  endDate?: string;
  status?: string[];
  vendor?: string;
  region?: string;
}

export interface OrderAnalytics {
  totalOrders: number;
  revenue: number;
  averageOrderValue: number;
  topProducts: Product[];
  ordersByStatus: StatusCount[];
  revenueByRegion: RegionRevenue[];
}

export interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface RegionRevenue {
  region: string;
  revenue: number;
  orders: number;
}

export interface VendorPerformance {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  rating: number;
  fulfillmentRate: number;
}

export interface WarehousingMetrics {
  totalCapacity: number;
  usedCapacity: number;
  availableSpace: number;
  facilities: number;
  occupancyRate: number;
}

export interface InventoryLevel {
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface FulfillmentStatus {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  averageProcessingTime: number;
}

export interface CourierMetrics {
  activeShipments: number;
  deliveredToday: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  customerSatisfaction: number;
}

export interface ShipmentTracking {
  id: string;
  status: string;
  currentLocation: string;
  estimatedDelivery: string;
  trackingHistory: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface DeliveryPerformance {
  onTimeRate: number;
  averageDeliveryTime: number;
  customerSatisfaction: number;
  deliveriesByRegion: RegionDeliveries[];
}

export interface RegionDeliveries {
  region: string;
  deliveries: number;
  onTimeRate: number;
}

export interface HaulageMetrics {
  activeVehicles: number;
  totalCapacity: number;
  utilizationRate: number;
  averageDistance: number;
  fuelEfficiency: number;
}

export interface FleetStatus {
  vehicleId: string;
  vehicleType: string;
  status: 'active' | 'maintenance' | 'idle';
  location: string;
  capacity: number;
  utilization: number;
}

export interface RouteOptimization {
  totalRoutes: number;
  optimizedRoutes: number;
  fuelSavings: number;
  timeSavings: number;
  recommendations: RouteRecommendation[];
}

export interface RouteRecommendation {
  routeId: string;
  currentDistance: number;
  optimizedDistance: number;
  savings: number;
}

export interface SystemHealth {
  overallStatus: 'healthy' | 'warning' | 'critical';
  services: ServiceHealth[];
  resourceUsage: ResourceUsage;
}

export interface ResourceUsage {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  action?: NotificationAction;
}

export interface NotificationAction {
  label: string;
  url: string;
}

export interface Stakeholder {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessLevel: string;
  department: string;
  invitedAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface StakeholderInvitation {
  email: string;
  role: string;
  accessLevel: string;
  department: string;
  message?: string;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface InfrastructureMetrics {
  totalServices: number;
  healthyServices: number;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  networkThroughput: number;
  uptime: number;
  activeConnections: number;
}

// Export singleton instance
export const apiService = new ApiService();