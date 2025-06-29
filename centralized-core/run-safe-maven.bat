@echo off
REM Script to run Maven with minimal JVM settings to avoid crashes

setlocal

:: Set paths to local tools
set LOCAL_TOOLS=C:\Users\frich\Desktop\Micro-Social-Ecommerce-Ecosystems\local-tools
set JAVA_HOME=%LOCAL_TOOLS%\java\jdk-17.0.2
set MAVEN_HOME=%LOCAL_TOOLS%\apache-maven-3.9.6

:: Add to PATH
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%

:: Set minimal JVM options to avoid crashes
set MAVEN_OPTS=-Xms256m -Xmx512m -XX:+UseSerialGC -XX:-TieredCompilation -XX:CICompilerCount=1

echo Using Java from: %JAVA_HOME%
echo Using Maven from: %MAVEN_HOME%
echo Maven options: %MAVEN_OPTS%
echo.

:: Run the specified Maven command
echo Running Maven command: %*
call mvn %*

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==================================================
    echo Maven command completed successfully!
    echo ==================================================
) else (
    echo.
    echo ==================================================
    echo Maven command failed with exit code %ERRORLEVEL%.
    echo ==================================================
)

exit /b %ERRORLEVEL%
