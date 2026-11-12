import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/services/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, affiliateUrl } = body;

    // Validar datos
    if (!productId) {
      return NextResponse.json(
        { error: 'productId es requerido' },
        { status: 400 }
      );
    }

    // Registrar el clic
    const firestoreService = new FirestoreService();
    await firestoreService.trackAffiliateClick(productId);

    // Redirigir al enlace afiliado
    const redirectUrl = affiliateUrl || `/api/redirect/${productId}`;
    
    return NextResponse.json({
      success: true,
      redirectUrl,
      message: 'Click registrado correctamente'
    });

  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json(
      { error: 'productId es requerido' },
      { status: 400 }
    );
  }

  return NextResponse.json({ productId });
}