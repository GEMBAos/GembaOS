# Start Vite Dev Server and Cloudflare Tunnel simultaneously

Write-Host "Starting Kaizen Copilot Server and Cloudflare Tunnel..." -ForegroundColor Green

# 1. Start the Vite dev server in the background using cmd.exe
$ViteProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm", "run", "dev" -PassThru -NoNewWindow
Start-Sleep -Seconds 3 # Give Vite a moment to start

Write-Host "`nWaiting for local server to spin up on port 5173...`n" -ForegroundColor Yellow

# 2. Start Cloudflare tunnel using node
$TunnelProcess = Start-Process -FilePath "node" -ArgumentList "start-tunnel.js" -PassThru -NoNewWindow

Write-Host "Connecting to Cloudflare..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

if (Test-Path ".tunnel.json") {
    $TunnelData = Get-Content ".tunnel.json" | ConvertFrom-Json
    if ($TunnelData.success) {
        Write-Host "===========================================================" -ForegroundColor Cyan
        Write-Host "🌐 YOUR PUBLIC MOBILE URL IS:" -ForegroundColor Cyan
        Write-Host $TunnelData.url -ForegroundColor Green
        Write-Host "===========================================================" -ForegroundColor Cyan
    } else {
        Write-Host "Failed to start tunnel: $($TunnelData.error)" -ForegroundColor Red
    }
} else {
    Write-Host "Failed to retrieve tunnel URL. Check if start-tunnel.js is working." -ForegroundColor Red
}

Write-Host "Press [Enter] to shut down the servers..." -ForegroundColor Yellow
Read-Host

# Clean up
Stop-Process -Id $ViteProcess.Id -Force
Stop-Process -Id $TunnelProcess.Id -Force
if (Test-Path ".tunnel.json") { Remove-Item ".tunnel.json" -Force }
Write-Host "Servers shutting down." -ForegroundColor Red
