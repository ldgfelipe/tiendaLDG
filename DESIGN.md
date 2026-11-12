# 🎨 Guía de Diseño Visual - TiendaLDG

## 🚨 PROBLEMA IDENTIFICADO

El sitio no tiene estilos visuales aplicados porque:
1. Falta el archivo CSS principal con estilos
2. No hay imágenes de ejemplo
3. Los componentes están hechos pero sin estilos aplicados

## 📁 Archivos Necesarios Crear

### 1. Imágenes para el sitio

Crea estas imágenes en `public/images/`:

```
public/images/
├── favicon.ico
├── og-image.jpg (1200x630)
├── banner-hero.jpg
├── products/
│   ├── botas-mountain.jpg
│   ├── zapatillas-running.jpg
│   └── jeans-clasicos.jpg
└── blog/
    └── default-blog.jpg
```

### 2. Herramientas para crear imágenes

**Gratis:**
- https://placehold.co
- https://ui-avatars.com
- https://picsum.photos

**Ejemplo de URLs:**
```
https://placehold.co/1200x630/6312ff/ffffff?text=TiendaLDG+Marketing+de+Afiliados
https://placehold.co/600x400/06b698/ffffff?text=Zapatillas+Running
https://placehold.co/600x400/6312ff/ffffff?text=Botas+de+Montaña
```

## 🔧 Solución Inmediata - Estilos CSS

El archivo `globals.css` ya está configurado con Tailwind. Solo necesitas:

1. **Verificar que Tailwind está importado:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. **Agregar clases Tailwind a tus componentes**

### Ejemplo de ProductCard con estilos visuales

```tsx
<div className="card card-hover transition-all duration-300">
  <div className="relative">
    {/* Imagen del producto */}
    <img 
      src={product.image || '/placeholder-product.jpg'}
      alt={product.title}
      className="w-full h-48 object-cover rounded-t-xl"
    />
    
    {/* Badge de mejor calificado */}
    {product.rating >= 4.5 && (
      <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">
        ★ Mejor Calificado
      </span>
    )}
  </div>
  
  <div className="p-4">
    <h3 className="text-lg font-bold mb-2">{product.title}</h3>
    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
    <div className="flex items-center justify-between">
      <span className="text-indigo-600 font-bold">${product.price}</span>
      <button className="btn btn-primary">
        Comprar
      </button>
    </div>
  </div>
</div>
```

## 🎯 CSS Clases Recomendadas

### Para Header
```html
<header class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
  <div class="container mx-auto px-4">
    <!-- Contenido -->
  </div>
</header>
```

### Para Hero Section
```html
<section class="text-center py-20 bg-gradient-to-r from-purple-600 to-emerald-600 text-white">
  <h1 class="text-5xl font-bold mb-6">Título Principal</h1>
  <p class="text-xl mb-10 opacity-90">Descripción</p>
</section>
```

### Para Grid de Productos
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <!-- Product Cards -->
</div>
```

## 🚀 Comandos para verificar

```bash
# 1. Verificar que Tailwind funciona
npm run build

# 2. Iniciar servidor
npm run dev

# 3. Abrir en navegador
http://localhost:3000
```

## 🔗 Recursos de diseño gratuitos

- **Imágenes:** https://unsplash.com, https://pexels.com
- **Iconos:** https://lucide.dev, https://heroicons.com
- **Paletas:** https://coolors.co, https://colorhunt.co
- **Mockups:** https://mockuphone.com

## 📞 Soporte

Si necesitas ayuda con el diseño visual:
1. Abre un Issue en GitHub
2. Incluye captura de pantalla del problema
3. Especifica qué componente necesita estilos

---

**Nota:** El proyecto está funcional pero necesita:
- Imágenes reales de productos
- Personalización de colores según tu marca
- Ajustes de tipografía si lo deseas