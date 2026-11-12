# 🏗️ Arquitectura del Sistema - TiendaLDG

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO (Browser)                         │
└────────────────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 (App Router)                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                     páginas públicas                        │  │
│  │  /              → página principal                        │  │
│  │  /products      → listado de productos                      │  │
│  │  /blog          → blog de contenidos                       │  │
│  │  /contact       → página de contacto                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                     componentes React                       │  │
│  │  Layout.tsx     → Header/Footer global                      │  │
│  │  ProductCard    → Tarjeta de producto con AI               │  │
│  │  BlogCard       → Tarjeta de blog                          │  │
│  │  AIChatBot      → Asistente IA flotante                    │  │
│  │  SearchBar      → Buscador con sugerencias AI              │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────┬────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    AI SERVICE   │      │ AFFILIATE SVC   │      │  SCRAPER SVC    │
│  OpenAI GPT-4o  │      │   Affiliate     │      │    Puppeteer    │
│  - Chat         │      │   Service       │      │     Cheerio     │
│  - SEO Analysis │      │ - Valid links   │      │  - Amazon       │
│  - Content Gen  │      │ - Clean links   │      │  - eBay         │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                          │                        │
         │                          │                        │
         └──────────────────────────┼────────────────────────┘
                                    │
                                    ▼
                     ┌────────────────────────────┐
                     │        FIRESTORE             │
                     │  ┌────────────────────────┐  │
                     │  │      products          │  │
                     │  │  ├── ProductCard       │  │
                     │  │  ├── ProductDetail     │  │
                     │  │  └── Category          │  │
                     │  ├────────────────────────┤  │
                     │  │      blogPosts         │  │
                     │  │  ├── AI Generated      │  │
                     │  │  └── Published         │  │
                     │  ├────────────────────────┤  │
                     │  │      analytics         │  │
                     │  │  ├── pageViews        │  │
                     │  │  ├── affiliateClicks  │  │
                     │  │  └── conversions      │  │
                     │  ├────────────────────────┤  │
                     │  │     categories         │  │
                     │  │  ├── Ropa             │  │
                     │  │  ├── Calzado          │  │
                     │  │  └── Accesorios       │  │
                     │  └────────────────────────┘  │
                     └────────────────────────────┘
                               │
                               ▼
                    ┌────────────────────────┐
                    │     FIREBASE HOSTING     │
                    │   CDN Global + HTTPS     │
                    └────────────────────────┘
```

---

## Flujo de Datos - Compra de Producto

```
1. Usuario veProducto → ProductCard
                              │
                              ▼
2. Haz click "Comprar Ahora" → track-click API
                              │
                              ▼
3. API registra click → Firestore (incrementa clickCount)
                              │
                              ▼
4. Redirige a enlace afiliado → window.open()
                              │
                              ▼
5. Usuario compra → Conversión registrada
```

---

## Flujo de Contenido AI-Generated

```
URL afiliado → Scraper → Información extraída
                                        │
                                        ▼
                              AI Service:
                    ┌─────────────────────────────────┐
                    │  • Genera resumen SEO           │
                    │  • Genera keywords LSI          │
                    │  • Genera descripción           │
                    │  • Genera FAQ                   │
                    └─────────────────────────────────┘
                                        │
                                        ▼
                                   Product
                                        │
                                        ▼
                                   Blog Post (Opcional)
                                        │
                                        ▼
                              Publicado → SEO Indexado
