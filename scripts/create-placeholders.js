// Script para crear placeholders de imagen
// Ejecuta: node scripts/create-placeholders.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGE_DIR = path.join(__dirname, '../public/images');
const PRODUCTS_DIR = path.join(IMAGE_DIR, 'products');
const BLOG_DIR = path.join(IMAGE_DIR, 'blog');

// Crear directorios si no existen
if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
if (!fs.existsSync(PRODUCTS_DIR)) fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

// URLs de placeholders gratuitos
const PLACEHOLDERS = {
  products: [
    { id: 'botas-mountain', text: 'Botas de Montaña Premium', bg: '6312ff', color: 'ffffff' },
    { id: 'zapatillas-running', text: 'Zapatillas Running Pro', bg: '06b698', color: 'ffffff' },
    { id: 'jeans-clasicos', text: 'Jeans Clásicos Hombre', bg: 'ff6b6b', color: 'ffffff' },
  ],
  blog: [
    { id: 'blog-default', text: 'Artículo del Blog', bg: '8b5cf6', color: 'ffffff' }
  ],
  general: [
    { id: 'og-image', text: 'TiendaLDG - Referidos Premium', bg: '6312ff', color: 'ffffff', size: '1200x630' },
    { id: 'favicon', text: 'LDG', bg: '6312ff', color: 'ffffff', size: '64x64' }
  ]
};

// Función para descargar imagen
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// Crear placeholder SVG
function createSVGPlaceholder(text, bg, color, width = 400, height = 300) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none">
    <rect width="${width}" height="${height}" fill="#${bg}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
          font-family="Inter, sans-serif" font-size="20" fill="#${color}">${text}</text>
  </svg>`;
}

// Generar placeholders
async function generatePlaceholders() {
  console.log('🎨 Generando placeholders de imagen...\n');

  // Productos
  console.log('📦 Generando imágenes de productos...');
  for (const item of PLACEHOLDERS.products) {
    const svg = createSVGPlaceholder(item.text, item.bg, item.color);
    fs.writeFileSync(path.join(PRODUCTS_DIR, `${item.id}.svg`), svg);
    console.log(`  ✅ ${item.id}.svg`);
  }

  // Blog
  console.log('\n📝 Generando imágenes de blog...');
  for (const item of PLACEHOLDERS.blog) {
    const svg = createSVGPlaceholder(item.text, item.bg, item.color);
    fs.writeFileSync(path.join(BLOG_DIR, `${item.id}.svg`), svg);
    console.log(`  ✅ ${item.id}.svg`);
  }

  // Generales
  console.log('\n🔖 Generando imágenes generales...');
  for (const item of PLACEHOLDERS.general) {
    const [width, height] = item.size ? item.size.split('x').map(Number) : [400, 300];
    const svg = createSVGPlaceholder(item.text, item.bg, item.color, width, height);
    fs.writeFileSync(path.join(IMAGE_DIR, `${item.id}.svg`), svg);
    console.log(`  ✅ ${item.id}.svg (${item.size})`);
  }

  console.log('\n✅ ¡Todos los placeholders creados!');
  console.log(`📁 Imágenes en: ${IMAGE_DIR}`);
}

generatePlaceholders().catch(console.error);