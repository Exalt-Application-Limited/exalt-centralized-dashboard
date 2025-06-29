# Simple Java version checker
$ErrorActionPreference = "Stop"

Write-Host "Checking Java installation..." -ForegroundColor Cyan

# Check if java is in PATH
try {
    $javaPath = (Get-Command java -ErrorAction Stop).Source
    Write-Host "Java found at: $javaPath" -ForegroundColor Green
} catch {
    Write-Host "Java not found in PATH" -ForegroundColor Red
    exit 1
}

# Get Java version
try {
    $javaVersion = & java -version 2>&1 | Select-Object -First 1
    Write-Host "Java version: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "Error getting Java version: $_" -ForegroundColor Red
    exit 1
}

# Check JAVA_HOME
if ($env:JAVA_HOME) {
    Write-Host "JAVA_HOME is set to: $($env:JAVA_HOME)" -ForegroundColor Green
    
    # Verify JAVA_HOME points to a valid Java installation
    if (Test-Path "$($env:JAVA_HOME)\bin\java.exe") {
        Write-Host "JAVA_HOME points to a valid Java installation" -ForegroundColor Green
    } else {
        Write-Host "WARNING: JAVA_HOME does not point to a valid Java installation" -ForegroundColor Yellow
    }
} else {
    Write-Host "WARNING: JAVA_HOME is not set" -ForegroundColor Yellow
}

# Check Java architecture
Write-Host "`nJava Architecture:" -ForegroundColor Cyan
& java -XshowSettings:properties -version 2>&1 | Select-String "os.arch"

Write-Host "`nJava environment check complete!"
