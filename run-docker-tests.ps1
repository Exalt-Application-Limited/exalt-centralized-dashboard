# Run tests using Docker with Maven pre-installed
# This ensures consistent test execution across different environments

$ErrorActionPreference = "Stop"

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Build and run the tests in a Maven container
Write-Host "Running tests in Docker container..." -ForegroundColor Cyan

try {
    # Run Maven in a container with the project directory mounted
    docker run --rm \
        -v "${scriptDir}:/usr/src/mymaven" \
        -w /usr/src/mymaven \
        maven:3.9.6-openjdk-17 \
        mvn clean test

    if ($LASTEXITCODE -eq 0) {
        Write-Host "All tests passed successfully!" -ForegroundColor Green
    } else {
        Write-Error "Tests failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} catch {
    Write-Error "Error running tests in Docker: $_"
    exit 1
}
