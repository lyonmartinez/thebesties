# The Besties Backend Startup Script

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "The Besties Gang - Backend Starter" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = "$(Split-Path -Parent $PSScriptRoot)\backend"

# Check if node_modules exists
if (-not (Test-Path "$backendPath\node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    Push-Location $backendPath
    npm install
    Pop-Location
    Write-Host "✅ Dependencies installed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting backend server..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 API Server: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 Dashboard Login: http://localhost:5000/dashboard/login.html" -ForegroundColor Cyan
Write-Host "📍 Website: http://localhost:5000/index.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test logins:" -ForegroundColor Yellow
Write-Host "  - Username: leader (Role: Leader)" -ForegroundColor Gray
Write-Host "  - Username: member1 (Role: Member)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Push-Location $backendPath
npm start
