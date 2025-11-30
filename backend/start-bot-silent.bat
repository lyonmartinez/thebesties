@echo off
cd /d "%~dp0"
call pm2 resurrect >nul 2>&1
timeout /t 2 /nobreak >nul

