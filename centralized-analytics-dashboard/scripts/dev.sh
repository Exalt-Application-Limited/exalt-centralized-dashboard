#!/bin/bash

# Development utility script for centralized-analytics-dashboard React Frontend
# This script provides common development commands for React applications

set -e

centralized-analytics-dashboard="centralized-analytics-dashboard"
SERVICE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Load environment variables
if [ -f "$SERVICE_DIR/.env.local" ]; then
    export $(cat "$SERVICE_DIR/.env.local" | grep -v '^#' | xargs)
fi

# Function to start the development server
start_service() {
    echo "Starting $centralized-analytics-dashboard development server..."
    cd "$SERVICE_DIR"
    npm start
}

# Function to build for production
build_service() {
    echo "Building $centralized-analytics-dashboard for production..."
    cd "$SERVICE_DIR"
    npm run build
    echo "Build complete! Files are in the build/ directory"
}

# Function to run tests
run_tests() {
    echo "Running tests for $centralized-analytics-dashboard..."
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
    echo "Running linting for $centralized-analytics-dashboard..."
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
    echo "Formatting code for $centralized-analytics-dashboard..."
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
    echo "Running type check for $centralized-analytics-dashboard..."
    cd "$SERVICE_DIR"
    npm run type-check
}

# Function to analyze bundle
analyze_bundle() {
    echo "Analyzing bundle for $centralized-analytics-dashboard..."
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
    echo "Updating dependencies for $centralized-analytics-dashboard..."
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
    echo "Starting Storybook for $centralized-analytics-dashboard..."
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
    echo "Name: $centralized-analytics-dashboard"
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
