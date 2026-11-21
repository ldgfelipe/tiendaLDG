import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// Productos - sin datos de ejemplo (vacío hasta que el usuario agregue)
const products: Product[] = [];

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