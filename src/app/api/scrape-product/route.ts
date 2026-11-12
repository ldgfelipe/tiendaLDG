import { NextRequest, NextResponse } from 'next/server';
import { AffiliateService } from '@/services/affiliate-service';
import { AIService } from '@/services/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, provider } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      );
    }

    const affiliateService = new AffiliateService();
    const aiService = new AIService();
    
    // Detectar proveedor si no se proporciona
    const detectedProvider = provider || affiliateService.detectProvider(url);

    // Extraer información del producto
    let productInfo = await affiliateService.extractProductInfo(url);

    // Si no hay información, usar fallback de IA
    if (!productInfo) {
      productInfo = await aiService.analyzeProduct(url, 'general');
    }

    // Generar optimizaciones SEO con IA
    const seoTitle = await aiService.generateSEOTitle(productInfo?.title || '', detectedProvider);
    const seoDescription = await aiService.generateSEODescription(
      productInfo?.title || '', 
      detectedProvider, 
      productInfo
    );

    // Generar keywords
    const keywords = await aiService.generateKeywords(
      productInfo?.title || 'producto',
      detectedProvider,
      10
    );

    // Construir respuesta
    const response = {
      product: {
        ...productInfo,
        seoKeywords: [...(productInfo?.seoKeywords || []), ...keywords],
        seoTitle,
        seoDescription,
      },
      metadata: {
        provider: detectedProvider,
        extractedAt: new Date().toISOString(),
        confidence: productInfo?.confidence || 0.9
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error scraping product:', error);
    return NextResponse.json(
      { 
        error: 'Error al extraer información del producto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// También permitir GET para testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'Parámetro url es requerido' },
      { status: 400 }
    );
  }

  return POST(request);
}