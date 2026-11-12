import { NextRequest, NextResponse } from 'next/server';

// Simulación de tracking (en producción conectarías a Firestore)
const clickTracking: Record<string, number> = {};

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

    // Registrar el clic (simulado)
    clickTracking[productId] = (clickTracking[productId] || 0) + 1;
    console.log(`Click registrado: ${productId} - Total: ${clickTracking[productId]}`);

    // Redirigir al enlace afiliado
    const redirectUrl = affiliateUrl || `https://tutienda.web.app/product/${productId}`;

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

  return NextResponse.json({ productId, clicks: clickTracking[productId] || 0 });
}