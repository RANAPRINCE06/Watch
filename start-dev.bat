@echo off
echo ========================================
echo Starting CHRONO Luxury Watch Platform
echo ========================================
echo.
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

start "CHRONO Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak > nul
start "CHRONO Client" cmd /k "cd client && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
pause
