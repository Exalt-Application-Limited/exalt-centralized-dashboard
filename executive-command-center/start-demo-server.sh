#!/bin/bash

echo "========================================"
echo "Executive Command Center Demo Server"
echo "========================================"
echo

echo "Starting demo server on port 3000..."
echo
echo "The demo will be available at:"
echo "http://localhost:3000/demo.html"
echo
echo "Demo Login Credentials:"
echo "Username: executive@exalt.com"
echo "Password: demo123"
echo
echo "Press Ctrl+C to stop the server"
echo

python3 -m http.server 3000