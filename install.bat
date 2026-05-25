@echo off
title Wood Decor - Installation
color 0A
chcp 65001 >nul

echo.
echo  ╔══════════════════════════════════════╗
echo  ║     Wood Decor - جاري التثبيت       ║
echo  ╚══════════════════════════════════════╝
echo.

:: تأكد إن Docker موجود
docker --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo  [!] Docker مش موجود على الجهاز!
    echo  [!] بيفتح صفحة تحميل Docker...
    echo.
    echo  بعد ما تحمّل Docker Desktop:
    echo  1. افتحه وخليه يشتغل
    echo  2. ارجع وشغّل الملف ده تاني
    echo.
    start https://www.docker.com/products/docker-desktop/
    pause
    exit
)

echo  [✓] Docker موجود
echo.

:: تأكد إن Docker شغال
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo  [!] Docker موجود بس مش شغال!
    echo  [!] افتح Docker Desktop الأول وخليه يشتغل كامل
    echo  [!] بعدين شغّل الملف ده تاني
    echo.
    pause
    exit
)

echo  [✓] Docker شغال
echo.

:: ابني وشغّل كل حاجة
echo  [→] جاري بناء وتشغيل التطبيق...
echo  [!] أول مرة ممكن تاخد 5-10 دقايق - انتظر...
echo.
docker compose up -d --build

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [✗] في مشكلة أثناء التشغيل!
    echo  شغّل الأمر ده في CMD عشان تشوف المشكلة:
    echo  docker compose logs
    echo.
    pause
    exit
)

echo.
echo  [✓] كل حاجة اشتغلت!
echo.
echo  ╔══════════════════════════════════════╗
echo  ║   افتح المتصفح على:                 ║
echo  ║   http://localhost:3000              ║
echo  ╚══════════════════════════════════════╝
echo.

:: افتح المتصفح تلقائياً
timeout /t 3 /nobreak >nul
start http://localhost:3000

pause
