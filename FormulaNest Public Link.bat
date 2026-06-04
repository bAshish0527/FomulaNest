@echo off
cd /d C:\Users\Admin\Desktop\ashish
echo Starting FormulaNest public link tunnel...
cloudflared tunnel --url http://localhost:3000
pause
