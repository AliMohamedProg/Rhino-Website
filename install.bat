@echo off
title Rhino Store - Installation
color 0A
chcp 65001 >nul

echo.
echo  ╔══════════════════════════════════════╗
echo  ║     Rhino Store - installing       ║
echo  ╚══════════════════════════════════════╝
echo.

:: تأكد إن Docker موجود
docker --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo  [!] Docker is not on this machine!
    echo  [!] opening Docker page...
    echo.
    echo  After downloading Docker Desktop:
    echo  1. Open it and let it work
    echo  2. Run this file again
    echo.
    start https://www.docker.com/products/docker-desktop/
    pause
    exit
)

echo  [✓] Docker is here
echo.

:: تأكد إن Docker شغال
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo  [!] Docker is working but not here!
    echo  [!] Open Docker Desktop first and let it work
    echo  [!] Then run this file again
    echo.
    pause
    exit
)

echo  [✓] Docker is working
echo.

:: ابني وشغّل كل حاجة
echo  [→] Building and running the application...
echo  [!] First time may take 5-10 minutes - wait...
echo.
docker compose up -d --build

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [✗] Error while running!
    echo  Run this command in CMD to see the error:
    echo  docker compose logs
    echo.
    pause
    exit
)

echo.
echo  [✓] Everything is working!
echo.
echo  ╔══════════════════════════════════════╗
echo  ║   Open the browser at:                 ║
echo  ║   http://localhost:3001                ║
echo  ╚══════════════════════════════════════╝
echo.

:: Open the browser automatically
timeout /t 3 /nobreak >nul
start http://localhost:3001

pause
