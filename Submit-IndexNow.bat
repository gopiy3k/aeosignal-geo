@echo off
REM Navigate to your script folder
cd /d "C:\Users\Gopinath\Desktop\aeosignal-geo"

REM Run the PowerShell script with execution policy bypass
powershell -NoProfile -ExecutionPolicy Bypass -File ".\Submit-IndexNow-Final-With-Namespace.ps1"

REM Pause so you can see the output
pause
