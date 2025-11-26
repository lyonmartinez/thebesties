#!/usr/bin/env powershell
# Push Website The Besties to GitHub

$ErrorActionPreference = "Stop"

$repoPath = "c:\Users\ADMID\Desktop\Website The Besties"
Set-Location $repoPath

# Check if .git exists
if (-not (Test-Path .\.git)) {
    Write-Host "📦 Initializing Git repository..."
    & git init
    & git config user.name "The Besties"
    & git config user.email "gang@thebesties.local"
    & git add .
    & git commit -m "Initial commit - The Besties Website"
    & git branch -M main
    & git remote add origin "https://github.com/lyonmartinez/thebesties.git"
}

Write-Host "🚀 Pushing to GitHub..."
& git push -u origin main

Write-Host "✅ Done! Your website is being deployed..."
Write-Host ""
Write-Host "📍 GitHub Repository: https://github.com/lyonmartinez/thebesties"
Write-Host "🌐 Website URL: https://lyonmartinez.github.io/thebesties"
Write-Host ""
Write-Host "⏳ GitHub Pages will be live in 1-2 minutes. Check the website URL above!"
