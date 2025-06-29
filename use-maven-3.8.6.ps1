# Download and use Maven 3.8.6
$ErrorActionPreference = "Stop"

$mavenVersion = "3.8.6"
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$mavenDir = "$PSScriptRoot\.m2\wrapper\dists\apache-maven-$mavenVersion-bin"
$mavenZip = "$PSScriptRoot\apache-maven-$mavenVersion-bin.zip"

# Create Maven directory if it doesn't exist
if (-not (Test-Path $mavenDir)) {
    New-Item -ItemType Directory -Path $mavenDir -Force | Out-Null
    
    Write-Host "Downloading Maven $mavenVersion..."
    try {
        Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip
        
        # Extract Maven
        Write-Host "Extracting Maven..."
        Expand-Archive -Path $mavenZip -DestinationPath "$PSScriptRoot\.m2\wrapper\dists" -Force
        
        # Move contents from the versioned directory to the target directory
        $extractedDir = Get-ChildItem -Path "$PSScriptRoot\.m2\wrapper\dists" -Directory | Where-Object { $_.Name -like "apache-maven-*" } | Select-Object -First 1
        if ($extractedDir) {
            Get-ChildItem -Path $extractedDir.FullName | Move-Item -Destination $mavenDir -Force
            Remove-Item -Path $extractedDir.FullName -Recurse -Force
        }
        
        # Clean up
        Remove-Item -Path $mavenZip -Force -ErrorAction SilentlyContinue
    }
    catch {
        Write-Error "Failed to download or extract Maven: $_"
        exit 1
    }
}

# Set up environment variables
$env:M2_HOME = $mavenDir
$env:PATH = "$mavenDir\bin;$env:PATH"

Write-Host "Using Maven from: $mavenDir"
Write-Host "Maven version:"
& "$mavenDir\bin\mvn.cmd" -v

# Run the Maven command if arguments were provided
if ($args.Count -gt 0) {
    Write-Host "Running: mvn $args"
    & "$mavenDir\bin\mvn.cmd" $args
    exit $LASTEXITCODE
}
else {
    Write-Host "No Maven command specified. Environment has been configured for Maven $mavenVersion."
    Write-Host "You can now run Maven commands directly."
}
