#!/bin/bash

# Script to generate setup.sh and dev.sh for all centralized-dashboard services

JAVA_SERVICES=(
    "centralized-core"
    "centralized-dashboard-production"
    "centralized-dashboard-shared"
    "centralized-dashboard-staging"
    "centralized-data-aggregation"
    "centralized-performance-metrics"
    "centralized-real-time-data"
    "centralized-reporting"
)

REACT_SERVICES=(
    "centralized-analytics-dashboard"
)

# Function to create setup.sh for Java services
create_java_setup_sh() {
    local service=$1
    local service_path=$2
    
    # Create scripts directory if it doesn't exist
    mkdir -p "$service_path/scripts"
    
    cat > "$service_path/scripts/setup.sh" << 'EOF'
#!/bin/bash

# Setup script for SERVICE_NAME
# This script sets up the development environment for the Java service

set -e

echo "Setting up SERVICE_NAME development environment..."

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | awk -F. '{print $1}')
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "Error: Java 17 or higher is required. Current version is $JAVA_VERSION"
    exit 1
fi

# Check Maven installation
if ! command -v mvn &> /dev/null; then
    echo "Error: Maven is not installed. Please install Maven 3.9.6 or higher"
    exit 1
fi

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker"
    exit 1
fi

# Check Docker Compose installation
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose"
    exit 1
fi

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p src/main/java/com/exalt/centralizeddashboard/SERVICE_NAME_CLEAN
mkdir -p src/main/resources
mkdir -p src/test/java/com/exalt/centralizeddashboard/SERVICE_NAME_CLEAN
mkdir -p src/test/resources
mkdir -p database/migrations
mkdir -p database/seeds
mkdir -p logs
mkdir -p k8s
mkdir -p scripts

# Set up environment variables
echo "Setting up environment variables..."
cat > .env.local << 'ENV_EOF'
# Local development environment variables
SERVICE_NAME=SERVICE_NAME
SERVICE_PORT=8080
SPRING_PROFILES_ACTIVE=local
DATABASE_URL=jdbc:postgresql://localhost:5432/SERVICE_NAME_db
DATABASE_USERNAME=SERVICE_NAME_user
DATABASE_PASSWORD=changeme
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
CONFIG_SERVER_URL=http://localhost:8166
EUREKA_SERVER_URL=http://localhost:8154/eureka
LOG_LEVEL=DEBUG
ENV_EOF

# Create basic pom.xml if it doesn't exist
if [ ! -f "pom.xml" ]; then
    echo "Creating basic pom.xml..."
    cat > pom.xml << 'POM_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.exalt.centralizeddashboard</groupId>
    <artifactId>SERVICE_NAME</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    
    <name>SERVICE_NAME</name>
    <description>Centralized Dashboard SERVICE_NAME Service</description>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>
    
    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2022.0.4</spring-cloud.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
POM_EOF
fi

# Install Maven dependencies
echo "Installing Maven dependencies..."
mvn clean install -DskipTests

# Pull required Docker images
echo "Pulling required Docker images..."
docker pull postgres:14-alpine
docker pull redis:7-alpine

# Create Docker network
echo "Creating Docker network..."
docker network create centralized-dashboard-network 2>/dev/null || true

# Create basic docker-compose.yml if it doesn't exist
if [ ! -f "docker-compose.yml" ]; then
    echo "Creating docker-compose.yml..."
    cat > docker-compose.yml << 'COMPOSE_EOF'
version: '3.8'
services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: SERVICE_NAME_db
      POSTGRES_USER: SERVICE_NAME_user
      POSTGRES_PASSWORD: changeme
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - centralized-dashboard-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - centralized-dashboard-network

volumes:
  postgres_data:

networks:
  centralized-dashboard-network:
    external: true
COMPOSE_EOF
fi

# Start infrastructure services
echo "Starting infrastructure services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Build the service
echo "Building SERVICE_NAME..."
mvn clean package -DskipTests

echo "Setup complete! You can now run the service using ./scripts/dev.sh"
echo ""
echo "Available commands:"
echo "  ./scripts/dev.sh start    - Start the service"
echo "  ./scripts/dev.sh stop     - Stop the service"
echo "  ./scripts/dev.sh restart  - Restart the service"
echo "  ./scripts/dev.sh logs     - View service logs"
echo "  ./scripts/dev.sh test     - Run tests"
echo "  ./scripts/dev.sh clean    - Clean build artifacts"
EOF
    
    # Replace SERVICE_NAME with actual service name
    sed -i "s/SERVICE_NAME/${service}/g" "$service_path/scripts/setup.sh"
    
    # Replace SERVICE_NAME_CLEAN with cleaned service name (replace - with _)
    local clean_name=$(echo "$service" | tr '-' '_')
    sed -i "s/SERVICE_NAME_CLEAN/${clean_name}/g" "$service_path/scripts/setup.sh"
    
    chmod +x "$service_path/scripts/setup.sh"
}

