#!/bin/bash

echo "🚀 Starting Executive Command Center Local Development Server..."
echo "=============================================="
echo

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo "This may take 5-10 minutes on first run..."
    npm install --legacy-peer-deps --verbose
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating local environment file..."
    cat > .env.local << EOF
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_AUTH_DOMAIN=localhost
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0-dev
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_LOG_LEVEL=debug
EOF
fi

echo
echo "🌐 Starting development server..."
echo "================================"
echo
echo "The application will open at: http://localhost:3000"
echo
echo "Demo Login Credentials:"
echo "Username: executive@exalt.com"
echo "Password: demo123"
echo
echo "Press Ctrl+C to stop the server"
echo

# Start the development server
PORT=3000 npm start