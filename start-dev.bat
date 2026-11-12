@echo off
echo ==========================================
echo  🚀 Iniciando TiendaLDG en Modo Desarrollo
echo ==========================================
echo.

echo 📦 Instalando dependencias...
call npm install

if %errorlevel% neq 0 (
    echo Error al instalar dependencias
    pause
    exit /b
)

echo.
echo 🔍 Verificando archivos de configuración...
if not exist .env.local (
    echo ⚠️  Archivo .env.local no encontrado
    echo    Ejecuta: copy .env.example .env.local
    echo    y configura tus variables
    pause
    exit /b
)

echo.
echo ▶️  Iniciando servidor de desarrollo...
echo    URL: http://localhost:3000
echo    Presiona Ctrl+C para detener
echo.

call npm run dev