# Function to create setup.sh for React services
create_react_setup_sh() {
    local service=$1
    local service_path=$2
    
    # Create scripts directory if it doesn't exist
    mkdir -p "$service_path/scripts"
    
    cat > "$service_path/scripts/setup.sh" << 'EOF'
#!/bin/bash

# Setup script for SERVICE_NAME React Frontend
# This script sets up the development environment for the React application

set -e

echo "Setting up SERVICE_NAME development environment..."

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
REACT_APP_SERVICE_NAME=SERVICE_NAME
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
  "name": "SERVICE_NAME",
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
echo "Building SERVICE_NAME..."
npm run build

echo "Setup complete! You can now run the service using ./scripts/dev.sh"
echo ""
echo "Available commands:"
echo "  ./scripts/dev.sh start    - Start the development server"
echo "  ./scripts/dev.sh build    - Build for production"
echo "  ./scripts/dev.sh test     - Run tests"
echo "  ./scripts/dev.sh lint     - Run linting"
echo "  ./scripts/dev.sh clean    - Clean build artifacts"
EOF
    
    # Replace SERVICE_NAME with actual service name
    sed -i "s/SERVICE_NAME/${service}/g" "$service_path/scripts/setup.sh"
    
    chmod +x "$service_path/scripts/setup.sh"
}

