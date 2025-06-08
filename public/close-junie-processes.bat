@echo off
echo Closing Junie console processes...

:: Find and kill Angular development server processes
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Angular Live Development Server"
taskkill /F /IM ng.exe /FI "WINDOWTITLE eq Angular Live Development Server"

:: Find and kill any Node.js processes running on port 4200 (default Angular port)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200') do (
    taskkill /F /PID %%a
)

echo All Junie console processes have been closed.
pause
