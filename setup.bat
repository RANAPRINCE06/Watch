@echo off
echo ========================================
echo CHRONO Luxury Watch - Setup Script
echo ========================================
echo.

echo [1/5] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Server dependencies installation failed
    pause
    exit /b 1
)
echo.

echo [2/5] Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Client dependencies installation failed
    pause
    exit /b 1
)
echo.

echo [3/5] Checking MongoDB...
echo Make sure MongoDB is running on mongodb://localhost:27017
echo If not installed, download from: https://www.mongodb.com/try/download/community
echo.

echo [4/5] Seeding database (optional)...
cd ..\server
call npm run seed
echo.

echo [5/5] Setup complete!
echo.
echo ========================================
echo Next steps:
echo ========================================
echo 1. Start MongoDB (if not running)
echo 2. Run: start-dev.bat
echo.
echo Server will run on: http://localhost:5000
echo Client will run on: http://localhost:3000
echo.
pause
