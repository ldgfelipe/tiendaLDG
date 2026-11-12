// Productos de ejemplo para desarrollo
import { Product } from '@/types';

export const sampleProducts: Product[] = [
  {
    id: 'botas-mountain-pro',
    title: 'Botas Mountain Pro X500',
    description: 'Botas de montaña premium con tecnología de amortiguación Vibram y materiales impermeables. Ideal para senderismo y aventura.',
    price: 129.99,
    originalPrice: 179.99,
    affiliateLink: 'https://amzn.to/sample-affiliate-link',
    image: '/images/products/botas-mountain.jpg',
    images: [
      '/images/products/botas-mountain-1.jpg',
      '/images/products/botas-mountain-2.jpg',
      '/images/products/botas-mountain-3.jpg'
    ],
    category: ['Calzado', 'Montaña', 'Aventura'],
    rating: 4.7,
    reviewCount: 128,
    affiliateProvider: 'amazon',
    commission: 8.5,
    lastUpdated: new Date('2024-01-15'),
    seoKeywords: ['botas montaña', 'senderismo', 'calzado aventura', 'vibram'],
    aiSummary: 'Estas botas Mountain Pro ofrecen la combinación perfecta de confort, durabilidad y estilo para tus aventuras al aire libre. Con tecnología Vibram y material impermeable, son ideales para senderismo en cualquier condición.',
    targetAudience: ['Sendero', 'Aventurero', 'Amante de la naturaleza'],
    features: [
      'Suela Vibram TECTONIC',
      'Material impermeable Gore-Tex',
      'Amortiguación EVA dual',
      'Calzado estilo regular',
      'Resistencia a cortes'
    ],
    pros: [
      'Excelente amortiguación',
      'Impermeable',
      'Duradera',
      'Cómoda para largas caminatas'
    ],
    cons: [
      'Un poco pesada',
      'Precio elevado'
    ],
    faq: [
      {
        question: '¿Para qué tipo de senderismo son ideales estas botas?',
        answer: 'Perfectas para senderismo en terrenos variados, desde bosques hasta montañas.'
      },
      {
        question: '¿Son impermeables?',
        answer: 'Sí, tienen tecnología Gore-Tex que protege del agua.'
      }
    ],
    clickCount: 1250
  },
  {
    id: 'zapatillas-running-pro',
    title: 'Zapatillas Running Pro X100',
    description: 'Zapatillas de running Ultraligeras con tecnología de amortiguación FluidFoam y soporte anatómico. Reducción de impacto hasta 35%.',
    price: 159.0,
    affiliateLink: 'https://amzn.to/sample-running-link',
    image: '/images/products/zapatillas-running.jpg',
    images: [
      '/images/products/zapatillas-running-1.jpg',
      '/images/products/zapatillas-running-2.jpg'
    ],
    category: ['Calzado', 'Running', 'Deporte'],
    rating: 4.8,
    reviewCount: 256,
    affiliateProvider: 'amazon',
    commission: 7.5,
    lastUpdated: new Date('2024-01-14'),
    seoKeywords: ['zapatillas running', 'correr', 'deporte', 'fluidfoam'],
    aiSummary: 'Diseñadas para corredores que buscan rendimiento y comodidad. La tecnología FluidFoam reduce el impacto en las articulaciones, mientras que su diseño ultraligero permite mayor velocidad.',
    targetAudience: ['Corredor', 'Deportista', 'Entrenador'],
    features: [
      'Amortiguación FluidFoam',
      'Peso ultraligero',
      'Suela de goma resistente',
      'Soporte anatómico',
      'Tecnología de respirabilidad'
    ],
    pros: [
      'Muy cómodas',
      'Excelente amortiguación',
      'Ligeras',
      'Buena tracción'
    ],
    cons: [
      'No para ortopedia',
      'Desgaste rápido'
    ],
    faq: [
      {
        question: '¿Para qué tipo de carreras son adecuadas?',
        answer: 'Ideales para maratones, medias maratones y entrenamientos de fondo.'
      }
    ],
    clickCount: 3420
  },
  {
    id: 'jeans-clásicos',
    title: 'Jeans Clásicos Hombre 28W',
    description: 'Jeans clásicos de corte recto con tecnología de self-healing. Tela premium con resistencia y comodidad óptimas.',
    price: 79.9,
    originalPrice: 99.9,
    affiliateLink: 'https://amzn.to/sample-jeans-link',
    image: '/images/products/jeans-clasicos.jpg',
    images: ['/images/products/jeans-clasicos.jpg'],
    category: ['Ropa', 'Hombre', 'Calzado'],
    rating: 4.6,
    reviewCount: 89,
    affiliateProvider: 'amazon',
    commission: 5.0,
    lastUpdated: new Date('2024-01-13'),
    seoKeywords: ['jeans hombre', 'calza clásica', 'ropa casual', 'corte recto'],
    aiSummary: 'Jeans icónicos con corte recto moderno. La tecnología Self-Heat garantiza que se mantengan en forma sin perder su forma. La tela premium ofrece cómodo ajuste durante todo el día.',
    targetAudience: ['Hombre urbano', 'Estilista', 'Profesional'],
    features: [
      'Corte recto moderno',
      'Tecnología Self-Heat',
      'Botones de metal premium',
      'Cremallera resistente',
      'Doble reinforcement'
    ],
    pros: [
      'Falla cero',
      'Se estira y recupera',
      'Estilo clásico',
      'Buena calidad'
    ],
    cons: [
      'Algunos tallas muy ajustadas',
      'Color azul oscuro'
    ],
    clickCount: 1875
  }
];

// Nichos principales de la tienda
export const categories = [
  {
    id: 'ropa',
    name: 'Ropa',
    slug: 'ropa',
    description: 'Ropa casual, formal y deportiva de alta calidad',
    seoKeywords: ['ropa casual', 'vestir elegante', 'moda sostenible']
  },
  {
    id: 'calzado',
    name: 'Calzado',
    slug: 'calzado',
    description: 'Zapatillas running, botas de montaña, zapatos casuales',
    seoKeywords: ['zapatillas running', 'botas montaña', 'zapatos hombre', 'zapatos mujer']
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Relojes, bolsos, joyería y accesorios premium',
    seoKeywords: ['relojes', 'bolsos', 'joyería', 'accesorios']
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    slug: 'tecnologia',
    description: 'Electrónicos y gadgets afilados',
    seoKeywords: ['smartphone', 'auriculares', 'tech', 'gadgets']
  }
];

// Keywords principales para SEO
export const mainKeywords = [
  'ropa y calzado',
  'productos premium',
  'afiliados confiables',
  'ofertas verdaderas',
  'recomendaciones IA',
  'calidad garantizada'
];