#!/bin/bash

# Shared Infrastructure Services Transformation Script
# Transform all Java services to use com.gogidix.infrastructure parent POM

echo "🔄 Starting Shared Infrastructure Transformation..."

services=(
    "admin-frameworks"
    "analytics-engine" 
    "api-gateway"
    "auth-service"
    "caching-service"
    "config-server"
    "document-verification"
    "file-storage-service"
    "geo-location-service"
    "kyc-service"
    "logging-service"
    "message-broker"
    "monitoring-service"
    "notification-service"
    "payment-processing-service"
    "service-registry"
    "tracing-config"
    "translation-service"
    "user-profile-service"
)

SUCCESS_COUNT=0
TOTAL_COUNT=${#services[@]}

for service in "${services[@]}"; do
    if [ -f "$service/pom.xml" ]; then
        echo "🔧 Transforming: $service"
        
        # Create backup
        cp "$service/pom.xml" "$service/pom.xml.backup"
        
        # Update parent POM reference
        sed -i 's/<groupId>org\.springframework\.boot<\/groupId>/<groupId>com.gogidix.infrastructure<\/groupId>/' "$service/pom.xml"
        sed -i 's/<artifactId>spring-boot-starter-parent<\/artifactId>/<artifactId>shared-infrastructure<\/artifactId>/' "$service/pom.xml"
        sed -i 's/<version>3\.1\.5<\/version>/<version>1.0.0<\/version>/' "$service/pom.xml"
        sed -i 's/<relativePath\/> <!-- lookup parent from repository -->/<relativePath>..\/pom.xml<\/relativePath>/' "$service/pom.xml"
        sed -i 's/<relativePath\/>/<relativePath>..\/pom.xml<\/relativePath>/' "$service/pom.xml"
        
        # Remove explicit groupId and version if present (inherited from parent)
        sed -i '/<groupId>com\.gogidix\.infrastructure<\/groupId>/d' "$service/pom.xml"
        sed -i '/<version>1\.0\.0<\/version>/d' "$service/pom.xml"
        
        # Update descriptions to use Gogidix branding
        sed -i 's/Exalt/Gogidix Technologies/g' "$service/pom.xml"
        sed -i 's/exalt/gogidix/g' "$service/pom.xml"
        
        # Test compilation
        if cd "$service" && mvn clean compile -q > /dev/null 2>&1; then
            echo "✅ $service: SUCCESS"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo "❌ $service: COMPILATION FAILED"
            # Restore backup if compilation fails
            cp "pom.xml.backup" "pom.xml"
        fi
        cd ..
    else
        echo "⚠️  $service: No pom.xml found"
    fi
done

echo -e "\n📊 Transformation Summary:"
echo "✅ Successfully transformed: $SUCCESS_COUNT/$TOTAL_COUNT services"
echo "🎯 Success rate: $((SUCCESS_COUNT * 100 / TOTAL_COUNT))%"

if [ $SUCCESS_COUNT -eq $TOTAL_COUNT ]; then
    echo "🎉 SHARED-INFRASTRUCTURE DOMAIN: 100% COMPLETE!"
else
    echo "⚠️  Some services need manual attention"
fi