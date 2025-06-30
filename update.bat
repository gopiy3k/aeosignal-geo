@echo off
cd /d "%~dp0"
echo.
echo ▶ Staging changes...
git add .

echo.
set /p commitMsg=▶ Enter commit message: 
git commit -m "%commitMsg%"

echo.
echo ▶ Pushing to GitHub...
git push

echo.
echo ✅ Done! Netlify will auto-deploy shortly.
pause
