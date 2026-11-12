# Ejemplos de Uso - TiendaLDG

## 📦 Cómo agregar un nuevo producto afiliado

### Paso 1: Copiar URL del producto afiliado
```
Ejemplo: https://amzn.to/xxx
```

### Paso 2: Usar el API de scraping
```bash
curl -X POST http://localhost:3000/api/scrape-product \
  -H "Content-Type: application/json" \
  -d '{"url": "TU_URL_AFIILIADA"}'
```

### Paso 3: Respuesta automática con información
```json
{
  "product": {
    "title": "Nombre del producto",
    "description": "Descripción optimizada",
    "price": 99.99,
    "image": "URL_de_imagen",
    "category": ["ropa", "calzado"],
    "seoKeywords": ["keyword1", "keyword2"],
    "seoTitle": "Título SEO optimizado"
  }
}
```

---

## 🤖 Uso del Chatbot IA

### Insertar componente
```tsx
import AIChatBot from '@/components/AIChatBot';
import { Product } from '@/types';

// En tu página
<AIChatBot 
  products={productosFiltrados}
  category="ropa-y-calzado" 
/>
```

### Personalizar prompt
```tsx
const context = {
  userHistory: ['productos_vistos', 'prefers: negro'],
  location: 'México',
  budget: '$100-$200'
};
```

---

## 📝 Generar contenido para blog con IA

```typescript
import { BlogGenerator } from '@/ai/blog-generator';

const generator = new BlogGenerator();

// Generar reseña
const review = await generator.generateProductReview(producto, 4.5);

// Generar guía del comprador
const guide = await generator.generateBuyerGuide('zapatos running', keywords);

// Generar comparativa
const comparison = await generator.generateComparisonArticle(
  [producto1, producto2], 
  'Zapatos Running Top 5'
);
```

---

## 🔍 Buscador inteligente

```tsx
import SearchBar from '@/components/SearchBar';

// Buscador con sugerencias IA
<SearchBar 
  placeholder="Busca productos, artículos o marcas..."
  showSuggestions={true}
/>
```

---

## 📊 Analytics y Tracking

### Registrar clic de afiliado
```typescript
const handleClick = async (productId: string) => {
  // Registrar en Firestore
  await fetch('/api/track-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
  });
  
  // Redirigir al afiliado
  window.open(affiliateLink, '_blank');
};
```

---

## 🎯 SEO por defecto

### Metadatos dinámicos
```typescript
import HeaderSEO from '@/components/HeaderSEO';
import { SEOMetadata } from '@/types';

const metadata: SEOMetadata = {
  title: 'Product Name - Compra en TiendaLDG',
  description: 'Encuentra el mejor precio garantizado. Envíos gratis y devolución 30 días.',
  keywords: ['product-name', 'comprar', 'oferta', 'afiliado'],
  canonicalUrl: 'https://tutienda.web.app/product/name',
  openGraph: {
    title: 'Product Name - TiendaLDG',
    description: 'Descripción con emojis 🎉 Envíos gratis',
    image: 'https://tutienda.web.app/images/product.jpg',
    type: 'product'
  },
  structuredData: {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': 'Product Name',
    'offers': {
      '@type': 'Offer',
      'price': '99.99',
      'priceCurrency': 'USD'
    }
  }
};

// En tu página
<HeaderSEO metadata={metadata} />
```

---

## 📱 Componentes reutilizables

### ProductCard
```tsx
<ProductCard 
  product={producto}
  featured={true} // Badge de mejor calificación
/>
```

### BlogCard
```tsx
<BlogCard 
  post={post}
  featured={true} // Muestra imagen destacada
/>
```

---

## 🛠️ Personalización de Nicho

### Cambiar nicho principal
```env
# En .env.local
NEXT_PUBLIC_NICHE=ropa-y-calzado
```

### Categorías disponibles
```typescript
const categories = [
  { id: 'ropa', name: 'Ropa', icon: '👕' },
  { id: 'calzado', name: 'Calzado', icon: '👟' },
  { id: 'accesorios', name: 'Accesorios', icon: '💍' },
  { id: 'tecnologia', name: 'Tecnología', icon: '📱' }
];
```

---

## 🚀 Despliegue

### Con Firebase CLI
```bash
# Instalar
npm install -g firebase-tools

# Login
firebase login

# Configurar proyecto
firebase use tienda-ldg

# Desplegar
npm run build
firebase deploy
```

### Con script automático
```bash
bash deploy.sh
```

---

## 🎨 Personalizar estilos

### Colores principales (tailwind.css)
```css
/* Cambiar colores en globals.css */
:root {
  --primary: #6312ff;  /* Indigo 600 */
  --secondary: #06b698; /* Emerald 500 */
}
```

### Fuentes personalizadas
```css
/* En globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

---

## 📧 Integración de newsletter

```typescript
// Suscripción
const subscribe = async (email: string) => {
  await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
};
```

---

## 🤝 Integración con redes sociales

```typescript
// Compartir en redes
const shareToSocial = (url: string, title: string) => {
  if (navigator.share) {
    navigator.share({ title, url });
  }
};
```

---

## 📊 Exportar datos

```typescript
// Exportar productos
const exportProducts = () => {
  const data = products.map(p => ({
    name: p.title,
    price: p.price,
    clicks: p.clickCount
  }));
  
  downloadCSV(data, 'productos.csv');
};
```

---

## 🆘 Soporte técnico

- 📧 Email: soporte@tiendaldg.com
- 💬 Asistente IA: Usa el chatbot flotante
- 📚 Documentación: Este archivo + README.md