# Centralized Analytics Dashboard

## Overview

The Centralized Analytics Dashboard is the primary business intelligence interface for the Social E-commerce Ecosystem, providing comprehensive visual analytics and insights across all business domains (Social Commerce, Warehousing, and Courier Services). Built with React and modern frontend technologies, it serves as the central hub for executive decision-making and operational monitoring.

### Service Details

- **Service Type**: Frontend Application
- **Domain**: Centralized Business Intelligence Dashboard
- **Port**: 3000 (development), 80 (production)
- **Health Check**: `http://localhost:3000/health`
- **API Documentation**: `http://localhost:3000/api-docs`

## Architecture

### Position in Ecosystem

The Centralized Analytics Dashboard sits at the top of the Social E-commerce Ecosystem architecture, providing a unified view of all business operations. It connects to multiple backend services to aggregate, process, and visualize data from:

- **Social Commerce Domain**: Order metrics, vendor performance, payment analytics
- **Warehousing Domain**: Inventory levels, fulfillment rates, warehouse efficiency
- **Courier Services Domain**: Delivery performance, route optimization, shipping costs

### Key Responsibilities

- **Multi-Domain Data Visualization**: Create interactive charts and dashboards showing KPIs across all business domains
- **Real-Time Monitoring**: Display live updates of critical business metrics and alerts
- **Executive Reporting**: Generate comprehensive reports for stakeholders and decision makers
- **User Experience Management**: Provide responsive, multi-language interface for global operations
- **Performance Analytics**: Track and visualize business performance trends and forecasts

### Technology Stack

- **Language**: TypeScript 5.x
- **Framework**: React 18.x with Create React App
- **State Management**: Redux Toolkit
- **UI Components**: Material-UI / Ant Design
- **Charts & Visualization**: Chart.js, D3.js
- **Styling**: CSS Modules, Styled Components
- **Build Tool**: Webpack via Create React App + Craco
- **Testing**: Jest, React Testing Library, Cypress

## API Endpoints

### Frontend Configuration Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/health` | Application health status |
| GET    | `/api/config` | Runtime configuration |
| GET    | `/api/dashboard/metrics` | Dashboard KPI data |
| GET    | `/api/analytics/charts` | Chart visualization data |
| POST   | `/api/realtime/subscribe` | Subscribe to real-time updates |

### WebSocket Endpoints

| Endpoint | Description | Purpose |
|----------|-------------|---------|
| `wss://host/ws/dashboard` | Real-time dashboard updates | Live KPI streaming |
| `wss://host/ws/alerts` | System alerts and notifications | Critical event notifications |

## Dependencies

### Backend Services

| Service | Purpose | Communication Method |
|---------|---------|---------------------|
| Centralized Core | Core dashboard data and KPIs | REST API |
| Data Aggregation Service | Multi-domain data consolidation | REST API + WebSocket |
| Real-Time Data Service | Live streaming data | WebSocket |
| Authentication Service | User authentication and authorization | REST API |

### External Dependencies

- **CDN**: CloudFront for static asset delivery
- **Analytics**: Google Analytics 4, Mixpanel
- **Error Tracking**: Sentry
- **Monitoring**: Web Vitals, Lighthouse CI

## Configuration

### Environment Variables

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_WS_BASE_URL=ws://localhost:8080

# Feature Flags
REACT_APP_ENABLE_REALTIME=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_MOCK_DATA=false

# Authentication
REACT_APP_AUTH_DOMAIN=auth.exalt.com
REACT_APP_AUTH_CLIENT_ID=analytics-dashboard

# Internationalization
REACT_APP_DEFAULT_LANGUAGE=en
REACT_APP_SUPPORTED_LANGUAGES=en,fr,de,es,ar

# External Services
REACT_APP_SENTRY_DSN=https://your-sentry-dsn
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Development
REACT_APP_LOG_LEVEL=info
REACT_APP_ENABLE_REDUX_DEVTOOLS=true
```

### Configuration Files

- `craco.config.js` - Custom webpack configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `nginx.conf` - Production web server configuration

## Component Architecture

### Page Components

```
src/pages/
├── dashboard/
│   ├── Dashboard.tsx              # Main dashboard page
│   └── RealTimeDashboard.tsx      # Live monitoring page
├── analytics/
│   ├── OrderAnalytics.tsx         # E-commerce analytics
│   ├── InventoryAnalytics.tsx     # Warehouse analytics
│   ├── ShippingAnalytics.tsx      # Courier analytics
│   └── UserAnalytics.tsx          # User behavior analytics
└── auth/
    └── Login.tsx                  # Authentication page
```

### Chart Components

```
src/components/charts/
├── InteractiveDashboardChart.tsx  # Main interactive charts
├── RealTimeChart.tsx              # Live updating charts
├── AdvancedMetricsWidget.tsx      # KPI widgets
├── DrillDownAnalytics.tsx         # Detailed analysis
└── index.ts                       # Chart exports
```

### Service Layer

```
src/services/
├── RealTimeContext.tsx           # Real-time data management
├── RealTimeSimulator.ts          # Development data simulation
└── realTimeHooks.ts              # Custom hooks for real-time data
```

## Development

### Prerequisites

- **Node.js**: 18+ LTS
- **npm/yarn**: Latest version
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Local Setup

1. **Clone the repository**
```bash
git clone [repository-url]
cd centralized-dashboard/centralized-analytics-dashboard
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment**
```bash
cp .env.template .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm start
# or
yarn start
```

