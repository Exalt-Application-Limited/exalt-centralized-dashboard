# Setup Guide - Centralized Analytics Dashboard

## Overview

This document provides comprehensive setup instructions for the Centralized Analytics Dashboard, a React-based frontend application that serves as the primary business intelligence interface for the Social E-commerce Ecosystem.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Setup](#docker-setup)
4. [Kubernetes Setup](#kubernetes-setup)
5. [Configuration](#configuration)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, Linux Ubuntu 18.04+
- **Memory**: Minimum 8GB RAM (16GB recommended for development)
- **Storage**: Minimum 10GB free space
- **Network**: Stable internet connection for package downloads

### Required Software

#### Development Tools

```bash
# Node.js and npm
Node.js 18+ LTS (includes npm)

# Alternative package managers
Yarn 1.22+ or pnpm 8+

# IDE (Recommended)
Visual Studio Code with extensions:
- ES7+ React/Redux/React-Native snippets
- TypeScript Hero
- Prettier - Code formatter
- ESLint

# Version Control
Git 2.30+
```

#### Browser Requirements

- **Chrome** 90+ (recommended for development)
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### Installation Instructions

#### Node.js 18 LTS

**Windows:**
```powershell
# Using Chocolatey
choco install nodejs-lts

# Or download from nodejs.org
```

**macOS:**
```bash
# Using Homebrew
brew install node@18

# Using Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

**Linux:**
```bash
# Ubuntu/Debian using NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Yarn (Optional but recommended)

```bash
# Install Yarn globally
npm install -g yarn

# Verify installation
yarn --version
```

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/social-ecommerce-ecosystem/centralized-dashboard.git
cd centralized-dashboard/centralized-analytics-dashboard
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.template .env

# Edit with your local settings
nano .env
```

Example `.env` file:
```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_WS_BASE_URL=ws://localhost:8080

# Feature Flags
REACT_APP_ENABLE_REALTIME=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_MOCK_DATA=false

# Authentication
REACT_APP_AUTH_DOMAIN=auth.local
REACT_APP_AUTH_CLIENT_ID=dashboard-client

# Internationalization
REACT_APP_DEFAULT_LANGUAGE=en
REACT_APP_SUPPORTED_LANGUAGES=en,fr,de,es,ar

# Development Settings
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_REDUX_DEVTOOLS=true

# External Services
REACT_APP_SENTRY_DSN=your-sentry-dsn
REACT_APP_ANALYTICS_ID=your-analytics-id
```

### 3. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn (recommended)
yarn install

# For faster installs with pnpm
pnpm install
```

### 4. Start Backend Services

The dashboard requires several backend services to be running:

```bash
# Start in separate terminals or use Docker Compose

# Centralized Core Service
cd ../centralized-core
mvn spring-boot:run

# Data Aggregation Service  
cd ../centralized-data-aggregation
mvn spring-boot:run

# Real-Time Data Service
cd ../centralized-real-time-data
mvn spring-boot:run
```

### 5. Start Development Server

```bash
# Using npm
npm start

# Using yarn
yarn start

# Using pnpm
pnpm start
```

The application will be available at:
- **Main Dashboard**: http://localhost:3000
- **Development Tools**: React DevTools in browser

### 6. Development Tools Setup

#### VS Code Extensions

Install recommended extensions:
```bash
# Install from command palette
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
```

#### Browser DevTools

1. **React Developer Tools**
   - Chrome: Install from Chrome Web Store
   - Firefox: Install from Firefox Add-ons

2. **Redux DevTools**
   - Install browser extension
   - Already configured in development build

## Docker Setup

### 1. Build Docker Image

```bash
# Build production image
docker build -t centralized-analytics-dashboard:latest .

# Build with specific tag
docker build -t centralized-analytics-dashboard:v1.0.0 .
```

### 2. Run Container

```bash
# Run with environment variables
docker run -p 3000:80 \
  -e REACT_APP_API_BASE_URL=http://backend:8080 \
  -e REACT_APP_WS_BASE_URL=ws://backend:8080 \
  centralized-analytics-dashboard:latest

# Run with environment file
docker run -p 3000:80 \
  --env-file .env.production \
  centralized-analytics-dashboard:latest
```

### 3. Docker Compose Setup

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  analytics-dashboard:
    build: .
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_BASE_URL=http://centralized-core:8080
      - REACT_APP_WS_BASE_URL=ws://real-time-data:8081
    depends_on:
      - centralized-core
      - real-time-data
    networks:
      - dashboard-network

  centralized-core:
    image: centralized-core:latest
    ports:
      - "8080:8080"
    networks:
      - dashboard-network

  real-time-data:
    image: centralized-real-time-data:latest
    ports:
      - "8081:8081"
    networks:
      - dashboard-network

networks:
  dashboard-network:
    driver: bridge
```

Start with Docker Compose:
```bash
docker-compose up -d
```

## Kubernetes Setup

### 1. Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install helm (optional)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### 2. Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace centralized-dashboard

# Apply configurations
kubectl apply -f k8s/ -n centralized-dashboard

# Check deployment status
kubectl get pods -n centralized-dashboard
kubectl get services -n centralized-dashboard
```

### 3. Kubernetes Configuration Files

The service includes pre-configured Kubernetes manifests:

- `k8s/deployment.yaml` - Main application deployment
- `k8s/service.yaml` - Service configuration
- `k8s/ingress.yaml` - Ingress configuration for external access
- `k8s/configmap.yaml` - Environment configuration
- `k8s/secrets.yaml` - Sensitive configuration

### 4. Helm Deployment (Optional)

```bash
# Install with Helm
helm install analytics-dashboard ./helm/analytics-dashboard \
  --namespace centralized-dashboard \
  --set image.tag=v1.0.0 \
  --set ingress.hosts[0].host=analytics.dashboard.local

# Upgrade deployment
helm upgrade analytics-dashboard ./helm/analytics-dashboard \
  --namespace centralized-dashboard \
  --set image.tag=v1.1.0
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:8080` | Yes |
| `REACT_APP_WS_BASE_URL` | WebSocket base URL | `ws://localhost:8080` | Yes |
| `REACT_APP_ENABLE_REALTIME` | Enable real-time features | `true` | No |
| `REACT_APP_DEFAULT_LANGUAGE` | Default UI language | `en` | No |
| `REACT_APP_SENTRY_DSN` | Error tracking DSN | - | No |

### Build Configuration

#### Custom Webpack Configuration (craco.config.js)

```javascript
const CracoAlias = require('craco-alias');

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.paths.json'
      }
    }
  ],
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Custom webpack configurations
      if (env === 'production') {
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        };
      }
      return webpackConfig;
    }
  }
};
```

#### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
```

### Nginx Configuration

For production deployment:

```nginx
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## Verification

### 1. Health Checks

```bash
# Check if application is running
curl http://localhost:3000

# Check API connectivity
curl http://localhost:3000/health

# Check WebSocket connection
# Use browser console:
# new WebSocket('ws://localhost:3000/ws').readyState
```

### 2. Functional Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### 3. Performance Testing

```bash
# Build optimization check
npm run analyze

# Lighthouse CI (if configured)
npm run lighthouse

# Bundle size analysis
npm run bundle-analyzer
```

### 4. Browser Testing

Test in multiple browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Check for:
- Responsive design on different screen sizes
- Language switching functionality
- Real-time data updates
- Chart interactions

## Troubleshooting

### Common Issues

#### 1. Dependencies Installation Issues

**Problem**: `npm install` fails with permission errors

**Solutions**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Use yarn instead
yarn install

# Clear npm cache
npm cache clean --force
```

#### 2. Port Already in Use

**Problem**: Port 3000 is already in use

**Solutions**:
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 [PID]

# Use different port
PORT=3001 npm start
```

#### 3. API Connection Issues

**Problem**: Cannot connect to backend services

**Solutions**:
```bash
# Check backend services are running
curl http://localhost:8080/actuator/health

# Verify environment variables
echo $REACT_APP_API_BASE_URL

# Check network connectivity
ping backend-service
```

#### 4. Build Issues

**Problem**: Build fails with TypeScript errors

**Solutions**:
```bash
# Skip TypeScript checks (temporary)
SKIP_PREFLIGHT_CHECK=true npm run build

# Fix TypeScript issues
npm run type-check

# Update dependencies
npm update
```

#### 5. WebSocket Connection Issues

**Problem**: Real-time features not working

**Solutions**:
```bash
# Check WebSocket service
curl -i -N -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: test" \
  -H "Sec-WebSocket-Version: 13" \
  ws://localhost:8080/ws

# Enable WebSocket debugging
# Add to .env: REACT_APP_WS_DEBUG=true
```

### Debug Mode

Enable debug logging:

```bash
# Environment variable
export REACT_APP_LOG_LEVEL=debug

# Console debugging
# Open browser DevTools Console
localStorage.setItem('debug', 'analytics:*');
```

### Performance Issues

```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
# Use Chrome DevTools Memory tab

# Optimize images
npm install -g imagemin-cli
imagemin src/assets/images/* --out-dir=src/assets/images/optimized
```

## Development Best Practices

1. **Code Structure**: Follow the established folder structure
2. **Type Safety**: Use TypeScript for all new components
3. **Testing**: Write tests for critical functionality
4. **Performance**: Use React.memo and useMemo for optimization
5. **Accessibility**: Follow WCAG guidelines
6. **Internationalization**: Use i18n keys for all user-facing text

## Next Steps

1. **Development**: Start building new dashboard features
2. **Testing**: Set up automated testing pipeline
3. **Monitoring**: Configure error tracking and analytics
4. **Security**: Implement security scanning and auditing
5. **Deployment**: Set up CI/CD pipeline for automated deployments

## Support

- **Documentation**: `/docs` directory
- **Issues**: GitHub Issues
- **Team Chat**: Slack #centralized-dashboard
- **Email**: dashboard-team@exalt.com