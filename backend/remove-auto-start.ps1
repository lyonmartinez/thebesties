# Script để xóa auto-start bot

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Xóa Auto-Start Bot" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$taskName = "TheBestiesBotAutoStart"

# Kiểm tra xem task có tồn tại không
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if (-not $existingTask) {
    Write-Host "ℹ️  Task '$taskName' không tồn tại" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "⚠️  Bạn có chắc muốn xóa task '$taskName'? (y/n)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq 'y' -or $response -eq 'Y') {
    try {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
        Write-Host "✅ Đã xóa task tự động khởi động thành công!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Lỗi khi xóa task: $_" -ForegroundColor Red
        Write-Host "   Vui lòng chạy PowerShell với quyền Administrator" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Hủy bỏ" -ForegroundColor Red
}

Write-Host ""
pause

