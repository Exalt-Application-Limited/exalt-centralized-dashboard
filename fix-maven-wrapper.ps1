# Script to fix Maven Wrapper installation

$ErrorActionPreference = "Stop"

# Create .mvn/wrapper directory if it doesn't exist
$wrapperDir = ".mvn\wrapper"
if (-not (Test-Path $wrapperDir)) {
    New-Item -ItemType Directory -Path $wrapperDir -Force | Out-Null
}

# Download Maven Wrapper JAR
$wrapperUrl = "https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar"
$wrapperJar = "$wrapperDir\maven-wrapper.jar"

Write-Host "Downloading Maven Wrapper JAR..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $wrapperUrl -OutFile $wrapperJar
    Write-Host "Maven Wrapper JAR downloaded successfully" -ForegroundColor Green
}
catch {
    Write-Error "Failed to download Maven Wrapper JAR: $_"
    exit 1
}

# Create/update Maven Wrapper properties
$wrapperProps = @"
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.8.6/apache-maven-3.8.6-bin.zip
wrapperUrl=https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar
"@

$wrapperProps | Out-File -FilePath "$wrapperDir\maven-wrapper.properties" -Encoding ASCII -Force
Write-Host "Maven Wrapper properties updated" -ForegroundColor Green

# Verify the wrapper
Write-Host "`nVerifying Maven Wrapper..." -ForegroundColor Cyan
& .\mvnw.cmd -v

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nMaven Wrapper fixed successfully!" -ForegroundColor Green
    Write-Host "You can now use './mvnw' (or 'mvnw.cmd' on Windows) to run Maven commands." -ForegroundColor Green
}
else {
    Write-Error "Failed to fix Maven Wrapper. Please check the error messages above."
    exit 1
}
