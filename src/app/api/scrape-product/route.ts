import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

async function callOpenAI(messages: any[], maxTokens: number = 1500) {
  const response = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3,
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
  if (url.includes('mercadolibre.com') || url.includes('merco')) return 'mercadolibre';
  return 'other';
}

// 🎯 PROMPT MEJORADO PARA EXTRACCIÓN DE PRODUCTOS
function getProductExtractionPrompt(url: string, detectedProvider: string): string {
  return `Eres un experto en extracción de información de productos afiliados. 
  Extrae la información más importante del producto en la URL: ${url}

  Proveedor detectado: ${detectedProvider}

  Devuelve SOLO un objeto JSON con estos campos (usa null si no puedes extraer):
  - title: Título del producto (máx 100 caracteres)
  - description: Descripción corta (máx 300 caracteres)
  - price: Precio actual (número, solo el valor, sin símbolo de moneda)
  - originalPrice: Precio original o tachado (número o null)
  - category: Categoría principal (solo un string, no array)
  - affiliateProvider: Nombre del proveedor (amazon, ebay, walmart, mercadolibre, shareasale, cj, other)
  - rating: Calificación (número 1-5, o 0 si no tiene)
  - reviewCount: Número de reseñas (entero, o 0)
  - mainImage: URL de la imagen principal
  - features: Array de 3-5 características principales (o array vacío si no hay)
  - pros: Array de 2-3 pros (o array vacío)
  - cons: Array de 2-3 contras (o array vacío)

  Si no puedes extraer un campo, usa null o array vacío. Sé conservador.
  `;
}

// 🎯 PROMPT PARA GENERAR CONTENIDO FALTANTE
function getContentGenerationPrompt(baseInfo: any, provider: string): string {
  return `Eres un redactor de productos experto en marketing y SEO. 
  Tienes esta información básica sobre un producto: ${JSON.stringify(baseInfo, null, 2)}

  El producto es de: ${provider}

  Genera contenido completo y convincente:
  1. Un título SEO optimizado (máx 60 caracteres)
  2. Una descripción meta (máx 160 caracteres)  
  3. Una descripción detallada del producto (150-200 palabras) destacando beneficios
  4. 8-10 palabras clave LSI relevantes
  5. 3-5 características principales en formato lista
  2-3 pros y 2-3 contras honestos
  2-3 preguntas frecuentes (question/answer)

  Responde en formato JSON con estas keys:
  - seoTitle: string
  - seoDescription: string
  - fullDescription: string
  - lsiKeywords: string[]
  - features: string[]
  - pros: string[]
  - cons: string[]
  - faqs: Array<{question: string, answer: string}>`
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

    // Paso 1: Intentar extraer información con IA
    const extractionPrompt = getProductExtractionPrompt(url, provider);
    const aiResponse = await callOpenAI([
      {
        role: 'system',
        content: extractionPrompt
      },
      {
        role: 'user',
        content: `Por favor extrae la información del producto en la URL: ${url}`
      }
    ], 2000);

    let productInfo: any = {};
    try {
      productInfo = JSON.parse(aiResponse.choices[0]?.message?.content || '{}');
      // Limpiar valores indefinidos
      if (productInfo.originalPrice === 'null' || productInfo.originalPrice === undefined) {
        productInfo.originalPrice = null;
      }
      if (productInfo.reviewCount === 'null' || productInfo.reviewCount === undefined) {
        productInfo.reviewCount = 0;
      }
    } catch {
      // Si falla el parsing, usar estructura básica
      productInfo = {
        title: 'Producto desde afiliado',
        description: 'Información extraída del enlace',
        price: 99.99,
        originalPrice: null,
        category: [provider],
        images: [],
        features: [],
        rating: 0,
        reviewCount: 0,
        affiliateProvider: provider,
      };
    }

    // Paso 2: Generar contenido faltante con IA
    const contentPrompt = getContentGenerationPrompt(productInfo, provider);
    const contentResponse = await callOpenAI([
      {
        role: 'system',
        content: contentPrompt
      },
      {
        role: 'user',
        content: `Genera contenido complementario para este producto: ${productInfo.title || 'producto'}`
      }
    ], 1500);

    let seoData: any = {};
    try {
      seoData = JSON.parse(contentResponse.choices[0]?.message?.content || '{}');
    } catch {}

    // Paso 3: Generar keywords LSI
    const keywordsPrompt = `Genera 10 palabras clave LSI relevantes para este producto: ${productInfo.title || 'producto'}. 
    Responde solo con una lista separada por comas.`;
    const keywordsResponse = await callOpenAI([
      {
        role: 'system',
        content: `Genera 10 palabras clave LSI relevantes para este producto. 
        Responde solo con una lista separada por comas.`
      },
      {
        role: 'user',
        content: `Producto: ${productInfo.title || 'producto'} | Categoría: ${provider}`
      }
    ], 1000);

    const keywords = (keywordsResponse.choices[0]?.message?.content || '')
      .split(',')
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 2);

    // Construir respuesta final
    const response = {
      product: {
        title: productInfo.title || 'Producto desde afiliado',
        description: productInfo.description || '',
        price: parseFloat(productInfo.price) || 0,
        originalPrice: productInfo.originalPrice ? parseFloat(productInfo.originalPrice) : null,
        affiliateLink: url,
        image: productInfo.mainImage || productInfo.image || '',
        images: productInfo.images || productInfo.imageUrls || [],
        category: Array.isArray(productInfo.category) ? productInfo.category : [productInfo.category || provider],
        rating: parseFloat(productInfo.rating) || 0,
        reviewCount: parseInt(productInfo.reviewCount) || 0,
        affiliateProvider: productInfo.affiliateProvider || provider,
        commission: productInfo.commission || (provider === 'amazon' ? 5 : 
          provider === 'ebay' ? 3 : 
          provider === 'walmart' ? 4 : 
          provider === 'mercadolibre' ? 3.5 : 5),
        seoKeywords: [...(productInfo.seoKeywords || []), ...keywords],
        seoTitle: seoData.seoTitle || productInfo.title || 'Producto',
        seoDescription: seoData.seoDescription || productInfo.description || '',
      },
      metadata: {
        provider,
        extractedAt: new Date().toISOString(),
        confidence: productInfo.rating > 0 ? 0.85 : 0.6
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