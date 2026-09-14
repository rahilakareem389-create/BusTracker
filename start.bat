@echo off
echo Starting Bus Tracker Backend...
start cmd /k "cd backend && npm run dev"

echo Starting Bus Tracker Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting up! 
echo Frontend will be at http://localhost:5173
echo Backend will be at http://localhost:5000
