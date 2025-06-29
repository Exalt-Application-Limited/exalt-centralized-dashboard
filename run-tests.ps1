# Run tests for the centralized-dashboard module
# This script runs Maven tests using the Maven Wrapper (mvnw)

$ErrorActionPreference = "Stop"

# Set the directory to the script location
$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path $scriptPath -Parent
Set-Location $scriptDir

# Configuration
$mavenVersion = "3.9.6"
$mavenUrl = "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$mavenDir = Join-Path -Path $scriptDir -ChildPath "local-tools"
$mavenHome = Join-Path -Path $mavenDir -ChildPath "apache-maven-$mavenVersion"
$mvnCmd = Join-Path -Path $mavenHome -ChildPath "bin\mvn.cmd"

# Function to download and extract Maven
function Install-Maven {
    Write-Host "Downloading Maven $mavenVersion..."
    
    # Create local tools directory if it doesn't exist
    if (-not (Test-Path $mavenDir)) {
        New-Item -ItemType Directory -Path $mavenDir | Out-Null
    }
    
    $zipFile = Join-Path -Path $mavenDir -ChildPath "maven-$mavenVersion.zip"
    
    # Download Maven
    try {
        Invoke-WebRequest -Uri $mavenUrl -OutFile $zipFile -UseBasicParsing
    } catch {
        Write-Error "Failed to download Maven: $_"
        exit 1
    }
    
    # Extract Maven
    try {
        Expand-Archive -Path $zipFile -DestinationPath $mavenDir -Force
        Remove-Item -Path $zipFile -Force
    } catch {
        Write-Error "Failed to extract Maven: $_"
        exit 1
    }
    
    # Verify Maven installation
    if (Test-Path $mvnCmd) {
        Write-Host "Maven $mavenVersion installed successfully" -ForegroundColor Green
    } else {
        Write-Error "Maven installation verification failed"
        exit 1
    }
}

# Check if Maven is already installed
if (-not (Test-Path $mvnCmd)) {
    Write-Host "Maven not found in $mavenHome"
    Install-Maven
}

# Set M2_HOME environment variable for the current process
$env:M2_HOME = $mavenHome
$env:PATH = "$mavenHome\bin;" + $env:PATH

# Run tests with Maven
Write-Host "Running tests using Maven $mavenVersion..."
& $mvnCmd clean test

# Check the result
if ($LASTEXITCODE -ne 0) {
    Write-Error "Tests failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "All tests passed successfully!" -ForegroundColor Green
