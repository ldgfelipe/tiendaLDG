// Servicio de IA para SEO y generación de contenido
import { AIAnalysis, Product, BlogPost } from '../types';

export class AIService {
  private apiKey: string;
  private endpoint: string;
  private models: {
    chat: string;
    embeddings: string;
  };

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.endpoint = 'https://api.openai.com/v1';
    this.models = {
      chat: 'gpt-4o-mini',
      embeddings: 'text-embedding-3-small'
    };
  }

  // Analizar producto y generar resumen optimizado
  async analyzeProduct(url: string, category: string): Promise<AIAnalysis> {
    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.models.chat,
        messages: [
          {
            role: 'system',
            content: `Eres un experto en marketing de afiliados y SEO. Analiza este producto afiliado y genera:
1. Un resumen convincente orientado a conversión
2. Palabras clave SEO relevantes para el nicho de ${category}
3. Sugerencias de contenido para blog
4. Puntuación SEO (1-100)
5. Análisis de legibilidad
6. Mejoras sugeridas para posicionar mejor

Responde en español con formato JSON.`
          },
          {
            role: 'user',
            content: `URL del producto: ${url}\nCategoría: ${category}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  // Generar descripción SEO optimizada
  async generateSEODescription(productName: string, category: string, attributes?: any): Promise<string> {
    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.models.chat,
        messages: [
          {
            role: 'system',
            content: `Genera una descripción SEO optimizada para un producto de referidos. Máximo 160 caracteres, incluye palabras clave y llama a la acción.`
          },
          {
            role: 'user',
            content: `Producto: ${productName}\nCategoría: ${category}\nAtributos: ${JSON.stringify(attributes)}`
          }
        ],
        temperature: 0.5,
        max_tokens: 100
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  // Generar título SEO
  async generateSEOTitle(productName: string, category: string): Promise<string> {
    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.models.chat,
        messages: [
          {
            role: 'system',
            content: `Genera un título SEO perfecto para posicionamiento. Máximo 60 caracteres, incluye palabra clave principal y marca si aplica.`
          },
          {
            role: 'user',
            content: `Producto: ${productName}\nCategoría: ${category}`
          }
        ],
        temperature: 0.3,
        max_tokens: 50
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  // Generar contenido para blog
  async generateBlogContent(productName: string, topic: string, targetAudience: string): Promise<BlogPost> {
    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.models.chat,
        messages: [
          {
            role: 'system',
            content: `Genera un artículo de blog completo optimizado para SEO. Incluye:
- Título atractivo
- Introducción que enganche
- Contenido principal con subtítulos H2-H3
- Llamados a la acción
- Palabras clave LSI
- Meta descripción
- Sugerencias de imágenes

Usa lenguaje persuasivo y orientado a conversiones. Máximo 2000 palabras.`
          },
          {
            role: 'user',
            content: `Producto: ${productName}\nTema: ${topic}\nPúblico objetivo: ${targetAudience}`
          }
        ],
        temperature: 0.6,
        max_tokens: 1500
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return {
      title: '',
      slug: '',
      excerpt: '',
      content,
      author: 'AI Assistant',
      publishedAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      category: topic,
      seoTitle: '',
      seoDescription: '',
      readTime: 0,
      featuredImage: '',
      status: 'draft',
      aiGenerated: true
    };
  }

  // Generar keywords LSI
  async generateKeywords(primaryKeyword: string, category: string, count: number = 10): Promise<string[]> {
    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.models.chat,
        messages: [
          {
            role: 'system',
            content: `Genera ${count} keywords LSI relevantes para el nicho de ${category}. Devuelve solo una lista de keywords separadas por comas.`
          },
          {
            role: 'user',
            content: `Keyword principal: ${primaryKeyword}`
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.split(',').map((k: string) => k.trim());
  }

  // Mejorar posicionamiento SEO
  async seoOptimization(content: string, pageType: 'product' | 'blog' | 'category'): Promise<any> {
    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.models.chat,
        messages: [
          {
            role: 'system',
            content: `Analiza este contenido para SEO y generar recomendaciones de mejora:
1. Título SEO ideal (max 60 caracteres)
2. Meta descripción (max 160 caracteres)
3. Keywords principales y secundarias
4. Estructura H1-H3 recomendada
5. Enlaces internos sugeridos
6. Mejoras de legibilidad

Responde con JSON estructurado.`
          },
          {
            role: 'user',
            content: `Tipo de página: ${pageType}\nContenido: ${content}`
          }
        ],
        temperature: 0.4,
        max_tokens: 500
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  // Generar FAQ para producto
  async generateFAQ(productName: string): Promise<Array<{ question: string; answer: string }>> {
    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.models.chat,
        messages: [
          {
            role: 'system',
            content: `Genera 5-7 preguntas frecuentes sobre este producto con respuestas detalladas. Incluye palabras clave y mejora conversiones.`
          },
          {
            role: 'user',
            content: `Producto: ${productName}`
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  // Análisis de competencia
  async analyzeCompetitor(url: string): Promise<any> {
    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.models.chat,
        messages: [
          {
            role: 'system',
            content: `Analiza esta página web como sitio de referidos y proporciona:
1. Fortalezas y debilidades SEO
2. Oportunidades de contenido
3. Palabras clave que puedes competir
4. Estrategia de posicionamiento

Responde en JSON.`
          },
          {
            role: 'user',
            content: `URL: ${url}`
          }
        ],
        temperature: 0.4,
        max_tokens: 800
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }
}