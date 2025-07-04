#!/bin/bash

echo "========================================"
echo "Exalt Executive Command Center Setup"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Current directory: $(pwd)"
echo

echo "Step 1: Installing dependencies..."
echo "This may take 5-10 minutes depending on your internet connection"
echo

# Install dependencies with legacy peer deps to resolve conflicts
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo
    echo "ERROR: Failed to install dependencies"
    echo "Trying alternative installation method..."
    echo
    npm install --force
fi

if [ $? -ne 0 ]; then
    echo
    echo "ERROR: Installation failed. Please check your internet connection."
    echo "Make sure you have Node.js and npm installed."
    echo
    read -p "Press Enter to continue..."
    exit 1
fi

echo
echo "========================================"
echo "Installation completed successfully!"
echo "========================================"
echo

echo "Step 2: Starting development server..."
echo
echo "The application will open at: http://localhost:3000"
echo
echo "Demo Login Credentials:"
echo "Username: executive@exalt.com"
echo "Password: demo123"
echo
echo "Press Ctrl+C to stop the server when done"
echo

# Start the development server
npm start

echo
echo "Server stopped."
read -p "Press Enter to continue..."