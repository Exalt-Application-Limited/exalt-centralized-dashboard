#!/bin/bash

# Setup script for centralized-real-time-data
# This script sets up the development environment for the Java service

set -e

echo "Setting up centralized-real-time-data development environment..."

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
mkdir -p src/main/java/com/exalt/centralizeddashboard/centralized-real-time-data_CLEAN
mkdir -p src/main/resources
mkdir -p src/test/java/com/exalt/centralizeddashboard/centralized-real-time-data_CLEAN
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
centralized-real-time-data=centralized-real-time-data
SERVICE_PORT=8080
SPRING_PROFILES_ACTIVE=local
DATABASE_URL=jdbc:postgresql://localhost:5432/centralized-real-time-data_db
DATABASE_USERNAME=centralized-real-time-data_user
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
    <artifactId>centralized-real-time-data</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    
    <name>centralized-real-time-data</name>
    <description>Centralized Dashboard centralized-real-time-data Service</description>
    
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
      POSTGRES_DB: centralized-real-time-data_db
      POSTGRES_USER: centralized-real-time-data_user
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
echo "Building centralized-real-time-data..."
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
