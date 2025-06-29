@echo off
REM Run tests for the centralized-dashboard module
REM This batch file runs the PowerShell test script

SETLOCAL

REM Check if PowerShell is available
where powershell >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: PowerShell is not available. Please install PowerShell and try again.
    exit /b 1
)

REM Run the PowerShell script
echo Running tests...
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0run-tests.ps1"

REM Check the result
if %ERRORLEVEL% NEQ 0 (
    echo Tests failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

echo All tests passed successfully!
pause
