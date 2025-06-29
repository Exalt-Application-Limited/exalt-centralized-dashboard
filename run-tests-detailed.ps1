# Run tests with detailed output and error handling
$ErrorActionPreference = "Stop"

Write-Host "Running tests with detailed output..." -ForegroundColor Cyan
Write-Host "-----------------------------------"

# Check if Java is available
try {
    $javaVersion = java -version 2>&1
    Write-Host "Java version:" -ForegroundColor Green
    $javaVersion | ForEach-Object { Write-Host "  $_" }
} catch {
    Write-Error "Java is not installed or not in PATH"
    exit 1
}

# Run Maven with detailed output
Write-Host "`nRunning Maven clean test..." -ForegroundColor Cyan
Write-Host "--------------------------"

try {
    # Run Maven with batch mode disabled to see detailed output
    & mvn.cmd clean test --no-transfer-progress -Dmaven.test.failure.ignore=false -Dmaven.test.error.ignore=false
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ Tests failed with exit code $LASTEXITCODE" -ForegroundColor Red
        
        # Check for test reports
        $testReport = "$PWD\target\surefire-reports"
        if (Test-Path $testReport) {
            Write-Host "`nTest reports are available in: $testReport" -ForegroundColor Yellow
            
            # Find and display failing tests
            $failedTests = Get-ChildItem -Path $testReport -Filter "TEST-*.xml" | 
                Get-Content -Raw | 
                Select-String -Pattern '<testcase[^>]*?name="([^"]+)"[^>]*?>(?:[^<]|<[^/]|</(?!testcase>))*?<failure' | 
                ForEach-Object { $_.Matches.Groups[1].Value }
                
            if ($failedTests) {
                Write-Host "`nFailing tests:" -ForegroundColor Red
                $failedTests | ForEach-Object { Write-Host "  - $_" }
            }
        }
        
        exit $LASTEXITCODE
    }
    
    Write-Host "`n✅ All tests passed successfully!" -ForegroundColor Green
    
} catch {
    Write-Error "Error running tests: $_"
    exit 1
}
