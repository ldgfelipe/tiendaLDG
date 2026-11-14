// Script de diagnóstico de diseño
const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnóstico de diseño de TiendaLDG\n');

// Verificar archivos críticos
const files = [
  'src/app/globals.css',
  'src/app/layout.tsx',
  'src/components/HeroSection.tsx',
  'src/components/ProductCard.tsx',
  'src/components/StatsSection.tsx',
  'tailwind.config.js',
  '.env.example',
  'public/images/products'
];

console.log('📁 Verificando archivos:');
files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - FALTA`);
  }
});

// Verificar .next existe
const nextDir = path.join(__dirname, '..', '.next');
if (fs.existsSync(nextDir)) {
  console.log('\n📦 Build: ✅ .next existe');
} else {
  console.log('\n📦 Build: ❌ .next no existe - Ejecuta: npm run build');
}

// Verificar placeholders
const productsDir = path.join(__dirname, '..', 'public/images/products');
if (fs.existsSync(productsDir)) {
  const images = fs.readdirSync(productsDir).filter(f => f.endsWith('.svg'));
  console.log(`\n🖼️  Imágenes: ${images.length} placeholders creados`);
}

// Verificar tailwind
const tailwindPath = path.join(__dirname, '..', 'tailwind.config.js');
if (fs.existsSync(tailwindPath)) {
  const content = fs.readFileSync(tailwindPath, 'utf8');
  if (content.includes('tailwindcss')) {
    console.log('\n🎨 Tailwind: ✅ Configurado');
  } else {
    console.log('\n🎨 Tailwind: ❌ No configurado');
  }
}

console.log('\n📋 Comandos útiles:');
console.log('  npm run dev   - Iniciar servidor de desarrollo');
console.log('  npm run build - Crear build de producción');
console.log('  node scripts/create-placeholders.js - Crear imágenes placeholder');
console.log('\n🌐 Accede a: http://localhost:3000');