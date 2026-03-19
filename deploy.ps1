# deploy.ps1
$ErrorActionPreference = "Stop"

Write-Host "Starting Kaizen Copilot Build Process..." -ForegroundColor Cyan

Write-Host "Running npm run build..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Deployment aborted." -ForegroundColor Red
    exit 1
}

$distPath = "dist"
$zipPath = "deploy.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

if (Test-Path $distPath) {
    Write-Host "Compressing build output to $zipPath..."
    Compress-Archive -Path "$distPath\*" -DestinationPath $zipPath -Force
    Write-Host "Successfully created deployable archive: $zipPath!" -ForegroundColor Green
    Write-Host "Deployment preparation complete." -ForegroundColor Green
} else {
    Write-Host "Error: dist directory not found. Build may have failed silently." -ForegroundColor Red
    exit 1
}
