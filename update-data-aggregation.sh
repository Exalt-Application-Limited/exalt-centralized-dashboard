#!/bin/bash

echo "🔄 Updating package names in centralized-data-aggregation..."

# Navigate to the service directory
cd centralized-data-aggregation

# Update package declarations in Java files
find src -name "*.java" -exec sed -i 's/package com\.microecosystem\.analytics\.aggregation/package com.exalt.centralizeddashboard.analytics.aggregation/g' {} \;
find src -name "*.java" -exec sed -i 's/package com\.microecosystem\.dataaggregation/package com.exalt.centralizeddashboard.dataaggregation/g' {} \;

# Update import statements
find src -name "*.java" -exec sed -i 's/import com\.microecosystem\.analytics\.aggregation/import com.exalt.centralizeddashboard.analytics.aggregation/g' {} \;
find src -name "*.java" -exec sed -i 's/import com\.microecosystem\.dataaggregation/import com.exalt.centralizeddashboard.dataaggregation/g' {} \;

echo "✅ Package name updates completed for centralized-data-aggregation!"

# Create new directory structure
echo "📁 Creating new directory structure..."
mkdir -p src/main/java/com/exalt/centralizeddashboard/analytics/aggregation
mkdir -p src/main/java/com/exalt/centralizeddashboard/dataaggregation
mkdir -p src/test/java/com/exalt/centralizeddashboard/analytics/aggregation
mkdir -p src/test/java/com/exalt/centralizeddashboard/dataaggregation

# Copy files to new structure
if [ -d "src/main/java/com/microecosystem/analytics/aggregation" ]; then
    cp -r src/main/java/com/microecosystem/analytics/aggregation/* src/main/java/com/exalt/centralizeddashboard/analytics/aggregation/ 2>/dev/null || true
fi

if [ -d "src/main/java/com/microecosystem/dataaggregation" ]; then
    cp -r src/main/java/com/microecosystem/dataaggregation/* src/main/java/com/exalt/centralizeddashboard/dataaggregation/ 2>/dev/null || true
fi

# Remove old directory structure
rm -rf src/main/java/com/microecosystem 2>/dev/null || true
rm -rf src/test/java/com/microecosystem 2>/dev/null || true

echo "✅ Directory structure updated for centralized-data-aggregation!"