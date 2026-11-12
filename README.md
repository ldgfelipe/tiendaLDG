# TiendaLDG - Tienda de Referidos Premium con IA

¡Bienvenido a la documentación completa de tu tienda de productos de referidos de alto posicionamiento!

## 📋 Tabla de Contenidos

1. [Características Principales](#características-principales)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Requisitos previos](#requisitos-previos)
4. [Instalación](#instalación)
5. [Configuración](#configuración)
6. [Despliegue en Firebase](#despliegue-en-firebase)
7. [SEO y Posicionamiento](#seo-y-posicionamiento)
8. [Herramientas de IA Integradas](#herramientas-de-ia-integradas)
9. [Marketing de Afiliados](#marketing-de-afiliados)
10. [APIs y Endpoints](#apis-y-endpoints)

---

## ✨ Características Principales

### 🎯 SEO Optimizado
- Metadatos dinámicos personalizados para cada página
- Generación automática de títulos y descripciones SEO
- Schema markup estructurado (JSON-LD)
- URLs amigables y SEO-friendly
- Open Graph y Twitter Cards

### 🤖 Inteligencia Artificial
- Chatbot asistente para recomendaciones
- Generación automática de contenido para blog
- Optimización SEO con IA
- Análisis de palabras clave
- Resúmenes de productos y reseñas

### 🛒 Sistema de Afiliados
- Scraping automático de productos afiliados
- Tracking de clics y conversiones
- Enlaces de afiliado con tracking
- Comparación automática de precios
- Integración con múltiples redes de afiliados (Amazon, ShareASale, CJ, ClickBank)

### 📝 Blog Integrado
- Generación automática de artículos
- Optimización para palabras clave
- Sistema de categorías por nicho
- Artículos sugeridos por IA

### 📊 Analytics y Métricas
- Seguimiento de clics de afiliados
- Análisis de rendimiento SEO
- Métricas de conversión
- Top productos y palabras clave

---

## 📁 Estructura del Proyecto

```
tiendaLDG/
├── src/
│   ├── app/                    # Páginas de Next.js (App Router)
│   │   ├── api/               # API Routes
│   │   │   ├── chat/          # Asistente IA
│   │   │   ├── scrape-product/ # Scraper de productos
│   │   │   └── track-click/   # Tracking de clics
│   │   ├── page.tsx           # Página principal
│   │   └── layout.tsx         # Layout global
│   ├── components/
│   │   ├── Layout.tsx         # Header y footer
│   │   ├── ProductCard.tsx    # Tarjeta de producto
│   │   ├── BlogCard.tsx       # Tarjeta de blog
│   │   ├── HeaderSEO.tsx      # Meta tags SEO
│   │   ├── SearchBar.tsx      # Buscador inteligente
│   │   └── AIChatBot.tsx      # Chatbot IA
│   ├── services/
│   │   ├── firestore.ts       # Base de datos
│   │   ├── ai-service.ts      # Servicio de IA
│   │   ├── affiliate-service.ts # Afiliados
│   │   └── scraper.ts         # Scraping
│   ├── ai/
│   │   └── blog-generator.ts  # Generador de blog
│   ├── types/
│   │   └── index.ts           # Tipos TypeScript
│   └── firebase.ts            # Configuración Firebase
├── public/
│   └── images/                # Imágenes estáticas
├── .env.example               # Variables de entorno
├── tailwind.config.js         # Config Tailwind
└── README.md                  # Este archivo
```

---

## ⚙️ Requisitos previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- API Key de OpenAI (o compatible)
- Cuenta de redes de afiliados

---

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/tiendaLDG.git
cd tiendaLDG
```

2. Instala dependencias:
```bash
npm install
# o
yarn install
```

3. Copia variables de entorno:
```bash
cp .env.example .env.local
```

4. Configura tus variables en `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
OPENAI_API_KEY=tu_api_key_openai
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

---

## ⚙️ Configuración

### Firebase Config
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Activa Firestore, Auth y Hosting
4. Copia las credenciales a `.env.local`

### Configuración de IA
- **OpenAI**: Obtén tu API key en [platform.openai.com](https://platform.openai.com)
- **Alternativas**: Puedes usar Azure OpenAI, Google Gemini, o cualquier modelo compatible

### Redes de Afiliados
Configura los enlaces de afiliados en:
- Amazon Associates
- ShareASale
- CJ Affiliate
- ClickBank

---

## 🔥 Despliegue en Firebase

### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Configurar Firebase
```bash
firebase init
```
Selecciona:
- ✅ Hosting: Configure and deploy Firebase Hosting sites
- ✅ Firestore: Configure Firestore instead of realtime database
- ✅ Functions: Deploy with Firebase Functions

### 3. Build y Deploy
```bash
npm run build
firebase deploy
```

### 4. Configuración de App Hosting (Nueva opción)
```bash
firebase hosting:channel:deploy live
```

---

## 📈 SEO y Posicionamiento

### Características Implementadas

1. **SEO On-Page Automático**
   - Metadatos dinámicos con IA
   - Keywords generadas automáticamente
   - Schema markup para productos
   - Enlaces internos sugeridos

2. **Velocidad y Performance**
   - Optimización de imágenes automática
   - Lazy loading implementado
   - CDN de Firebase Hosting
   - Code splitting automático

3. **Estructura de Contenido**
   - URLs limpias y descriptivas
   - Breadcrumbs automáticos
   - Sitemap.xml automático
   - robots.txt optimizado

### Configuración de SEO

```typescript
// En cada página, usa el componente HeaderSEO
import HeaderSEO from '@/components/HeaderSEO';

const metadata: SEOMetadata = {
  title: 'Título SEO (máx 60 caracteres)',
  description: 'Descripción SEO (máx 160 caracteres)',
  keywords: ['palabra', 'clave', 'relevante'],
  canonicalUrl: 'https://tusiita.com/pagina',
  openGraph: {
    title: 'Título OG',
    description: 'Descripción OG',
    image: '/og-image.jpg',
    type: 'website'
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': 'Nombre del producto',
    'offers': {
      '@type': 'Offer',
      'price': '99.99',
      'priceCurrency': 'USD'
    }
  }
};
```

---

## 🤖 Herramientas de IA Integradas

### 1. Asistente de Chatbot
```typescript
// Ubicado en: /components/AIChatBot.tsx
// Funcionalidades:
// - Recomendaciones personalizadas
// - Respuestas 24/7
// - Integración con productos
// - Tracking de preguntas
```

### 2. Generador Automático de Blog
```typescript
// Ubicado en: /src/ai/blog-generator.ts
// Tips:
// - Genera comparativas
// - Crea guías del comprador
// - Reseñas automáticas
// - Optimización SEO en tiempo real
```

### 3. Análisis SEO con IA
```typescript
// Ubicado en: /src/services/ai-service.ts
// Funcionalidades:
// - Generación de keywords LSI
// - Optimización de metadatos
// - Análisis de competencia
// - Puntuación de legibilidad
```

---

## 💰 Marketing de Afiliados

### Mejores Prácticas Implementadas

1. **Trust Signals**
   - Badges de "Mejor Calificado"
   - Testimonios generados
   - Certificaciones visibles

2. **Conversion Optimization**
   - Botones CTA claros
   - Badges de envío gratis
   - Garantía de devolución
   - Countdown timers (futuro)

3. **Tracking Avanzado**
   - Registro de clics con timestamp
   - Attribution tracking
   - ROI calculation
   - Top products analysis

### Configuración de Enlaces Afiliados

```typescript
// Agregar producto desde URL afiliada
const product: CreateProductFromAffiliate = {
  title: 'Botas Mountain Pro',
  affiliateLink: 'https://amzn.to/xxx',
  category: 'Calzado',
  // La IA extrae resto de información automáticamente
}
```

---

## 🔌 APIs y Endpoints

### Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/scrape-product` | POST | Extraer info de producto afiliado |
| `/api/chat` | POST | Chatbot IA para recomendaciones |
| `/api/track-click` | POST | Registrar clic de afiliado |

### Ejemplo de Uso

```javascript
// Scrapear un producto
const response = await fetch('/api/scrape-product', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://amzn.to/xxx',
    provider: 'amazon'
  })
});
const data = await response.json();
console.log(data.product);

// Enviar al chatbot
const chatResponse = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '¿Qué botas me recomiendas para correr?',
    context: { category: 'calzado', products: [...] }
  })
});
const chatData = await chatResponse.json();
console.log(chatData.response);
```

---

## 🎨 Diseño Visual

### 🎯 Estado actual
- ✅ CSS básico configurado con Tailwind CSS
- ✅ Paleta de colores definida (Púrpura #6312ff, Verde #06b698)
- ⚠️ **Necesitas agregar imágenes reales de productos**

### 📁 Imágenes creadas
Ejecuta este script para generar placeholders visuales:
```bash
node scripts/create-placeholders.js
```

Esto crea:
```
public/images/
├── og-image.svg              # Social media preview
├── favicon.svg               # Ícono del sitio
├── products/
│   ├── botas-mountain.svg    # Placeholder botas
│   ├── zapatillas-running.svg # Placeholder running
│   └── jeans-clasicos.svg    # Placeholder jeans
└── blog/
    └── blog-default.svg      # Placeholder blog
```

### 🎨 Para agregar estilos visuales

Los componentes usan clases Tailwind. Ejemplo:
```tsx
// ProductCard ejemplo con estilos
<div className="card card-hover transition-all duration-300">
  <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
  <h3 className="text-lg font-bold">{product.title}</h3>
  <button className="btn btn-primary">Comprar</button>
</div>
```

### 🔗 Recursos de diseño
- **Paleta:** `styleguide.md`
- **Ejemplos:** `DESIGN.md`
- **Imágenes placeholder:** Script automático

---

## 🎯 Nichos Soportados

### Nicho Principal: Ropa y Calzado ✅
- Zapatillas running
- Botas casuales
- Ropa deportiva
- Outfits casuales
- Accesorios

### Otros Nichos (expandibles)
- Tecnología
- Finanzas personales
- Cursos online
- Salud y bienestar
- Hogar

---

## 🔧 Herramientas de Desarrollo

### Scripts disponibles

```bash
npm run dev        # Desarrollo
npm run build      # Build para producción
npm run start      # Servidor de producción
npm run lint       # Linting
npm run format     # Formatear código
```

### Git Hooks (opcional)

Instala Husky para pre-commit hooks:
```bash
npm install husky --save-dev
npx husky install
```

---

## 📊 Métricas Clave

### KPIs a monitorizar

1. **SEO**
   - Posiciones en Google
   - Tráfico orgánico
   - CTR de resultados
   - Tiempo en página

2. **Afiliados**
   - Clicks de afiliados
   - Tasa de conversión
   - Ingresos generados
   - ROI de campañas

3. **IA**
   - Interacciones con chatbot
   - Contenido generado
   - Métricas de engagement

---

## 🚀 Próximos Pasos

1. [ ] Configurar dominio personalizado
2. [ ] Configurar Google Search Console
3. [ ] Activar Google Analytics 4
4. [ ] Configurar campañas de email marketing
5. [ ] Integrar redes sociales
6. [ ] Configurar programa de referidos

---

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Añadir nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo LICENSE para más detalles.

---

## 📞 Soporte

- 📧 Email: soporte@tiendaldg.com
- 🌐 Sitio Web: https://tiendaldg.web.app
- 💬 Asistente IA: Usa el botón flotante

---

## 📝 Notas Finales

¡Gracias por usar TiendaLDG! 

Recuerda:
- Mantén actualizadas las API keys
- Monitorea el rendimiento SEO mensualmente
- Utiliza las herramientas de IA para optimizar contenido
- Analiza las métricas de conversión con regularidad

**¡Éxito con tu tienda de referidos!**

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/licencia-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/React-19-purple?style=flat-square" />
  <img src="https://img.shields.io/badge/Firebase-Active-orange?style=flat-square" />
</div>