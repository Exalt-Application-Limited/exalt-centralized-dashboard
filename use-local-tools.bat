@echo off
REM Script to use Java and Maven from local-tools directory

setlocal

:: Set paths to local tools
set LOCAL_TOOLS=%~dp0\..\..\local-tools
set JAVA_HOME=%LOCAL_TOOLS%\java\jdk-17.0.2
set MAVEN_HOME=%LOCAL_TOOLS%\apache-maven-3.9.6

:: Add to PATH
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%

echo Using Java from: %JAVA_HOME%
echo Using Maven from: %MAVEN_HOME%
echo.

:: Verify Java
java -version
if %ERRORLEVEL% NEQ 0 (
    echo Error: Java is not working properly
    exit /b 1
)

echo.
:: Verify Maven
mvn -version
if %ERRORLEVEL% NEQ 0 (
    echo Error: Maven is not working properly
    exit /b 1
)

echo.
echo Environment is ready. You can now run Maven commands.
echo Example: mvn clean test

:: Keep the window open
pause
