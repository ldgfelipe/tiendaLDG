@echo off
title Despliegue Firebase - TiendaLDG
echo ==========================================
echo 🔥 Desplegando a Firebase
echo ==========================================
echo.

echo 1. Limpiando caché...
call npm run clean

echo.
echo 2. Instalando dependencias...
call npm install

echo.
echo 3. Haciendo build...
call npm run build

if %errorlevel% neq 0 (
    echo Error en el build
    pause
    exit /b
)

echo.
echo 4. Desplegando a Firebase...
firebase deploy

echo.
echo ==========================================
echo ✅ ¡Despliegue completado!
echo ==========================================
pause