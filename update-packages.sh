#!/bin/bash

# Script to update package names from com.microecosystem to com.exalt.centralizeddashboard

echo "🔄 Updating package names in centralized-core..."

# Update package declarations in Java files
find centralized-core/src -name "*.java" -exec sed -i 's/package com\.microecosystem\.dashboard\.core/package com.exalt.centralizeddashboard.core/g' {} \;
find centralized-core/src -name "*.java" -exec sed -i 's/package com\.microecosystem\.analytics\.aggregation/package com.exalt.centralizeddashboard.analytics/g' {} \;

# Update import statements
find centralized-core/src -name "*.java" -exec sed -i 's/import com\.microecosystem\.dashboard\.core/import com.exalt.centralizeddashboard.core/g' {} \;
find centralized-core/src -name "*.java" -exec sed -i 's/import com\.microecosystem\.analytics\.aggregation/import com.exalt.centralizeddashboard.analytics/g' {} \;

echo "✅ Package name updates completed for centralized-core!"

# Create new directory structure and move files
echo "📁 Creating new directory structure..."
mkdir -p centralized-core/src/main/java/com/exalt/centralizeddashboard/core
mkdir -p centralized-core/src/test/java/com/exalt/centralizeddashboard/core

# Copy all files to new structure
if [ -d "centralized-core/src/main/java/com/microecosystem/dashboard/core" ]; then
    cp -r centralized-core/src/main/java/com/microecosystem/dashboard/core/* centralized-core/src/main/java/com/exalt/centralizeddashboard/core/ 2>/dev/null || true
fi

if [ -d "centralized-core/src/test/java/com/microecosystem/dashboard/core" ]; then
    cp -r centralized-core/src/test/java/com/microecosystem/dashboard/core/* centralized-core/src/test/java/com/exalt/centralizeddashboard/core/ 2>/dev/null || true
fi

# Remove old directory structure
rm -rf centralized-core/src/main/java/com/microecosystem 2>/dev/null || true
rm -rf centralized-core/src/test/java/com/microecosystem 2>/dev/null || true

echo "✅ Directory structure updated for centralized-core!"