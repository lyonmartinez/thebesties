# Script để setup auto-start bot khi Windows khởi động
# Chạy script này với quyền Administrator

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Setup Auto-Start Bot cho Windows" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra quyền Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  Cần quyền Administrator để setup auto-start!" -ForegroundColor Yellow
    Write-Host "   Vui lòng chạy PowerShell với quyền Administrator" -ForegroundColor Yellow
    Write-Host "   Nhấn chuột phải vào PowerShell -> Run as Administrator" -ForegroundColor Yellow
    pause
    exit
}

# Lấy đường dẫn hiện tại
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$batPath = Join-Path $scriptPath "start-bot.bat"
$taskName = "TheBestiesBotAutoStart"

Write-Host "📁 Đường dẫn bot: $scriptPath" -ForegroundColor Cyan
Write-Host "📄 Script khởi động: $batPath" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra xem task đã tồn tại chưa
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "⚠️  Task '$taskName' đã tồn tại!" -ForegroundColor Yellow
    $response = Read-Host "Bạn có muốn xóa và tạo lại? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
        Write-Host "✅ Đã xóa task cũ" -ForegroundColor Green
    } else {
        Write-Host "❌ Hủy bỏ" -ForegroundColor Red
        pause
        exit
    }
}

# Tạo action để chạy batch file
$action = New-ScheduledTaskAction -Execute $batPath -WorkingDirectory $scriptPath

# Tạo trigger: chạy khi đăng nhập (khi user login)
$trigger = New-ScheduledTaskTrigger -AtLogOn

# Tạo settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable:$false

# Tạo principal (chạy với quyền user hiện tại)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

# Đăng ký task
try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Tự động khởi động The Besties Bot khi Windows khởi động" | Out-Null
    Write-Host "✅ Đã tạo task tự động khởi động thành công!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Thông tin task:" -ForegroundColor Cyan
    Write-Host "   - Tên: $taskName" -ForegroundColor Gray
    Write-Host "   - Trigger: Khi đăng nhập Windows" -ForegroundColor Gray
    Write-Host "   - Script: $batPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🧪 Test task ngay bây giờ? (y/n)" -ForegroundColor Yellow
    $testResponse = Read-Host
    if ($testResponse -eq 'y' -or $testResponse -eq 'Y') {
        Write-Host "🚀 Đang chạy task..." -ForegroundColor Green
        Start-ScheduledTask -TaskName $taskName
        Start-Sleep -Seconds 3
        Write-Host "✅ Task đã được kích hoạt!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Lỗi khi tạo task: $_" -ForegroundColor Red
    pause
    exit
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Hoàn tất!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Lưu ý:" -ForegroundColor Yellow
Write-Host "   - Bot sẽ tự động khởi động khi bạn đăng nhập vào Windows" -ForegroundColor Gray
Write-Host "   - Để xóa auto-start: Xóa task '$taskName' trong Task Scheduler" -ForegroundColor Gray
Write-Host "   - Hoặc chạy: Unregister-ScheduledTask -TaskName '$taskName'" -ForegroundColor Gray
Write-Host ""
pause

