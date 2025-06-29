#!/bin/bash

echo "🔄 Updating package names in centralized-performance-metrics..."

# Navigate to the service directory
cd centralized-performance-metrics

# Update package declarations in Java files
find src -name "*.java" -exec sed -i 's/package com\.microecosystem\.metrics/package com.exalt.centralizeddashboard.metrics/g' {} \;

# Update import statements
find src -name "*.java" -exec sed -i 's/import com\.microecosystem\.metrics/import com.exalt.centralizeddashboard.metrics/g' {} \;

# Update javax.persistence to jakarta.persistence for Spring Boot 3.x compatibility
find src -name "*.java" -exec sed -i 's/import javax\.persistence\./import jakarta.persistence./g' {} \;

echo "✅ Package name updates completed for centralized-performance-metrics!"

# Create new directory structure
echo "📁 Creating new directory structure..."
mkdir -p src/main/java/com/exalt/centralizeddashboard/metrics
mkdir -p src/test/java/com/exalt/centralizeddashboard/metrics

# Copy files to new structure
if [ -d "src/main/java/com/microecosystem/metrics" ]; then
    cp -r src/main/java/com/microecosystem/metrics/* src/main/java/com/exalt/centralizeddashboard/metrics/ 2>/dev/null || true
fi

if [ -d "src/test/java/com/microecosystem/metrics" ]; then
    cp -r src/test/java/com/microecosystem/metrics/* src/test/java/com/exalt/centralizeddashboard/metrics/ 2>/dev/null || true
fi

# Remove old directory structure
rm -rf src/main/java/com/microecosystem 2>/dev/null || true
rm -rf src/test/java/com/microecosystem 2>/dev/null || true

echo "✅ Directory structure updated for centralized-performance-metrics!"