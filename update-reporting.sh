#!/bin/bash

echo "🔄 Updating package names in centralized-reporting..."

# Navigate to the service directory
cd centralized-reporting

# Update package declarations in Java files
find src -name "*.java" -exec sed -i 's/package com\.microecosystem\.reporting/package com.exalt.centralizeddashboard.reporting/g' {} \;

# Update import statements
find src -name "*.java" -exec sed -i 's/import com\.microecosystem\.reporting/import com.exalt.centralizeddashboard.reporting/g' {} \;

# Update javax.persistence to jakarta.persistence for Spring Boot 3.x compatibility
find src -name "*.java" -exec sed -i 's/import javax\.persistence\./import jakarta.persistence./g' {} \;

echo "✅ Package name updates completed for centralized-reporting!"

# Create new directory structure
echo "📁 Creating new directory structure..."
mkdir -p src/main/java/com/exalt/centralizeddashboard/reporting
mkdir -p src/test/java/com/exalt/centralizeddashboard/reporting

# Copy files to new structure
if [ -d "src/main/java/com/microecosystem/reporting" ]; then
    cp -r src/main/java/com/microecosystem/reporting/* src/main/java/com/exalt/centralizeddashboard/reporting/ 2>/dev/null || true
fi

if [ -d "src/test/java/com/microecosystem/reporting" ]; then
    cp -r src/test/java/com/microecosystem/reporting/* src/test/java/com/exalt/centralizeddashboard/reporting/ 2>/dev/null || true
fi

# Remove old directory structure
rm -rf src/main/java/com/microecosystem 2>/dev/null || true
rm -rf src/test/java/com/microecosystem 2>/dev/null || true

echo "✅ Directory structure updated for centralized-reporting!"