# PowerShell script for Windows installation

# Set strict error handling
$ErrorActionPreference = "Stop"

# Plugin path
$VST3_PLUGIN = "Rythm_Daw.vst3"

# Installation directory
$VST3_DIR = "${env:ProgramFiles}\Common Files\VST3"

# Check if we need admin privileges
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "This script requires administrator privileges. Please run as administrator."
    exit 1
}

# Create directory with admin privileges
if (-not (Test-Path $VST3_DIR)) {
    Write-Host "Creating VST3 directory..."
    New-Item -ItemType Directory -Path $VST3_DIR -Force
}

# Copy plugin
if (Test-Path $VST3_PLUGIN) {
    Write-Host "Installing VST3 plugin..."
    Copy-Item -Path $VST3_PLUGIN -Destination $VST3_DIR -Recurse -Force
    Write-Host "VST3 plugin installed to $VST3_DIR"
} else {
    Write-Host "Error: Plugin file not found"
    exit 1
}

# Validate installation
$installedPath = Join-Path $VST3_DIR $VST3_PLUGIN
if (-not (Test-Path $installedPath)) {
    Write-Host "Error: Failed to install plugin"
    exit 1
}

# Run plugin validation
Write-Host "Validating plugin..."
if (-not (Test-Path "plugin-val.exe")) {
    Write-Host "Error: plugin-val not found"
    exit 1
}

& "plugin-val.exe" $installedPath --headless
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Plugin validation failed"
    exit 1
}

Write-Host "Installation and validation successful!"
