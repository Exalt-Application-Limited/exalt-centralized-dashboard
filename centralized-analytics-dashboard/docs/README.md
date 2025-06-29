# Centralized Analytics Dashboard Documentation

## Overview
The Centralized Analytics Dashboard is the main business analytics interface for the Social E-commerce Ecosystem. It provides comprehensive real-time insights, data visualization, and business intelligence capabilities by aggregating data from all Global HQ dashboards across different domains.

## Components

### Core Components
- **RealTimeDashboard**: Primary dashboard displaying live business metrics and KPIs
- **InteractiveDashboardChart**: Advanced charting component with drill-down capabilities  
- **AdvancedMetricsWidget**: Configurable widget system for custom analytics
- **DrillDownAnalytics**: Deep dive analysis tools for detailed insights

### Analytics Modules
- **UserAnalytics**: User behavior and engagement metrics
- **OrderAnalytics**: Order processing and fulfillment analytics
- **InventoryAnalytics**: Real-time inventory levels and turnover analysis
- **ShippingAnalytics**: Logistics and shipping performance metrics

### Data Visualization
- **RealTimeChart**: Live updating charts with WebSocket connections
- **SalesMetricsChart**: Sales performance visualization components
- **Interactive Charts**: Nivo.js-based charting with React integration
- **Grid Layout**: Customizable dashboard layout with drag-and-drop

### Authentication & Security
- **AuthContext**: Authentication state management
- **ProtectedRoute**: Route-level access control
- **JWT Integration**: Token-based authentication with refresh handling

## Getting Started
To use the Centralized Analytics Dashboard, follow these steps:

1. Configure your Global HQ dashboard data sources
2. Set up authentication with your organization's identity provider
3. Customize the dashboard layout and widgets for your business needs
4. Configure real-time data connections and WebSocket endpoints
5. Set up alerting and notification preferences

## Examples

### Creating a Custom Analytics Widget
```javascript
import React from 'react';
import { AdvancedMetricsWidget } from '../components/charts';
import { useRealTimeData } from '../services/realTimeHooks';

export const CustomSalesWidget = ({ config }) => {
  const { data, isLoading } = useRealTimeData('sales-metrics');
  
  return (
    <AdvancedMetricsWidget
      title="Sales Performance"
      data={data}
      loading={isLoading}
      config={{
        chartType: 'line',
        refreshInterval: 30000,
        drillDownEnabled: true,
        ...config
      }}
    />
  );
};
```

### Setting Up Real-Time Data Connection
```javascript
import { RealTimeContext } from '../services/RealTimeContext';
import { RealTimeSimulator } from '../services/RealTimeSimulator';

const App = () => {
  return (
    <RealTimeContext.Provider value={{
      dataSource: 'ws://analytics-api.exalt.com/realtime',
      updateInterval: 5000,
      autoReconnect: true
    }}>
      <Dashboard />
    </RealTimeContext.Provider>
  );
};
```

### Creating Custom Dashboard Layout
```javascript
import { DashboardLayout } from '../layouts/DashboardLayout';
import { RealTimeDashboard } from '../pages/dashboard/Dashboard';

const MyCustomDashboard = () => {
  const layoutConfig = {
    cols: 12,
    rowHeight: 150,
    compactType: 'vertical',
    preventCollision: false
  };

  return (
    <DashboardLayout config={layoutConfig}>
      <RealTimeDashboard
        widgets={[
          { i: 'sales', x: 0, y: 0, w: 6, h: 4 },
          { i: 'inventory', x: 6, y: 0, w: 6, h: 4 },
          { i: 'orders', x: 0, y: 4, w: 12, h: 3 }
        ]}
      />
    </DashboardLayout>
  );
};
```

### Implementing Drill-Down Analytics
```javascript
import { DrillDownAnalytics } from '../components/charts/DrillDownAnalytics';

const SalesAnalytics = () => {
  const handleDrillDown = (dataPoint) => {
    // Navigate to detailed view
    return {
      filters: {
        dateRange: dataPoint.dateRange,
        category: dataPoint.category,
        region: dataPoint.region
      },
      aggregation: 'daily'
    };
  };

  return (
    <DrillDownAnalytics
      dataSource="sales-data"
      onDrillDown={handleDrillDown}
      maxDepth={3}
      enableExport={true}
    />
  );
};
```

### Integration with Global HQ Dashboards
```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';

const GlobalHQIntegration = () => {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchGlobalHQData = async () => {
      const responses = await Promise.all([
        axios.get('/api/warehousing/analytics'),
        axios.get('/api/social-commerce/analytics'),
        axios.get('/api/courier-services/analytics'),
        axios.get('/api/shared-infrastructure/analytics')
      ]);

      setDashboardData({
        warehousing: responses[0].data,
        socialCommerce: responses[1].data,
        courierServices: responses[2].data,
        infrastructure: responses[3].data
      });
    };

    fetchGlobalHQData();
    const interval = setInterval(fetchGlobalHQData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="global-hq-overview">
      {Object.entries(dashboardData).map(([domain, data]) => (
        <DomainDashboard key={domain} domain={domain} data={data} />
      ))}
    </div>
  );
};
```

## Best Practices
1. **Performance**: Use React.memo() for expensive chart components
2. **Real-time Updates**: Implement proper WebSocket connection management with reconnection logic
3. **Data Visualization**: Choose appropriate chart types for different data patterns
4. **User Experience**: Implement loading states and error boundaries
5. **Accessibility**: Ensure charts and dashboards are accessible with proper ARIA labels
6. **Mobile Responsiveness**: Design layouts that work across different screen sizes
7. **Caching**: Implement proper data caching strategies for better performance
8. **Error Handling**: Graceful error handling for data fetching and WebSocket connections

## Technology Stack
- **Frontend**: React 18, TypeScript, Material-UI
- **State Management**: Redux Toolkit, React Context
- **Charts**: Nivo.js, Recharts
- **Real-time**: WebSocket, Socket.IO
- **Testing**: Jest, React Testing Library, MSW
- **Build**: Create React App, Webpack
- **Deployment**: Docker, Vercel, Kubernetes

## Integration Points
The Centralized Analytics Dashboard integrates with:
- **Global HQ Dashboards**: Warehousing, Social Commerce, Courier Services
- **Real-time Data Service**: WebSocket connections for live updates
- **Authentication Service**: SSO and JWT token management
- **Notification Service**: Real-time alerts and notifications
- **Export Service**: PDF and Excel report generation