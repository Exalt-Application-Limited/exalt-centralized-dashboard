#!/bin/bash

# Setup script for centralized-analytics-dashboard React Frontend
# This script sets up the development environment for the React application

set -e

echo "Setting up centralized-analytics-dashboard development environment..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18 or higher"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18 or higher is required. Current version is $NODE_VERSION"
    exit 1
fi

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm"
    exit 1
fi

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker"
    exit 1
fi

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/types
mkdir -p src/__tests__
mkdir -p public
mkdir -p build
mkdir -p k8s
mkdir -p scripts

# Set up environment variables
echo "Setting up environment variables..."
cat > .env.local << 'ENV_EOF'
# Local development environment variables
REACT_APP_centralized-analytics-dashboard=centralized-analytics-dashboard
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_WS_BASE_URL=ws://localhost:8080/ws
REACT_APP_ENV=local
REACT_APP_LOG_LEVEL=debug
GENERATE_SOURCEMAP=true
FAST_REFRESH=true
ENV_EOF

# Create basic package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "Creating basic package.json..."
    cat > package.json << 'PACKAGE_EOF'
{
  "name": "centralized-analytics-dashboard",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.34",
    "@types/react": "^18.2.7",
    "@types/react-dom": "^18.2.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "test:unit": "react-scripts test --testPathPattern=__tests__/unit",
    "test:integration": "react-scripts test --testPathPattern=__tests__/integration",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,json,css,md}",
    "format:check": "prettier --check src/**/*.{js,jsx,ts,tsx,json,css,md}",
    "type-check": "tsc --noEmit",
    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@types/testing-library__jest-dom": "^5.14.6",
    "eslint": "^8.42.0",
    "prettier": "^2.8.8"
  }
}
PACKAGE_EOF
fi

# Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Create basic Dockerfile if it doesn't exist
if [ ! -f "Dockerfile" ]; then
    echo "Creating Dockerfile..."
    cat > Dockerfile << 'DOCKER_EOF'
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
DOCKER_EOF
fi

# Create nginx configuration
if [ ! -f "nginx.conf" ]; then
    echo "Creating nginx.conf..."
    cat > nginx.conf << 'NGINX_EOF'
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
NGINX_EOF
fi

# Build the application
echo "Building centralized-analytics-dashboard..."
npm run build

echo "Setup complete! You can now run the service using ./scripts/dev.sh"
echo ""
echo "Available commands:"
echo "  ./scripts/dev.sh start    - Start the development server"
echo "  ./scripts/dev.sh build    - Build for production"
echo "  ./scripts/dev.sh test     - Run tests"
echo "  ./scripts/dev.sh lint     - Run linting"
echo "  ./scripts/dev.sh clean    - Clean build artifacts"
