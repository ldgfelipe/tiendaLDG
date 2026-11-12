import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

async function callOpenAI(messages: any[], maxTokens: number = 1000) {
  const response = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: maxTokens
    })
  });
  return response.json();
}

function detectProvider(url: string): string {
  if (url.includes('amazon.') || url.includes('amzn.to')) return 'amazon';
  if (url.includes('ebay.')) return 'ebay';
  if (url.includes('walmart.')) return 'walmart';
  if (url.includes('shareasale.com')) return 'shareasale';
  if (url.includes('clickbank.')) return 'clickbank';
  if (url.includes('cj.com')) return 'cj';
  return 'other';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      );
    }

    const provider = detectProvider(url);

    // Intentar extraer información con IA
    const aiResponse = await callOpenAI([
      {
        role: 'system',
        content: `Eres un experto en extracción de información de productos afiliados. 
Extrae información detallada del producto incluyendo: título, descripción, precio, categoría, 
tallas disponibles, características principales, pros y contras. Responde solo con JSON.`
      },
      {
        role: 'user',
        content: `URL del producto: ${url}`
      }
    ], 1000);

    let productInfo: any = {};
    try {
      productInfo = JSON.parse(aiResponse.choices[0]?.message?.content || '{}');
    } catch {
      // Si falla el parsing, usar estructura básica
      productInfo = {
        title: 'Producto desde afiliado',
        description: 'Información extraída del enlace',
        price: 99.99,
        category: [provider],
        images: [],
        features: []
      };
    }

    // Generar optimizaciones SEO
    const seoResponse = await callOpenAI([
      {
        role: 'system',
        content: `Genera un título SEO (máx 60 caracteres) y descripción meta (máx 160 caracteres) 
optimizados para SEO. Responde en formato JSON.`
      },
      {
        role: 'user',
        content: `Producto: ${productInfo.title || 'producto'} | Categoría: ${provider}`
      }
    ], 200);

    let seoData: any = {};
    try {
      seoData = JSON.parse(seoResponse.choices[0]?.message?.content || '{}');
    } catch {}

    // Generar keywords
    const keywordsResponse = await callOpenAI([
      {
        role: 'system',
        content: `Genera 10 palabras clave LSI relevantes para este producto. 
Responde solo con una lista separada por comas.`
      },
      {
        role: 'user',
        content: `Producto: ${productInfo.title || 'producto'}`
      }
    ], 200);

    const keywords = (keywordsResponse.choices[0]?.message?.content || '')
      .split(',')
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);

    // Construir respuesta
    const response = {
      product: {
        title: productInfo.title || 'Producto desde afiliado',
        description: productInfo.description || '',
        price: productInfo.price || 0,
        originalPrice: productInfo.originalPrice || productInfo.price,
        affiliateLink: url,
        image: productInfo.image || '',
        images: productInfo.images || [],
        category: productInfo.category || [provider],
        rating: productInfo.rating || 0,
        reviewCount: productInfo.reviewCount || 0,
        affiliateProvider: provider,
        commission: productInfo.commission || 5,
        seoKeywords: [...(productInfo.seoKeywords || []), ...keywords],
        seoTitle: seoData.title || productInfo.title || 'Producto',
        seoDescription: seoData.description || productInfo.description || '',
      },
      metadata: {
        provider,
        extractedAt: new Date().toISOString(),
        confidence: 0.9
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error scraping product:', error);
    return NextResponse.json(
      { error: 'Error al extraer información del producto' },
      { status: 500 }
    );
  }
}