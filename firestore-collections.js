// Ejemplos de estructura de colecciones Firestore

// ============================================
// COLLECTION: products
// ============================================
const productExample = {
  id: "producto_001",
  title: "Botas Mountain Pro X500",
  description: "Botas premium con tecnología Vibram para senderismo",
  price: 129.99,
  originalPrice: 179.99,
  affiliateLink: "https://amzn.to/xxx",
  image: "https://firebasestorage.googleapis.com/.../botas.jpg",
  images: [
    "https://firebasestorage.googleapis.com/.../botas-1.jpg",
    "https://firebasestorage.googleapis.com/.../botas-2.jpg"
  ],
  category: ["Calzado", "Montaña", "Aventura"],
  rating: 4.7,
  reviewCount: 128,
  clickCount: 456,
  affiliateProvider: "amazon",
  commission: 8.5,
  lastUpdated: "2024-01-15T10:30:00",
  seoKeywords: ["botas montaña", "senderismo", "vibram"],
  aiSummary: "Botas Mountain Pro con tecnología Vibram TECTONIC y Gore-Tex...",
  targetAudience: ["Sendero", "Aventurero"],
  features: ["Suela Vibram", "Impermeable", "Amortiguación EVA"],
  pros: ["Excelente amortiguación", "Impermeable"],
  cons: ["Un poco pesada"],
  faq: [
    { question: "¿Son impermeables?", answer: "Sí, con Gore-Tex" }
  ]
};

// ============================================
// COLLECTION: blogPosts
// ============================================
const blogPostExample = {
  id: "guia-zapatillas-running",
  title: "Las 10 Mejores Zapatillas para Running 2024",
  slug: "mejores-zapatillas-running-2024",
  excerpt: "Descubre las zapatillas definitivas para tus entrenamientos...",
  content: "# Introducción\n...\n## Conclusión\n...",
  author: "AI Assistant",
  publishedAt: "2024-01-10T08:00:00",
  updatedAt: "2024-01-12T10:00:00",
  tags: ["running", "zapatos", "guía", "calzado"],
  category: "Guías",
  seoTitle: "Mejores Zapatillas Running 2024 - Guía Definitiva",
  seoDescription: "Comparativa de las 10 mejores zapatillas de running 2024...",
  readTime: 8,
  featuredImage: "https://firebasestorage.googleapis.com/.../blog-image.jpg",
  status: "published",
  aiGenerated: true,
  relatedProducts: ["zapatillas-running-001", "zapatillas-running-002"]
};

// ============================================
// COLLECTION: categories
// ============================================
const categoryExample = {
  id: "ropa-masculina",
  name: "Ropa Masculina",
  slug: "ropa-masculina",
  description: "Ropa casual y formal para hombres",
  parent: null,
  products: ["producto_001", "producto_002"],
  seoKeywords: ["ropa hombre", "estilo casual", "moda masculina"],
  aiSummary: "Ropa masculina premium para uso diario y entretenimiento"
};

// ============================================
// COLLECTION: analytics
// ============================================
const analyticsExample = {
  id: "global",
  pageViews: 12500,
  affiliateClicks: 3420,
  conversions: 86,
  revenue: 3450.75,
  topProducts: [
    { productId: "botas-001", clicks: 456 },
    { productId: "zapatillas-001", clicks: 389 }
  ],
  seoPerformance: [
    { keyword: "zapatos running", impressions: 5200, clicks: 120 },
    { keyword: "botas montaña", impressions: 3100, clicks: 89 }
  ],
  lastUpdated: "2024-01-15T12:00:00"
};

// ============================================
// COLLECTION: newsletterSubscribers
// ============================================
const subscriberExample = {
  id: "sub_001",
  email: "usuario@email.com",
  name: "Juan Pérez",
  subscriptionDate: "2024-01-10T09:00:00",
  source: "homepage",
  preferences: ["ofertas", "blog", "productos-nuevos"],
  status: "active"
};

// ============================================
// CÓMO CARGAR ESTOS EJEMPLOS
// ============================================
// 1. Usa Firebase Console → Importar JSON
// 2. O usa Firebase CLI:
// firebase:import products --collection-path=products --data-path=./data/products.json
// 3. O usa Firebase Admin SDK en un script

module.exports = {
  productExample,
  blogPostExample,
  categoryExample,
  analyticsExample,
  subscriberExample
};