5. **Access the application**
- Dashboard: http://localhost:3000
- Health Check: http://localhost:3000/health

### Development Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Bundle analysis
npm run analyze
```

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests with Cypress
npm run cypress:open

# All tests with coverage
npm run test:all
```

## Deployment

### Docker

```bash
# Build production image
docker build -t centralized-analytics-dashboard:latest .

# Run container
docker run -p 3000:80 \
  --env-file .env.production \
  centralized-analytics-dashboard:latest
```

### Kubernetes

```bash
# Deploy to cluster
kubectl apply -f k8s/ -n centralized-dashboard

# Check deployment status
kubectl get pods -n centralized-dashboard

# View logs
kubectl logs -f deployment/analytics-dashboard -n centralized-dashboard
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Serve with static server
npx serve -s build -l 3000
```

## Monitoring

### Health Checks

- **Application Health**: `/health`
- **Component Health**: React Error Boundaries
- **Performance**: Web Vitals monitoring

### Metrics Collection

```javascript
// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking

- **Sentry Integration**: Automatic error capture and reporting
- **Error Boundaries**: Graceful error handling in React components
- **Console Monitoring**: Development error logging

### Analytics

- **User Interactions**: Click tracking, page views, session duration
- **Feature Usage**: Dashboard widget interactions, chart drilling
- **Performance Metrics**: Load times, render performance, API response times

## Security

### Authentication

- **Method**: JWT-based authentication
- **Provider**: Centralized Authentication Service
- **Multi-Factor**: Optional 2FA for admin users

### Authorization

- **RBAC**: Role-based access control
- **Route Protection**: Protected routes for authenticated users
- **API Security**: Bearer token authentication for API calls

### Content Security

```javascript
// Content Security Policy
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google-analytics.com"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", "data:", "https:"],
  connectSrc: ["'self'", "wss:", "https:"],
  fontSrc: ["'self'"],
  frameAncestors: ["'none'"]
};
```

## Internationalization

### Supported Languages

- **English** (en) - Default
- **French** (fr)
- **German** (de) 
- **Spanish** (es)
- **Arabic** (ar)

### Language Resources

```
i18n/
├── en/messages.properties    # English translations
├── fr/messages.properties    # French translations
├── de/messages.properties    # German translations
├── es/messages.properties    # Spanish translations
├── ar/messages.properties    # Arabic translations
└── i18n-config.json         # i18n configuration
```

### Usage

```typescript
import { useTranslation } from 'react-i18next';

function DashboardComponent() {
  const { t } = useTranslation();
  
  return (
    <h1>{t('dashboard.title')}</h1>
  );
}
```

## Performance Optimization

### Code Splitting

```typescript
// Route-based code splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
```

### Bundle Optimization

- **Tree Shaking**: Automatic dead code elimination
- **Code Splitting**: Route and component-level splitting
- **Asset Optimization**: Image compression, minification
- **Caching**: Aggressive caching for static assets

### Real-Time Performance

```typescript
// Optimized WebSocket management
class WebSocketManager {
  private connections = new Map<string, WebSocket>();
  
  connect(endpoint: string) {
    if (!this.connections.has(endpoint)) {
      const ws = new WebSocket(endpoint);
      this.connections.set(endpoint, ws);
      this.setupHeartbeat(ws);
    }
    return this.connections.get(endpoint);
  }
}
```

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Kill process using port
   lsof -ti:3000 | xargs kill -9
   ```

2. **Dependencies installation fails**
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build fails with TypeScript errors**
   ```bash
   # Check TypeScript configuration
   npm run type-check
   ```

4. **WebSocket connection issues**
   ```bash
   # Check backend service availability
   curl -I -N -H "Connection: Upgrade" \
     -H "Upgrade: websocket" \
     ws://localhost:8080/ws
   ```

### Debug Mode

```bash
# Enable debug logging
export REACT_APP_LOG_LEVEL=debug

# Enable Redux DevTools
export REACT_APP_ENABLE_REDUX_DEVTOOLS=true
```

## Performance Considerations

- **Lazy Loading**: Components and routes loaded on demand
- **Memoization**: React.memo, useMemo, useCallback for optimization
- **Virtual Scrolling**: For large datasets in tables and lists
- **Debounced Updates**: Throttled real-time updates to prevent UI flooding
- **Image Optimization**: WebP format, responsive images, lazy loading

## Contributing

1. **Code Standards**: Follow ESLint and Prettier configurations
2. **TypeScript**: Use strict TypeScript for all new code
3. **Testing**: Write unit tests for components and utilities
4. **Documentation**: Update documentation for new features
5. **Accessibility**: Follow WCAG 2.1 AA guidelines

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Run full test suite: `npm run test:all`
4. Submit PR with clear description
5. Address review feedback
6. Merge after approval

## Related Documentation

- [Overall Architecture](/docs/architecture/README.md)
- [Setup Guide](/docs/setup/README.md)
- [Operations Guide](/docs/operations/README.md)
- [API Documentation](/api-docs/openapi.yaml)
- [Centralized Core Service](/centralized-core/README.md)
- [Data Aggregation Service](/centralized-data-aggregation/README.md)

## Contact

- **Team**: Analytics Dashboard Team
- **Email**: analytics-dashboard@exalt.com
- **Slack Channel**: #centralized-analytics-dashboard
- **Documentation**: https://docs.dashboard.exalt.com
- **Support**: https://support.dashboard.exalt.com

## License

Copyright (c) 2024 Exalt Application Limited. All rights reserved.