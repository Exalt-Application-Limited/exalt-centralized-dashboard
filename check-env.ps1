# Environment Check Script
# Verifies that all required tools and configurations are set up correctly

$ErrorActionPreference = "Stop"

Write-Host "Checking development environment..." -ForegroundColor Cyan

# Check Java
$javaVersion = (java -version 2>&1 | Select-String "version").Line
if ($javaVersion) {
    Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Java is not installed or not in PATH" -ForegroundColor Red
}

# Check Maven
$mvnVersion = (mvn -v 2>&1 | Select-String "Apache Maven").Line
if ($mvnVersion) {
    Write-Host "✅ $mvnVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Maven is not installed or not in PATH" -ForegroundColor Red
}

# Check Git
$gitVersion = (git --version 2>&1).ToString()
if ($gitVersion) {
    Write-Host "✅ $gitVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Git is not installed or not in PATH" -ForegroundColor Red
}

# Check environment variables
$envVars = @("JAVA_HOME", "M2_HOME")

foreach ($var in $envVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    if ($value) {
        Write-Host "✅ $var: $value" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $var is not set" -ForegroundColor Yellow
    }
}

# Check project structure
$requiredDirs = @("src/main/java", "src/test/java", "src/main/resources")
$missingDirs = @()

foreach ($dir in $requiredDirs) {
    if (-not (Test-Path $dir)) {
        $missingDirs += $dir
    }
}

if ($missingDirs.Count -eq 0) {
    Write-Host "✅ Project structure is valid" -ForegroundColor Green
} else {
    Write-Host "❌ Missing directories:" -ForegroundColor Red
    foreach ($dir in $missingDirs) {
        Write-Host "   - $dir" -ForegroundColor Red
    }
}

Write-Host "`nEnvironment check complete!" -ForegroundColor Cyan
