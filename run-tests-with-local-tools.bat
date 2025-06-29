@echo off
REM Script to run tests using local Java and Maven installations

call use-local-tools.bat

if "%1"=="" (
    echo Running all tests...
    mvn clean test
) else (
    echo Running test class: %1
    mvn -Dtest=%1 test
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==================================================
    echo All tests passed successfully!
    echo ==================================================
) else (
    echo.
    echo ==================================================
    echo Some tests failed. Check the output above for details.
    echo ==================================================
)

pause
