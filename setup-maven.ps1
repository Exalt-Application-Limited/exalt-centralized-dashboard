# PowerShell script to set up Maven 3.8.6

$ErrorActionPreference = "Stop"

# Set Maven version
$mavenVersion = "3.8.6"
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$mavenDir = "$PSScriptRoot\.m2\wrapper\dists\apache-maven-$mavenVersion"
$mavenZip = "$env:TEMP\apache-maven-$mavenVersion-bin.zip"

# Create Maven directory if it doesn't exist
if (-not (Test-Path $mavenDir)) {
    Write-Host "Downloading Maven $mavenVersion..." -ForegroundColor Cyan
    try {
        # Download Maven
        Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip
        
        # Extract Maven
        Write-Host "Extracting Maven to $mavenDir..." -ForegroundColor Cyan
        Expand-Archive -Path $mavenZip -DestinationPath $env:TEMP -Force
        
        # Create target directory
        New-Item -ItemType Directory -Path $mavenDir -Force | Out-Null
        
        # Move files to the target directory
        $extractedDir = Get-ChildItem -Path $env:TEMP -Directory | Where-Object { $_.Name -like "apache-maven-*" } | Select-Object -First 1
        if ($extractedDir) {
            Get-ChildItem -Path $extractedDir.FullName | Move-Item -Destination $mavenDir -Force
            Remove-Item -Path $extractedDir.FullName -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        # Clean up
        Remove-Item -Path $mavenZip -Force -ErrorAction SilentlyContinue
        
        Write-Host "Maven $mavenVersion has been installed to $mavenDir" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to install Maven: $_"
        exit 1
    }
}
else {
    Write-Host "Maven $mavenVersion is already installed at $mavenDir" -ForegroundColor Green
}

# Set environment variables for current session
$env:M2_HOME = $mavenDir
$env:PATH = "$mavenDir\bin;$env:PATH"

# Verify Maven installation
Write-Host "`nVerifying Maven installation..." -ForegroundColor Cyan
try {
    $mvnVersion = & "$mavenDir\bin\mvn.cmd" -v 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Maven is working correctly:" -ForegroundColor Green
        $mvnVersion | ForEach-Object { Write-Host $_ }
    }
    else {
        Write-Error "Failed to run Maven. Exit code: $LASTEXITCODE"
    }
}
catch {
    Write-Error "Error running Maven: $_"
}

# Create or update Maven wrapper configuration
$mvnWrapperDir = "$PSScriptRoot\.mvn\wrapper"
if (-not (Test-Path $mvnWrapperDir)) {
    New-Item -ItemType Directory -Path $mvnWrapperDir -Force | Out-Null
}

# Create Maven wrapper properties
@"
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$mavenVersion/apache-maven-$mavenVersion-bin.zip
wrapperUrl=https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar
"@ | Out-File -FilePath "$mvnWrapperDir\maven-wrapper.properties" -Encoding ASCII

Write-Host "`nMaven wrapper has been configured." -ForegroundColor Green
Write-Host "You can now use 'mvnw' (or 'mvnw.cmd' on Windows) to run Maven commands." -ForegroundColor Green
