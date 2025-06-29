# Script to set up Java environment variables
$ErrorActionPreference = "Stop"

Write-Host "Setting up Java environment..." -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "Please run this script as Administrator to set environment variables"
    exit 1
}

# Find Java installation
$javaHome = $env:JAVA_HOME

if (-not $javaHome) {
    # Try to find Java in common locations
    $possiblePaths = @(
        "C:\Program Files\Java\jdk-17*",
        "C:\Program Files (x86)\Java\jdk-17*",
        "${env:ProgramFiles}\Java\jdk-17*",
        "${env:ProgramFiles(x86)}\Java\jdk-17*",
        "C:\Java\jdk-17*"
    )
    
    foreach ($path in $possiblePaths) {
        $jdkPath = Get-ChildItem -Path $path -Directory -ErrorAction SilentlyContinue | 
                   Sort-Object Name -Descending | 
                   Select-Object -First 1
        
        if ($jdkPath) {
            $javaHome = $jdkPath.FullName
            break
        }
    }
    
    if (-not $javaHome) {
        Write-Error "Java 17 JDK not found. Please install it first."
        exit 1
    }
    
    # Set JAVA_HOME permanently
    [System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaHome, [System.EnvironmentVariableTarget]::Machine)
    $env:JAVA_HOME = $javaHome
    Write-Host "Set JAVA_HOME to: $javaHome" -ForegroundColor Green
}

# Add Java to PATH if not already there
$javaBinPath = "$javaHome\bin"
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', [System.EnvironmentVariableTarget]::Machine)

if ($currentPath -notlike "*$javaBinPath*") {
    [System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$javaBinPath", [System.EnvironmentVariableTarget]::Machine)
    $env:Path += ";$javaBinPath"
    Write-Host "Added $javaBinPath to PATH" -ForegroundColor Green
}

# Verify Java installation
try {
    $javaVersion = java -version 2>&1
    Write-Host "`nJava version:" -ForegroundColor Green
    $javaVersion | ForEach-Object { Write-Host "  $_" }
} catch {
    Write-Error "Java is not properly installed or not in PATH"
    exit 1
}

Write-Host "`nJava environment is properly configured!" -ForegroundColor Green
Write-Host "You may need to restart any open terminals for changes to take effect."
