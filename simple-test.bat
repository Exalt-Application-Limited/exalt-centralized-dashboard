@echo off
REM Simple test script to verify Java and Maven

echo Setting up environment...
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.15.6-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo.
echo Java Version:
java -version

echo.
echo Maven Wrapper Version:
call mvnw.cmd -v

echo.
echo Environment setup complete.
pause
