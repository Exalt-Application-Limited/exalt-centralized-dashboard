#!/bin/bash

echo "=================================="
echo "Building Centralized Analytics Dashboard"
echo "=================================="

# Check Node version
NODE_VERSION=$(node -v)
echo "Node version: $NODE_VERSION"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --legacy-peer-deps --no-audit --no-fund || {
        echo "Failed to install dependencies"
        exit 1
    }
else
    echo "Dependencies already installed"
fi

# Try to build
echo "Building React application..."
if [ -f "node_modules/.bin/react-scripts" ]; then
    ./node_modules/.bin/react-scripts build
elif command -v npx &> /dev/null; then
    npx react-scripts build
else
    node node_modules/react-scripts/scripts/build.js
fi

# Check if build was successful
if [ -d "build" ]; then
    echo "=================================="
    echo "Build successful!"
    echo "Output directory: ./build"
    echo "=================================="
    ls -la build/
else
    echo "Build failed!"
    exit 1
fi