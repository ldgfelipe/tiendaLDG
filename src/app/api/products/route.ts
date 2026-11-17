import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// Productos de ejemplo para desarrollo
const products: Product[] = [
  {
    id: '1',
    title: 'Zapato deportivo premium',
    description: 'Zapato deportivo de alta calidad con tecnología de amortiguación avanzada',
    price: 89.99,
    originalPrice: 120,
    category: ['Calzado'],
    affiliateLink: 'https://example.com/affiliate1',
    image: '/placeholder-product.jpg',
    images: ['/placeholder-product.jpg'],
    rating: 4.7,
    reviewCount: 128,
    clickCount: 45,
    affiliateProvider: 'Amazon',
    commission: 8,
    lastUpdated: new Date(),
    seoKeywords: ['zapatos', 'deportivos', 'premium'],
    aiSummary: 'Excelente calzado deportivo con buenas reseñas.'
  },
  {
    id: '2',
    title: 'Camisa de fotosynthesis',
    description: 'Camisa elegante para el día a día',
    price: 45.99,
    category: ['Ropa'],
    affiliateLink: 'https://example.com/affiliate2',
    image: '/placeholder-product.jpg',
    images: ['/placeholder-product.jpg'],
    rating: 4.5,
    reviewCount: 89,
    clickCount: 32,
    affiliateProvider: 'ShareASale',
    commission: 5,
    lastUpdated: new Date(),
    seoKeywords: ['camisa', 'elegante', 'diario'],
    aiSummary: 'Camisa versátil y cómoda para uso diario.'
  }
];

export async function GET(request: NextRequest) {
  try {
    // En producción, aquí cargarías desde Firestore
    // Por ahora devolvemos datos de ejemplo
    return NextResponse.json({
      products,
      success: true
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      products: [],
      success: false,
      error: 'Error al cargar productos'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProduct: Product = {
      id: Date.now().toString(),
      title: body.title || '',
      description: body.description || '',
      price: body.price || 0,
      image: body.image || '/placeholder-product.jpg',
      images: body.images || ['/placeholder-product.jpg'],
      category: body.category || [],
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      affiliateLink: body.affiliateLink || '',
      affiliateProvider: body.affiliateProvider || 'Other',
      commission: body.commission || 0,
      lastUpdated: new Date(),
      seoKeywords: body.seoKeywords || [],
      aiSummary: body.aiSummary || body.description,
    };
    
    // En producción, guardarías en Firestore
    // products.push(newProduct);
    
    return NextResponse.json({
      product: newProduct,
      success: true
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al crear producto'
    }, { status: 500 });
  }
}