# Centralized Analytics Dashboard API Documentation

## Frontend Components API

### Core Dashboard Components

#### RealTimeDashboard
- RealTimeDashboard(): Default constructor
- RealTimeDashboard(props: DashboardProps): Constructor with configuration
- refreshData(): Trigger manual data refresh
- updateLayout(layout: Layout[]): Update dashboard widget layout
- exportDashboard(format: 'pdf' | 'png' | 'svg'): Export dashboard visualization
- setFilters(filters: DashboardFilters): Apply data filters
- resetFilters(): Clear all applied filters

#### InteractiveDashboardChart
- InteractiveDashboardChart(props: ChartProps): Constructor with chart configuration
- onDataPointClick(handler: (dataPoint: DataPoint) => void): Set click event handler
- onZoom(handler: (zoomLevel: ZoomConfig) => void): Set zoom event handler
- updateData(data: ChartData): Update chart data
- setChartType(type: 'line' | 'bar' | 'area' | 'pie'): Change visualization type
- enableDrillDown(enabled: boolean): Enable/disable drill-down functionality
- exportChart(format: 'png' | 'svg' | 'pdf'): Export chart visualization

### Analytics Components

#### UserAnalytics
- UserAnalytics(): Default constructor
- getUserMetrics(): Promise<UserMetrics>: Get user behavior metrics
- getUserGrowth(period: TimePeriod): Promise<GrowthData>: Get user growth data
- getUserSegmentation(): Promise<SegmentationData>: Get user segmentation analysis
- getActiveUsers(timeframe: string): Promise<ActiveUserData>: Get active user statistics
- getUserRetention(): Promise<RetentionData>: Get user retention metrics

#### OrderAnalytics
- OrderAnalytics(): Default constructor
- getOrderMetrics(): Promise<OrderMetrics>: Get order processing metrics
- getOrderTrends(period: TimePeriod): Promise<TrendData>: Get order trend analysis
- getOrderFulfillment(): Promise<FulfillmentData>: Get fulfillment performance
- getAverageOrderValue(): Promise<AOVData>: Get average order value metrics
- getOrderStatusDistribution(): Promise<StatusData>: Get order status breakdown

#### InventoryAnalytics
- InventoryAnalytics(): Default constructor
- getInventoryLevels(): Promise<InventoryData>: Get current inventory levels
- getStockTurnover(): Promise<TurnoverData>: Get inventory turnover analysis
- getLowStockAlerts(): Promise<AlertData>: Get low stock notifications
- getInventoryForecast(days: number): Promise<ForecastData>: Get inventory predictions
- getSupplierPerformance(): Promise<SupplierData>: Get supplier metrics

#### ShippingAnalytics
- ShippingAnalytics(): Default constructor
- getShippingMetrics(): Promise<ShippingData>: Get shipping performance metrics
- getDeliveryTimes(): Promise<DeliveryData>: Get delivery time analysis
- getShippingCosts(): Promise<CostData>: Get shipping cost breakdown
- getCarrierPerformance(): Promise<CarrierData>: Get carrier comparison data
- getShippingTrends(period: TimePeriod): Promise<TrendData>: Get shipping trends

### Chart Components

#### RealTimeChart
- RealTimeChart(props: RealTimeChartProps): Constructor with real-time configuration
- startRealTimeUpdates(): Begin real-time data streaming
- stopRealTimeUpdates(): Stop real-time data streaming
- setUpdateInterval(ms: number): Set update frequency
- onDataUpdate(handler: (data: RealTimeData) => void): Set data update callback
- getConnectionStatus(): ConnectionStatus: Get WebSocket connection status

#### AdvancedMetricsWidget
- AdvancedMetricsWidget(props: WidgetProps): Constructor with widget configuration
- addMetric(metric: MetricConfig): Add new metric to widget
- removeMetric(metricId: string): Remove metric from widget
- updateMetricConfig(metricId: string, config: MetricConfig): Update metric configuration
- setRefreshInterval(ms: number): Set widget refresh interval
- enableAutoRefresh(enabled: boolean): Enable/disable automatic refresh

#### DrillDownAnalytics
- DrillDownAnalytics(props: DrillDownProps): Constructor with drill-down configuration
- onDrillDown(handler: (context: DrillDownContext) => void): Set drill-down event handler
- goBack(): Navigate back to previous level
- resetToTop(): Reset to top-level view
- getCurrentLevel(): number: Get current drill-down level
- setMaxDepth(depth: number): Set maximum drill-down depth

### Real-Time Services

