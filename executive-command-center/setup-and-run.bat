@echo off
echo ========================================
echo Exalt Executive Command Center Setup
echo ========================================
echo.

REM Change to the correct directory
cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Step 1: Installing dependencies...
echo This may take 5-10 minutes depending on your internet connection
echo.

REM Install dependencies with legacy peer deps to resolve conflicts
npm install --legacy-peer-deps

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Trying alternative installation method...
    echo.
    npm install --force
)

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Installation failed. Please check your internet connection.
    echo Make sure you have Node.js and npm installed.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.

echo Step 2: Starting development server...
echo.
echo The application will open at: http://localhost:3000
echo.
echo Demo Login Credentials:
echo Username: executive@exalt.com
echo Password: demo123
echo.
echo Press Ctrl+C to stop the server when done
echo.

REM Start the development server
npm start

echo.
echo Server stopped.
pause