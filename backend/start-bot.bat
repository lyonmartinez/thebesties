@echo off
cd /d "%~dp0"
echo =====================================
echo Starting The Besties Bot with PM2...
echo =====================================
echo.
call pm2 resurrect
timeout /t 2 /nobreak >nul
call pm2 status
echo.
echo =====================================
echo Bot started! Use 'pm2 status' to check status.
echo =====================================
pause