#### RealTimeContext
- RealTimeContext.Provider(props: ProviderProps): Context provider for real-time data
- useRealTimeData(dataType: string): Hook to access real-time data
- useConnectionStatus(): Hook to get connection status
- useDataSubscription(subscription: SubscriptionConfig): Hook for data subscriptions

#### RealTimeSimulator
- RealTimeSimulator(config: SimulatorConfig): Constructor with simulation configuration
- startSimulation(): Start data simulation
- stopSimulation(): Stop data simulation
- generateSampleData(type: DataType): Generate sample data
- setDataPattern(pattern: DataPattern): Set data generation pattern

### Authentication & Security

#### AuthContext
- AuthContext.Provider(props: AuthProviderProps): Authentication context provider
- useAuth(): Hook to access authentication state
- login(credentials: LoginCredentials): Promise<AuthResult>: Authenticate user
- logout(): Promise<void>: Log out current user
- refreshToken(): Promise<string>: Refresh authentication token
- hasPermission(permission: string): boolean: Check user permissions

#### ProtectedRoute
- ProtectedRoute(props: ProtectedRouteProps): Protected route component
- checkPermissions(requiredPermissions: string[]): boolean: Verify required permissions
- redirectToLogin(): Redirect to login page
- onUnauthorized(handler: () => void): Set unauthorized access handler

### Layout Components

#### DashboardLayout
- DashboardLayout(props: LayoutProps): Constructor with layout configuration
- updateLayout(layout: Layout[]): Update widget layout
- addWidget(widget: WidgetConfig): Add new widget to layout
- removeWidget(widgetId: string): Remove widget from layout
- resetLayout(): Reset to default layout
- saveLayout(): Save current layout configuration
- loadLayout(layoutId: string): Load saved layout configuration

#### AppLayout
- AppLayout(props: AppLayoutProps): Constructor with application layout
- setNavigationCollapsed(collapsed: boolean): Toggle navigation sidebar
- showNotification(notification: NotificationConfig): Display notification
- hideNotification(notificationId: string): Hide specific notification
- setTheme(theme: 'light' | 'dark'): Change application theme

## REST API Endpoints

### Analytics Data API

#### Dashboard Data
- GET /api/v1/analytics/dashboard: Get main dashboard data
- GET /api/v1/analytics/dashboard/{dashboardId}: Get specific dashboard configuration
- POST /api/v1/analytics/dashboard: Create new dashboard configuration
- PUT /api/v1/analytics/dashboard/{dashboardId}: Update dashboard configuration
- DELETE /api/v1/analytics/dashboard/{dashboardId}: Delete dashboard configuration

#### User Analytics
- GET /api/v1/analytics/users/metrics: Get user behavior metrics
- GET /api/v1/analytics/users/growth: Get user growth data
- GET /api/v1/analytics/users/segmentation: Get user segmentation data
- GET /api/v1/analytics/users/retention: Get user retention metrics
- GET /api/v1/analytics/users/active: Get active user statistics

#### Order Analytics
- GET /api/v1/analytics/orders/metrics: Get order processing metrics
- GET /api/v1/analytics/orders/trends: Get order trend analysis
- GET /api/v1/analytics/orders/fulfillment: Get fulfillment performance
- GET /api/v1/analytics/orders/aov: Get average order value data
- GET /api/v1/analytics/orders/status: Get order status distribution

#### Inventory Analytics
- GET /api/v1/analytics/inventory/levels: Get current inventory levels
- GET /api/v1/analytics/inventory/turnover: Get inventory turnover data
- GET /api/v1/analytics/inventory/alerts: Get low stock alerts
- GET /api/v1/analytics/inventory/forecast: Get inventory forecasting data
- GET /api/v1/analytics/inventory/suppliers: Get supplier performance metrics

#### Shipping Analytics
- GET /api/v1/analytics/shipping/metrics: Get shipping performance metrics
- GET /api/v1/analytics/shipping/delivery-times: Get delivery time analysis
- GET /api/v1/analytics/shipping/costs: Get shipping cost breakdown
- GET /api/v1/analytics/shipping/carriers: Get carrier performance data
- GET /api/v1/analytics/shipping/trends: Get shipping trend analysis

### Configuration API

#### Widget Configuration
- GET /api/v1/config/widgets: Get available widget types
- GET /api/v1/config/widgets/{widgetId}: Get widget configuration
- POST /api/v1/config/widgets: Create custom widget configuration
- PUT /api/v1/config/widgets/{widgetId}: Update widget configuration
- DELETE /api/v1/config/widgets/{widgetId}: Delete widget configuration

