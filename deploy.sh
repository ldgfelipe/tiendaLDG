#!/bin/bash

# Script de despliegue para TiendaLDG
# Ejecuta: bash deploy.sh

echo "🚀 Iniciando despliegue de TiendaLDG..."

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Generar archivo .env.local desde ejemplo
if [ ! -f .env.local ]; then
    echo "🔐 Creando archivo .env.local..."
    cp .env.example .env.local
    echo "⚠️  Por favor, configura tus variables de entorno en .env.local antes de continuar"
    read -p "Presiona Enter cuando estés listo..."
fi

# 3. Build de Next.js
echo "🏗️  Generando build..."
npm run build

# 4. Deploy a Firebase
echo "📤 Desplegando a Firebase..."
firebase deploy

echo "✅ ¡Despliegue completado!"
echo "🌐 Visita tu tienda en: $(cat .env.local | grep NEXT_PUBLIC_SITE_URL | cut -d= -f2)"