```

---

## APIs Disponibles

### 1. POST `/api/scrape-product`
Extrae información de productos afiliados

**Request:**
```json
{
  "url": "https://amzn.to/xxx",
  "provider": "amazon"
}
```

**Response:**
```json
{
  "product": {
    "title": "...",
    "price": 99.99,
    "image": "...",
    "seoKeywords": ["..."]
  }
}
```

### 2. POST `/api/chat`
Chatbot IA para recomendaciones

**Request:**
```json
{
  "message": "¿Qué botas me recomiendas?",
  "context": {
    "category": "calzado",
    "products": [...]
  }
}
```

**Response:**
```json
{
  "response": "Te recomiendo las botas Mountain Pro X500...",
  "usage": {...}
}
```

### 3. POST `/api/track-click`
Tracking de clics de afiliados

**Request:**
```json
{
  "productId": "botas-mountain-pro"
}
```

---

## Base de Datos Firestore

### Colección: products
```
products/
├── {productId}
│   ├── title: string
│   ├── description: string
│   ├── price: number
│   ├── affiliateLink: string
│   ├── image: string
│   ├── category: string[]
│   ├── rating: number
│   ├── reviewCount: number
│   ├── clickCount: number
│   ├── affiliateProvider: string
│   ├── commission: number
│   └── aiSummary: string (AI generated)
```

### Colección: blogPosts
```
blogPosts/
├── {postId}
│   ├── title: string
│   ├── content: string
│   ├── category: string
│   ├── tags: string[]
│   ├── aiGenerated: boolean
│   ├── status: 'published' | 'draft'
│   └── seoData: {title, description, keywords}
```

### Colección: analytics
```
analytics/
└── global
    ├── pageViews: number
    ├── affiliateClicks: number
    ├── conversions: number
    ├── revenue: number
    └── topProducts: [{productId, clicks}]
```

---

## Componentes Clave

### ProductCard.tsx
```
┌──────────────────────────────────┐
│  [Imagen producto]               │
│  ★ Mejor Calificado (Badge)     │
│  Precio | Rating ★★ | Reviews   │
│  Descripción corta (AI)         │
│  [Comprar Ahora] [Detalles]     │
│  Affiliate Link (Dev only)      │
└──────────────────────────────────┘
```

### AIChatBot.tsx
```
┌──────────────────────────────────┐
│  Botón flotante (izq. abajo)    │
│  ┌─────────────────────────────┐  │
│  │ Asistente IA              │  │
│  │ ┌───[Mensaje usuario]───┐  │  │
│  │ │[Respuesta IA...]     │  │  │
│  │ └───────────────────────┘  │  │
│  │ Entrada: Pregunta...      │  │
│  │ [Enviar]                  │  │
│  └─────────────────────────────┘  │
└──────────────────────────────────┘
```

---

## Tecnologías Usadas

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | Next.js | 14.2.4 |
| UI | React | 18.2.0 |
| Estilos | Tailwind CSS | 3.4.3 |
| Backend | Firebase | ^10.12.2 |
| IA | OpenAI | GPT-4o-mini |
| Deploy | Firebase Hosting | - |
| Base datos | Firestore | - |

---

## Performance Targets

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| LCP | < 2.5s | - |
| FID | < 100ms | - |
| CLS | < 0.1 | - |
| SEO Score | > 90 | - |
| Mobile Score | > 90 | - |
| Desktop Score | > 95 | - |

---

## Escalabilidad

### Próximas fases:
1. **Multi-idioma** (i18n)
2. **Marketplace** (múltiples afiliados)
3. **Aplicación móvil** (React Native)
4. **Newsletter** (Email marketing)
5. **Programa de referidos**

```
Nicho Actual:  Ropa y Calzado
Próximo:      Tecnología → Salud → Hogar → etc.
```

---

## Seguridad

- ✅ HTTPS automático (Firebase)
- ✅ Reglas de Firestore configuradas
- ✅ Validación de inputs
- ✅ Sanitización de datos
- ✅ Protección contra SSRF (scraping)

---

## 🚀 ¡Listo para producción!

Con esta arquitectura tienes:
- ✅ SEO técnico completo
- ✅ AI integrado en todos los aspectos
- ✅ Sistema de afiliados funcional
- ✅ Base de datos escalable
- ✅ Deploy a CDN global

<div align="center">
  <img src="https://img.shields.io/badge/SEO-Optimizado-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/AI-Integrado-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Performance-Rápido-green?style=flat-square" />
</div>