#### Dashboard Layout
- GET /api/v1/config/layouts: Get saved dashboard layouts
- GET /api/v1/config/layouts/{layoutId}: Get specific layout configuration
- POST /api/v1/config/layouts: Save new dashboard layout
- PUT /api/v1/config/layouts/{layoutId}: Update layout configuration
- DELETE /api/v1/config/layouts/{layoutId}: Delete saved layout

### Real-Time API

#### WebSocket Endpoints
- WS /ws/realtime/dashboard: Real-time dashboard data updates
- WS /ws/realtime/metrics: Real-time metrics streaming
- WS /ws/realtime/alerts: Real-time alert notifications
- WS /ws/realtime/orders: Real-time order updates
- WS /ws/realtime/inventory: Real-time inventory updates

#### Subscription Management
- POST /api/v1/realtime/subscribe: Subscribe to real-time data streams
- DELETE /api/v1/realtime/unsubscribe: Unsubscribe from data streams
- GET /api/v1/realtime/subscriptions: Get active subscriptions
- PUT /api/v1/realtime/subscriptions/{subscriptionId}: Update subscription configuration

### Export API

#### Data Export
- POST /api/v1/export/dashboard: Export dashboard data
- POST /api/v1/export/chart: Export chart visualization
- POST /api/v1/export/report: Generate and export analytics report
- GET /api/v1/export/status/{exportId}: Get export job status
- GET /api/v1/export/download/{exportId}: Download exported file

### Integration API

#### Global HQ Integration
- GET /api/v1/integration/global-hq/status: Get integration status for all Global HQ dashboards
- GET /api/v1/integration/warehousing: Get warehousing dashboard data
- GET /api/v1/integration/social-commerce: Get social commerce dashboard data
- GET /api/v1/integration/courier-services: Get courier services dashboard data
- GET /api/v1/integration/shared-infrastructure: Get shared infrastructure metrics
- POST /api/v1/integration/sync: Trigger manual data synchronization

#### External Service Integration
- GET /api/v1/integration/external/connectors: Get available external connectors
- POST /api/v1/integration/external/connect: Connect to external data source
- PUT /api/v1/integration/external/{connectorId}: Update external connection
- DELETE /api/v1/integration/external/{connectorId}: Disconnect external data source

## GraphQL API

### Query Operations
```graphql
type Query {
  dashboard(id: ID!): Dashboard
  dashboards(filter: DashboardFilter): [Dashboard]
  analytics(type: AnalyticsType!, timeRange: TimeRange!): AnalyticsData
  realTimeMetrics(subscriptions: [String!]!): RealTimeMetricsData
  userMetrics(userId: ID, timeRange: TimeRange): UserMetrics
  orderAnalytics(filters: OrderFilters): OrderAnalytics
  inventoryStatus: InventoryStatus
  shippingMetrics(timeRange: TimeRange): ShippingMetrics
}
```

### Mutation Operations
```graphql
type Mutation {
  createDashboard(input: CreateDashboardInput!): Dashboard
  updateDashboard(id: ID!, input: UpdateDashboardInput!): Dashboard
  deleteDashboard(id: ID!): Boolean
  saveLayout(dashboardId: ID!, layout: LayoutInput!): Layout
  subscribeToRealTime(config: RealtimeSubscriptionInput!): Subscription
  unsubscribeFromRealTime(subscriptionId: ID!): Boolean
}
```

### Subscription Operations
```graphql
type Subscription {
  dashboardUpdates(dashboardId: ID!): DashboardUpdate
  realTimeMetrics(types: [MetricType!]!): MetricUpdate
  alertNotifications: AlertNotification
  orderUpdates: OrderUpdate
  inventoryChanges: InventoryUpdate
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ANALYTICS_ERROR_001",
    "message": "Data aggregation failed",
    "details": "Unable to fetch data from warehousing service",
    "timestamp": "2024-06-25T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### Common Error Codes
- ANALYTICS_ERROR_001: Data aggregation failure
- ANALYTICS_ERROR_002: Real-time connection lost
- ANALYTICS_ERROR_003: Authentication required
- ANALYTICS_ERROR_004: Insufficient permissions
- ANALYTICS_ERROR_005: Rate limit exceeded
- ANALYTICS_ERROR_006: Invalid dashboard configuration
- ANALYTICS_ERROR_007: Export generation failed

## Rate Limiting

### API Rate Limits
- Dashboard Data API: 100 requests per minute per user
- Real-time WebSocket: 10 connections per user
- Export API: 5 exports per hour per user
- Analytics API: 200 requests per minute per user

### WebSocket Connection Limits
- Maximum 10 concurrent connections per user
- Maximum 50 subscriptions per connection
- Automatic reconnection with exponential backoff
- Connection timeout after 5 minutes of inactivity