import { NextRequest, NextResponse } from 'next/server';

/**
 * Image Proxy Endpoint
 * Serves Firebase Storage images through our own server to avoid CORS issues
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
    
    // Construir URL de Firebase Storage
    const storageUrl = `https://firebasestorage.googleapis.com/v0/b/tiendaldg.appspot.com/o/${encodeURIComponent(filePath)}?alt=media`;
    
    console.log('[Image Proxy] Fetching:', storageUrl);
    
    // Hacer fetch al servidor de Firebase Storage desde nuestro backend
    const response = await fetch(storageUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
    });
    
    if (!response.ok) {
      console.error('[Image Proxy] Error fetching image:', response.status);
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Obtener el contenido como ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Determinar el content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Devolver la respuesta con los headers apropiados
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400, immutable',
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error('[Image Proxy] Error:', error.message);
    return new NextResponse(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const dynamic = 'force-static';
