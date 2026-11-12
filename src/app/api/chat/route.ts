import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

async function callOpenAI(messages: any[], maxTokens: number = 500) {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'message es requerido' },
        { status: 400 }
      );
    }

    // Construir prompt para el asistente
    const systemPrompt = `
Eres un asistente de IA experto en marketing de afiliados especializado en ropa y calzado.
Ayuda a los usuarios a encontrar productos de calidad con recomendaciones personalizadas.

Categoría principal: ropa y calzado

Producto disponibles: ${context?.products?.map((p: any) => `- ${p.title} (${p.category})`).join('\n') || 'Ninguno'}

Reglas:
1. Responde en español con un tono profesional y amable
2. Proporciona recomendaciones basadas en necesidades del usuario
3. Si mencionas un producto, incluye el enlace de afiliado
4. No menciones que eres IA ni uses términos como "como modelo de lenguaje"
5. Sé conciso pero informativo (máximo 3 párrafos por respuesta)
6. Pregunta siempre si necesitan más ayuda

Instrucciones adicionales:
- Usa palabras clave de SEO naturalmente
- Menciona ventajas de productos recomendados
- Incluye datos de verdad para productos conocidos
- Si no sabes algo, di que lo investigarás y ofrece ayuda
`;

    // Llamada a OpenAI
    const data = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
      ...(context?.previousMessages || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ], 500);

    const responseText = data.choices[0]?.message?.content || 'Lo siento, no pude procesar tu pregunta.';

    return NextResponse.json({
      response: responseText,
      usage: data.usage
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Error al procesar tu mensaje' },
      { status: 500 }
    );
  }
}