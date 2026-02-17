# PowerShell script to run add-in silently
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Starting webpack dev server (hidden)..." -ForegroundColor Green

# Start webpack dev server in background with hidden window
$webpackProcess = Start-Process -FilePath "npx" -ArgumentList "webpack","serve","--mode","development" -WindowStyle Hidden -PassThru

# Wait for server to start
Write-Host "Waiting 8 seconds for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Sideload add-in - Word will open visibly (we want to see Word!)
# Auto-answer "Yes" to the loopback question
Write-Host "Sideloading add-in into Word (auto-answering Yes)..." -ForegroundColor Green
"Yes" | npx office-addin-debugging start manifest.xml desktop

Write-Host "Done! Word should open now." -ForegroundColor Green
Write-Host "The webpack server is running in the background." -ForegroundColor Cyan
Write-Host "Press any key to close this window (server will keep running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
