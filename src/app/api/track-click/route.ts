import { NextRequest, NextResponse } from 'next/server';
import { productFirestore } from '@/lib/firebase-admin';

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

    // Registrar clic en Firestore
    try {
      await productFirestore.incrementClick(productId);
      console.log(`Click registrado en Firestore: ${productId}`);
    } catch (trackError) {
      // No bloquear la redirección si falla el tracking
      console.error('Error registrando clic en Firestore:', trackError);
    }

    return NextResponse.json({
      success: true,
      redirectUrl: affiliateUrl || null,
      message: 'Click registrado correctamente',
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
