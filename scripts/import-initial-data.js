// Script para importar datos iniciales a Firestore
// Ejecutar con: node scripts/import-initial-data.js

const admin = require('firebase-admin');

// Inicializar Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tu-proyecto.firebaseio.com'
});

const db = admin.firestore();

// Productos iniciales (ropa y calzado)
const initialProducts = [
  {
    id: 'botas-mountain-pro',
    title: 'Botas Mountain Pro X500',
    description: 'Botas de montaña premium con tecnología Vibram TECTONIC y material impermeable Gore-Tex. Ideal para senderismo en condiciones extremas.',
    price: 129.99,
    originalPrice: 179.99,
    affiliateLink: 'https://amzn.to/botas-mountain-pro',
    image: '/images/products/botas-mountain.jpg',
    images: ['/images/products/botas-mountain-1.jpg', '/images/products/botas-mountain-2.jpg'],
    category: ['Calzado', 'Montaña', 'Aventura'],
    rating: 4.7,
    reviewCount: 128,
    clickCount: 456,
    affiliateProvider: 'amazon',
    commission: 8.5,
    seoKeywords: ['botas montaña', 'senderismo', 'vibram', 'aventura'],
    aiSummary: 'Botas Mountain Pro con tecnología Vibram TECTONIC y Gore-Tex impermeable. Perfectas para senderismo en condiciones extremas con amortiguación EVA dual.',
    targetAudience: ['Sendero', 'Aventurero', 'Amante de la naturaleza'],
    features: ['Suela Vibram TECTONIC', 'Material impermeable Gore-Tex', 'Amortiguación EVA dual'],
    pros: ['Excelente amortiguación', 'Impermeable', 'Duradera'],
    cons: ['Un poco pesada', 'Precio elevado']
  },
  {
    id: 'zapatillas-running-pro',
    title: 'Zapatillas Running Pro X100',
    description: 'Zapatillas de running ultraligeras con tecnología FluidFoam y soporte anatómico. Reducción de impacto hasta 35% en articulaciones.',
    price: 159.0,
    affiliateLink: 'https://amzn.to/zapatillas-running',
    image: '/images/products/zapatillas-running.jpg',
    images: ['/images/products/zapatillas-running-1.jpg'],
    category: ['Calzado', 'Running', 'Deporte'],
    rating: 4.8,
    reviewCount: 256,
    clickCount: 1234,
    affiliateProvider: 'amazon',
    commission: 7.5,
    seoKeywords: ['zapatillas running', 'correr', 'fluidfoam', 'deporte'],
    aiSummary: 'Diseñadas para corredores que buscan rendimiento y comodidad. Tecnología FluidFoam reduce impacto en articulaciones.',
    targetAudience: ['Corredor', 'Deportista', 'Entrenador'],
    features: ['Amortiguación FluidFoam', 'Peso ultraligero', 'Suela de goma'],
    pros: ['Muy cómodas', 'Excelente amortiguación', 'Ligeras'],
    cons: ['No para ortopedia', 'Desgaste rápido']
  },
  {
    id: 'jeans-clasicos',
    title: 'Jeans Clásicos Hombre Talla 32',
    description: 'Jeans clásicos de corte recto con tecnología Self-Heat. Tela premium con resistencia y comodidad óptima.',
    price: 79.9,
    originalPrice: 99.9,
    affiliateLink: 'https://amzn.to/jeans-clasicos',
    image: '/images/products/jeans-clasicos.jpg',
    category: ['Ropa', 'Hombre', 'Calzado'],
    rating: 4.6,
    reviewCount: 89,
    clickCount: 567,
    affiliateProvider: 'amazon',
    commission: 5.0,
    seoKeywords: ['jeans hombre', 'calza clásica', 'ropa casual'],
    aiSummary: 'Jeans icónicos con corte recto moderno y tecnología Self-Heat que mantiene la forma.',
    targetAudience: ['Hombre urbano', 'Profesional'],
    features: ['Corte recto moderno', 'Tecnología Self-Heat', 'Botones de metal'],
    pros: ['Falla cero', 'Se estira y recupera'],
    cons: ['Algunas tallas ajustadas']
  }
];

// Categorías
const initialCategories = [
  {
    id: 'ropa',
    name: 'Ropa',
    slug: 'ropa',
    description: 'Ropa casual, formal y deportiva de alta calidad',
    products: ['botas-mountain-pro', 'jeans-clasicos'],
    seoKeywords: ['ropa casual', 'moda', 'estilo']
  },
  {
    id: 'calzado',
    name: 'Calzado',
    slug: 'calzado',
    description: 'Zapatillas running, botas de montaña, zapatos casuales premium',
    products: ['botas-mountain-pro', 'zapatillas-running-pro'],
    seoKeywords: ['zapatos running', 'botas montaña', 'zapatillas deportivas']
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Relojes, bolsos, joyería y accesorios premium',
    products: [],
    seoKeywords: ['relojes', 'bolsos', 'joyería']
  }
];

// Blog posts iniciales
const initialBlogPosts = [
  {
    id: 'guia-botas-montana',
    title: 'Guía Definitiva: Botas de Montaña para Principiantes',
    slug: 'guia-botas-montana-principiantes',
    excerpt: 'Aprende a elegir las mejores botas de montaña con nuestra guía completa...',
    content: '# Introducción\n...\n## Conclusión\n...',
    author: 'Asistente IA',
    publishedAt: new Date(),
    tags: ['montaña', 'senderismo', 'guía'],
    category: 'Guías',
    seoTitle: 'Guía Definitiva Botas Montaña Principiantes',
    seoDescription: 'Aprende a elegir las mejores botas de montaña para senderismo',
    readTime: 7,
    featuredImage: '/images/blog/botas-montana.jpg',
    status: 'published',
    aiGenerated: true
  }
];

// Analytics inicial
const initialAnalytics = {
  pageViews: 0,
  affiliateClicks: 0,
  conversions: 0,
  revenue: 0,
  topProducts: [],
  seoPerformance: []
};

// Función para importar datos
async function importData() {
  console.log('🚀 Importando datos iniciales a Firestore...\n');
  
  try {
    // Importar productos
    console.log('📦 Importando productos...');
    for (const product of initialProducts) {
      await db.collection('products').doc(product.id).set({
        ...product,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ ${initialProducts.length} productos importados\n`);

    // Importar categorías
    console.log('🏷️ Importando categorías...');
    for (const category of initialCategories) {
      await db.collection('categories').doc(category.id).set(category);
    }
    console.log(`✅ ${initialCategories.length} categorías importadas\n`);

    // Importar posts de blog
    console.log('📝 Importando posts de blog...');
    for (const post of initialBlogPosts) {
      await db.collection('blogPosts').doc(post.id).set({
        ...post,
        publishedAt: post.publishedAt || admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ ${initialBlogPosts.length} posts importados\n`);

    // Importar analytics
    console.log('📊 Configurando analytics...');
    await db.collection('analytics').doc('global').set(initialAnalytics);
    console.log('✅ Analytics inicializado\n');

    console.log('✅ ¡Todos los datos importados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error importando datos:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Ejecutar importación
importData();