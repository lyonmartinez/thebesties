#!/bin/bash
# or run in PowerShell: .\START_BACKEND.ps1

echo "======================================"
echo "The Besties Gang - Backend Starter"
echo "======================================"
echo ""

BACKEND_PATH="$(dirname "$0")/backend"

if [ ! -d "$BACKEND_PATH/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd "$BACKEND_PATH"
    npm install
    cd - > /dev/null
    echo "✅ Dependencies installed!"
    echo ""
fi

echo "🚀 Starting backend server..."
echo ""
echo "📍 API Server: http://localhost:5000"
echo "📍 Dashboard Login: http://localhost:5000/dashboard/login.html"
echo "📍 Website: http://localhost:5000/index.html"
echo ""
echo "Test logins:"
echo "  - Username: leader (Role: Leader)"
echo "  - Username: member1 (Role: Member)"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$BACKEND_PATH"
npm start
