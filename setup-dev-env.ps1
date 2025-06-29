# Setup Development Environment Script
# This script sets up a cloud development environment with all necessary dependencies

$ErrorActionPreference = "Stop"

Write-Host "Setting up development environment..." -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "Please run this script as Administrator"
    exit 1
}

# Install Chocolatey package manager if not installed
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Chocolatey package manager..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    
    # Refresh PATH to include Chocolatey
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

# Install JDK 17
Write-Host "Installing JDK 17..."
choco install -y --no-progress openjdk17

# Install Maven
Write-Host "Installing Maven..."
choco install -y --no-progress maven

# Install Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Git..."
    choco install -y --no-progress git
}

# Install VS Code (optional)
$installVSCode = Read-Host "Do you want to install VS Code? (y/n)"
if ($installVSCode -eq 'y') {
    Write-Host "Installing VS Code..."
    choco install -y --no-progress vscode
}

# Install IntelliJ IDEA Community Edition (optional)
$installIdea = Read-Host "Do you want to install IntelliJ IDEA Community Edition? (y/n)"
if ($installIdea -eq 'y') {
    Write-Host "Installing IntelliJ IDEA..."
    choco install -y --no-progress intellijidea-community
}

# Install Docker (for containerized development)
$installDocker = Read-Host "Do you want to install Docker for containerized development? (y/n)"
if ($installDocker -eq 'y') {
    Write-Host "Installing Docker..."
    choco install -y --no-progress docker-desktop
}

# Install Azure CLI (for cloud deployments)
$installAzureCli = Read-Host "Do you want to install Azure CLI? (y/n)"
if ($installAzureCli -eq 'y') {
    Write-Host "Installing Azure CLI..."
    choco install -y --no-progress azure-cli
}

# Install AWS CLI (for AWS deployments)
$installAwsCli = Read-Host "Do you want to install AWS CLI? (y/n)"
if ($installAwsCli -eq 'y') {
    Write-Host "Installing AWS CLI..."
    choco install -y --no-progress awscli
}

# Install kubectl (for Kubernetes)
Write-Host "Installing kubectl..."
choco install -y --no-progress kubernetes-cli

# Install Helm (for Kubernetes package management)
Write-Host "Installing Helm..."
choco install -y --no-progress kubernetes-helm

# Install Terraform (for infrastructure as code)
$installTerraform = Read-Host "Do you want to install Terraform? (y/n)"
if ($installTerraform -eq 'y') {
    Write-Host "Installing Terraform..."
    choco install -y --no-progress terraform
}

# Verify installations
Write-Host "`nVerifying installations..." -ForegroundColor Cyan

$tools = @{
    "Java" = "java -version";
    "Maven" = "mvn -version";
    "Git" = "git --version";
    "kubectl" = "kubectl version --client";
    "Helm" = "helm version"
}

foreach ($tool in $tools.GetEnumerator()) {
    try {
        Write-Host "Checking $($tool.Key)..." -NoNewline
        Invoke-Expression $tool.Value 2>&1 | Out-Null
        Write-Host " ✓" -ForegroundColor Green
    } catch {
        Write-Host " ✗ Not found" -ForegroundColor Red
    }
}

Write-Host "`nDevelopment environment setup complete!" -ForegroundColor Green
