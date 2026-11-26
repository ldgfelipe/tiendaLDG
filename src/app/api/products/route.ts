import { NextRequest, NextResponse } from 'next/server';
import { productFirestore } from '@/lib/firebase-admin';
import { Product } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const products = await productFirestore.getAll();
    return NextResponse.json({
      products,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      products: [],
      success: false,
      error: 'Error al cargar productos',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProduct: Product = {
      id: body.id || Date.now().toString(),
      title: body.title || '',
      description: body.description || '',
      price: body.price || 0,
      originalPrice: body.originalPrice || null,
      affiliateLink: body.affiliateLink || '',
      image: body.image || '/placeholder-product.jpg',
      images: body.images || ['/placeholder-product.jpg'],
      category: body.category || [],
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      clickCount: body.clickCount || 0,
      affiliateProvider: body.affiliateProvider || 'Other',
      commission: body.commission || 0,
      lastUpdated: new Date(),
      seoKeywords: body.seoKeywords || [],
      aiSummary: body.aiSummary || body.description,
      targetAudience: body.targetAudience || [],
      features: body.features || [],
      pros: body.pros || [],
      cons: body.cons || [],
      faq: body.faq || [],
    };

    const savedProduct = await productFirestore.create(newProduct);

    return NextResponse.json({
      product: savedProduct,
      success: true,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al crear producto: ' + (error as Error).message,
    }, { status: 500 });
  }
}