# Function to create dev.sh for Java services
create_java_dev_sh() {
    local service=$1
    local service_path=$2
    
    cat > "$service_path/scripts/dev.sh" << 'EOF'
#!/bin/bash

# Development utility script for SERVICE_NAME
# This script provides common development commands for Java services

set -e

SERVICE_NAME="SERVICE_NAME"
SERVICE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Load environment variables
if [ -f "$SERVICE_DIR/.env.local" ]; then
    export $(cat "$SERVICE_DIR/.env.local" | grep -v '^#' | xargs)
fi

# Function to start the service
start_service() {
    echo "Starting $SERVICE_NAME..."
    cd "$SERVICE_DIR"
    
    # Start infrastructure if not running
    docker-compose up -d
    
    # Wait for dependencies
    sleep 5
    
    # Start the application
    nohup java -jar target/${SERVICE_NAME}-*.jar > logs/app.log 2>&1 &
    echo $! > .pid
    
    echo "$SERVICE_NAME started with PID $(cat .pid)"
    echo "Logs available at: logs/app.log"
}

# Function to stop the service
stop_service() {
    echo "Stopping $SERVICE_NAME..."
    
    if [ -f .pid ]; then
        PID=$(cat .pid)
        if ps -p $PID > /dev/null; then
            kill $PID
            echo "$SERVICE_NAME stopped"
        else
            echo "$SERVICE_NAME is not running"
        fi
        rm -f .pid
    else
        echo "PID file not found. $SERVICE_NAME may not be running"
    fi
    
    # Optionally stop infrastructure
    read -p "Stop infrastructure services? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down
    fi
}

# Function to restart the service
restart_service() {
    stop_service
    sleep 2
    start_service
}

# Function to view logs
view_logs() {
    if [ -f logs/app.log ]; then
        tail -f logs/app.log
    else
        echo "No logs found. Is the service running?"
    fi
}

# Function to run tests
run_tests() {
    echo "Running tests for $SERVICE_NAME..."
    cd "$SERVICE_DIR"
    
    # Unit tests
    echo "Running unit tests..."
    mvn test -Dtest="**/unit/**"
    
    # Integration tests
    echo "Running integration tests..."
    docker-compose up -d
    sleep 5
    mvn test -Dtest="**/integration/**"
    
    # E2E tests
    echo "Running E2E tests..."
    mvn test -Dtest="**/e2e/**"
    
    echo "All tests completed!"
}

# Function to clean build artifacts
clean_build() {
    echo "Cleaning build artifacts..."
    cd "$SERVICE_DIR"
    mvn clean
    rm -rf logs/*
    rm -f .pid
    docker-compose down -v
    echo "Clean complete!"
}

# Function to build the service
build_service() {
    echo "Building $SERVICE_NAME..."
    cd "$SERVICE_DIR"
    mvn clean package -DskipTests
    echo "Build complete!"
}

# Function to run development mode with hot reload
dev_mode() {
    echo "Starting $SERVICE_NAME in development mode..."
    cd "$SERVICE_DIR"
    docker-compose up -d
    mvn spring-boot:run -Dspring-boot.run.profiles=local
}

# Function to check service health
health_check() {
    echo "Checking $SERVICE_NAME health..."
    curl -s http://localhost:${SERVICE_PORT:-8080}/actuator/health | jq '.' || echo "Service is not responding"
}

# Function to view service info
service_info() {
    echo "Service Information:"
    echo "==================="
    echo "Name: $SERVICE_NAME"
    echo "Directory: $SERVICE_DIR"
    echo "Port: ${SERVICE_PORT:-8080}"
    echo "Profile: ${SPRING_PROFILES_ACTIVE:-default}"
    echo ""
    
    if [ -f .pid ] && ps -p $(cat .pid) > /dev/null 2>&1; then
        echo "Status: Running (PID: $(cat .pid))"
    else
        echo "Status: Stopped"
    fi
    
    echo ""
    echo "Infrastructure Services:"
    docker-compose ps
}

# Main command handler
case "$1" in
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    logs)
        view_logs
        ;;
    test)
        run_tests
        ;;
    clean)
        clean_build
        ;;
    build)
        build_service
        ;;
    dev)
        dev_mode
        ;;
    health)
        health_check
        ;;
    info)
        service_info
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|test|clean|build|dev|health|info}"
        echo ""
        echo "Commands:"
        echo "  start    - Start the service"
        echo "  stop     - Stop the service"
        echo "  restart  - Restart the service"
        echo "  logs     - View service logs"
        echo "  test     - Run all tests"
        echo "  clean    - Clean build artifacts"
        echo "  build    - Build the service"
        echo "  dev      - Run in development mode with hot reload"
        echo "  health   - Check service health"
        echo "  info     - Display service information"
        exit 1
        ;;
esac
EOF
    
    # Replace SERVICE_NAME with actual service name
    sed -i "s/SERVICE_NAME/${service}/g" "$service_path/scripts/dev.sh"
    
    chmod +x "$service_path/scripts/dev.sh"
}

# Function to create dev.sh for React services
create_react_dev_sh() {
    local service=$1
    local service_path=$2
    
    cat > "$service_path/scripts/dev.sh" << 'EOF'
#!/bin/bash

# Development utility script for SERVICE_NAME React Frontend
# This script provides common development commands for React applications

set -e

SERVICE_NAME="SERVICE_NAME"
SERVICE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Load environment variables
if [ -f "$SERVICE_DIR/.env.local" ]; then
    export $(cat "$SERVICE_DIR/.env.local" | grep -v '^#' | xargs)
fi

# Function to start the development server
start_service() {
    echo "Starting $SERVICE_NAME development server..."
    cd "$SERVICE_DIR"
    npm start
}

# Function to build for production
build_service() {
    echo "Building $SERVICE_NAME for production..."
    cd "$SERVICE_DIR"
    npm run build
    echo "Build complete! Files are in the build/ directory"
}

# Function to run tests
run_tests() {
    echo "Running tests for $SERVICE_NAME..."
    cd "$SERVICE_DIR"
    
    case "$2" in
        unit)
            echo "Running unit tests..."
            npm run test:unit
            ;;
        integration)
            echo "Running integration tests..."
            npm run test:integration
            ;;
        coverage)
            echo "Running tests with coverage..."
            npm run test:coverage
            ;;
        *)
            echo "Running all tests..."
            npm test -- --watchAll=false
            ;;
    esac
}

# Function to run linting
lint_code() {
    echo "Running linting for $SERVICE_NAME..."
    cd "$SERVICE_DIR"
    
    case "$2" in
        fix)
            npm run lint:fix
            ;;
        *)
            npm run lint
            ;;
    esac
}

# Function to format code
format_code() {
    echo "Formatting code for $SERVICE_NAME..."
    cd "$SERVICE_DIR"
    
    case "$2" in
        check)
            npm run format:check
            ;;
        *)
            npm run format
            ;;
    esac
}

# Function to type check
type_check() {
    echo "Running type check for $SERVICE_NAME..."
    cd "$SERVICE_DIR"
    npm run type-check
}

# Function to analyze bundle
analyze_bundle() {
    echo "Analyzing bundle for $SERVICE_NAME..."
    cd "$SERVICE_DIR"
    npm run analyze
}

# Function to clean build artifacts
clean_build() {
    echo "Cleaning build artifacts..."
    cd "$SERVICE_DIR"
    rm -rf build/
    rm -rf node_modules/
    npm install
    echo "Clean complete!"
}

# Function to update dependencies
update_deps() {
    echo "Updating dependencies for $SERVICE_NAME..."
    cd "$SERVICE_DIR"
    npm update
    npm audit fix
    echo "Dependencies updated!"
}

# Function to serve production build locally
serve_production() {
    echo "Serving production build locally..."
    cd "$SERVICE_DIR"
    
    if [ ! -d "build" ]; then
        echo "No build found. Building first..."
        npm run build
    fi
    
    if command -v serve &> /dev/null; then
        serve -s build -l 3000
    else
        echo "Installing serve globally..."
        npm install -g serve
        serve -s build -l 3000
    fi
}

# Function to run Storybook (if available)
storybook() {
    echo "Starting Storybook for $SERVICE_NAME..."
    cd "$SERVICE_DIR"
    
    if [ -f ".storybook/main.js" ]; then
        npm run storybook
    else
        echo "Storybook not configured. Would you like to set it up? (y/N)"
        read -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npx storybook init
        fi
    fi
}

# Function to view service info
service_info() {
    echo "Service Information:"
    echo "==================="
    echo "Name: $SERVICE_NAME"
    echo "Directory: $SERVICE_DIR"
    echo "Type: React Frontend"
    echo "Node Version: $(node -v)"
    echo "NPM Version: $(npm -v)"
    echo ""
    
    if [ -f "package.json" ]; then
        echo "Package Information:"
        node -e "const pkg = require('./package.json'); console.log('Version:', pkg.version); console.log('Dependencies:', Object.keys(pkg.dependencies || {}).length); console.log('DevDependencies:', Object.keys(pkg.devDependencies || {}).length);"
    fi
}

# Main command handler
case "$1" in
    start)
        start_service
        ;;
    build)
        build_service
        ;;
    test)
        run_tests "$@"
        ;;
    lint)
        lint_code "$@"
        ;;
    format)
        format_code "$@"
        ;;
    type-check)
        type_check
        ;;
    analyze)
        analyze_bundle
        ;;
    clean)
        clean_build
        ;;
    update)
        update_deps
        ;;
    serve)
        serve_production
        ;;
    storybook)
        storybook
        ;;
    info)
        service_info
        ;;
    *)
        echo "Usage: $0 {start|build|test|lint|format|type-check|analyze|clean|update|serve|storybook|info}"
        echo ""
        echo "Commands:"
        echo "  start      - Start development server"
        echo "  build      - Build for production"
        echo "  test       - Run tests (options: unit, integration, coverage)"
        echo "  lint       - Run linting (option: fix)"
        echo "  format     - Format code (option: check)"
        echo "  type-check - Run TypeScript type checking"
        echo "  analyze    - Analyze bundle size"
        echo "  clean      - Clean build artifacts and reinstall dependencies"
        echo "  update     - Update dependencies"
        echo "  serve      - Serve production build locally"
        echo "  storybook  - Start Storybook"
        echo "  info       - Display service information"
        exit 1
        ;;
esac
EOF
    
    # Replace SERVICE_NAME with actual service name
    sed -i "s/SERVICE_NAME/${service}/g" "$service_path/scripts/dev.sh"
    
    chmod +x "$service_path/scripts/dev.sh"
}

# Main execution
echo "Generating setup and dev scripts for all centralized-dashboard services..."

# Process Java services
for service in "${JAVA_SERVICES[@]}"; do
    echo "Processing Java service: ${service}..."
    service_path="/mnt/c/Users/frich/Desktop/Exalt-Application-Limited/Exalt-Application-Limited/social-ecommerce-ecosystem/centralized-dashboard/${service}"
    
    if [ -d "${service_path}" ]; then
        create_java_setup_sh "${service}" "${service_path}"
        create_java_dev_sh "${service}" "${service_path}"
        echo "✅ Generated Java scripts for ${service}"
    else
        echo "❌ Service directory not found for ${service}"
    fi
done

# Process React services
for service in "${REACT_SERVICES[@]}"; do
    echo "Processing React service: ${service}..."
    service_path="/mnt/c/Users/frich/Desktop/Exalt-Application-Limited/Exalt-Application-Limited/social-ecommerce-ecosystem/centralized-dashboard/${service}"
    
    if [ -d "${service_path}" ]; then
        create_react_setup_sh "${service}" "${service_path}"
        create_react_dev_sh "${service}" "${service_path}"
        echo "✅ Generated React scripts for ${service}"
    else
        echo "❌ Service directory not found for ${service}"
    fi
done

echo "Script generation complete!"