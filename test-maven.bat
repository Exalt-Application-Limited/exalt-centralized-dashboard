@echo off
REM Script to test Maven with minimal settings

call use-local-tools.bat

echo Testing Maven with a simple command...
mvn --version

if %ERRORLEVEL% NEQ 0 (
    echo Error: Maven test failed
    exit /b 1
)

echo.
echo Maven is working correctly. Now trying a simple Maven project...

:: Create a temporary directory for the test project
set TEST_DIR=%TEMP%\maven-test-project
if exist "%TEST_DIR%" (
    rmdir /s /q "%TEST_DIR%"
)
mkdir "%TEST_DIR%"
cd /d "%TEST_DIR%"

:: Create a minimal pom.xml
echo Creating test Maven project...
echo ^<?xml version="1.0" encoding="UTF-8"?^> > pom.xml
echo ^<project xmlns="http://maven.apache.org/POM/4.0.0"^> >> pom.xml
echo   ^<modelVersion^>4.0.0^</modelVersion^> >> pom.xml
echo   ^<groupId^>com.example^</groupId^> >> pom.xml
echo   ^<artifactId^>test-maven^</artifactId^> >> pom.xml
echo   ^<version^>1.0-SNAPSHOT^</version^> >> pom.xml
echo   ^<properties^> >> pom.xml
echo     ^<maven.compiler.source^>17^</maven.compiler.source^> >> pom.xml
echo     ^<maven.compiler.target^>17^</maven.compiler.target^> >> pom.xml
echo   ^</properties^> >> pom.xml
echo ^</project^> >> pom.xml

echo.
echo Running Maven with the test project...
mvn clean compile

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==================================================
    echo Maven is working correctly with the test project!
    echo ==================================================
) else (
    echo.
    echo ==================================================
    echo Maven encountered an error with the test project.
    echo Check the output above for details.
    echo ==================================================
)

cd /d %~dp0
pause
