import { NextRequest, NextResponse } from 'next/server';

// Proxy para servir imágenes de Firebase Storage sin problemas de CORS
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
    const storageUrl = `https://firebasestorage.googleapis.com/v0/b/tiendaldg.appspot.com/o/${encodeURIComponent(filePath)}?alt=media`;
    
    // Si es una URL completa, úsala directamente
    if (filePath.startsWith('http')) {
      return NextResponse.redirect(storageUrl, 307);
    }
    
    // Hacer fetch a Firebase Storage
    const response = await fetch(storageUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    });
    
    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Devolver la imagen con headers apropiados
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error in image proxy:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
