@echo off
REM Run a single test class using Maven Wrapper

if "%1"=="" (
    echo Please specify a test class to run, e.g.:
    echo   run-single-test.bat com.microecommerce.centralizeddashboard.core.service.MetricCollectorServiceImplTest
    exit /b 1
)

echo Running test: %1
call mvnw.cmd -Dtest=%1 test

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Test failed with error code %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Test passed successfully!
pause
