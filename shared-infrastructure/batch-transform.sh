#!/bin/bash
# Batch transformation script for shared-infrastructure services
# Transforms all services to use com.gogidix.infrastructure parent POM

echo "🔄 Starting Shared Infrastructure Batch Transformation..."

# List of Java services
java_services=(
    "admin-frameworks"
    "analytics-engine"
    "api-gateway"
    "auth-service"
    "caching-service"
    "config-server"
    "currency-exchange-service"
    "data-transformation-service"
    "email-service"
    "event-streaming-service"
    "logging-service"
    "message-queue-service"
    "monitoring-service"
    "notification-service"
    "payment-gateway"
    "redis-cache-service"
    "search-service"
    "service-registry"
    "storage-service"
    "gateway-service"
)

# List of Node.js services
node_services=(
    "api-documentation"
    "dashboard-service"
    "real-time-analytics"
    "websocket-service"
)

success_count=0
failed_count=0

echo "
📋 Processing Java Services..."
for service in "${java_services[@]}"; do
    echo "🔧 Transforming: $service"
    
    if [ -f "$service/pom.xml" ]; then
        # Create backup
        cp "$service/pom.xml" "$service/pom.xml.backup"
        
        # Transform POM using sed
        sed -i '/<parent>/,/<\/parent>/c\
	<parent>\
		<groupId>com.gogidix.infrastructure</groupId>\
		<artifactId>shared-infrastructure</artifactId>\
		<version>1.0.0</version>\
		<relativePath>../pom.xml</relativePath>\
	</parent>' "$service/pom.xml"
        
        # Remove groupId and version from service (they inherit from parent)
        sed -i '/<groupId>com\.exalt.*<\/groupId>/d' "$service/pom.xml"
        sed -i '/<groupId>com\.ecosystem.*<\/groupId>/d' "$service/pom.xml"
        sed -i '/<groupId>com\.microecosystem.*<\/groupId>/d' "$service/pom.xml"
        sed -i '/<version>0\.0\.1-SNAPSHOT<\/version>/d' "$service/pom.xml"
        sed -i '/<version>1\.0\.0<\/version>/d' "$service/pom.xml"
        
        # Update description to use Gogidix Technologies
        sed -i 's/Exalt/Gogidix Technologies/g' "$service/pom.xml"
        sed -i 's/Micro Ecosystem/Gogidix Infrastructure/g' "$service/pom.xml"
        
        # Remove duplicate properties that are in parent
        sed -i '/<java\.version>17<\/java\.version>/d' "$service/pom.xml"
        sed -i '/<maven\.compiler\.source>17<\/maven\.compiler\.source>/d' "$service/pom.xml"
        sed -i '/<maven\.compiler\.target>17<\/maven\.compiler\.target>/d' "$service/pom.xml"
        sed -i '/<project\.build\.sourceEncoding>UTF-8<\/project\.build\.sourceEncoding>/d' "$service/pom.xml"
        sed -i '/<project\.reporting\.outputEncoding>UTF-8<\/project\.reporting\.outputEncoding>/d' "$service/pom.xml"
        sed -i '/<spring-boot\.version>.*<\/spring-boot\.version>/d' "$service/pom.xml"
        
        # Remove dependencyManagement section for spring-cloud (handled by parent)
        sed -i '/<dependencyManagement>/,/<\/dependencyManagement>/d' "$service/pom.xml"
        
        # Add version tag after parent if missing
        sed -i '/<\/parent>/a\\t<version>1.0.0</version>' "$service/pom.xml"
        
        echo "✅ $service: POM transformed"
        ((success_count++))
    else
        echo "❌ $service: pom.xml not found"
        ((failed_count++))
    fi
done

echo "
📋 Processing Node.js Services..."
for service in "${node_services[@]}"; do
    echo "🔧 Updating: $service"
    
    if [ -f "$service/package.json" ]; then
        # Update package.json
        sed -i 's/"Exalt/"Gogidix Technologies/g' "$service/package.json"
        sed -i 's/"exalt"/"gogidix"/g' "$service/package.json"
        sed -i 's/Exalt Application Limited/Gogidix Technologies Limited/g' "$service/package.json"
        sed -i 's/"version": "0\.0\.1"/"version": "1.0.0"/g' "$service/package.json"
        
        echo "✅ $service: package.json updated"
        ((success_count++))
    else
        echo "❌ $service: package.json not found"
        ((failed_count++))
    fi
done

echo "
📊 Transformation Summary:"
echo "✅ Successful: $success_count"
echo "❌ Failed: $failed_count"
echo "
🎯 Next Steps:"
echo "1. Review transformed POMs for any specific dependencies"
echo "2. Test compilation for each service"
echo "3. Update Java package structures if needed"