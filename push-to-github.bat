@echo off
chcp 65001 >nul
cd /d "c:\Users\ADMID\Desktop\Website The Besties"

echo Checking Git status...
git status

if errorlevel 1 (
    echo Initializing Git repository...
    git init
    git config user.name "The Besties"
    git config user.email "gang@thebesties.local"
    git add .
    git commit -m "Initial commit - The Besties Website"
    git branch -M main
    git remote add origin https://github.com/lyonmartinez/thebesties.git
)

echo Pushing to GitHub...
git push -u origin main

echo Done! Check: https://github.com/lyonmartinez/thebesties
pause
