@echo off
REM Run Maven Wrapper with safe JVM arguments
set MAVEN_OPTS=-XX:+UseSerialGC -Xmx512m -XX:MaxMetaspaceSize=256m -Djava.net.preferIPv4Stack=true
call mvnw.cmd %*
