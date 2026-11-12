# Guía de Estilos - TiendaLDG

## 🎨 Paleta de Colores

### Colores Principales
- **Primary (Púrpura):** `#6312ff` / `#5100e6`
- **Secondary (Verde):** `#06b698` / `#059669`

### Colores de Texto
- **Primario:** `#333333`
- **Secundario:** `#666666`
- **Complementario:** `#999999`

### Fondos
- **Gradiente:** `linear-gradient(135deg, #f0f4ff 0%, #f8f9fa 100%)`
- **Cards:** `#ffffff`

## 📦 Componentes con Estilos

### 1. Header/Navegación
- Fondo translúcido con blur
- Logo con gradiente
- Menú responsive
- Sombra suave

### 2. Hero Section
- Título grande con gradiente de texto
- Subtítulo descriptivo
- Buscador destacado
- CTA principal

### 3. Product Cards
- Imagen con aspecto 4:3
- Badge de "Mejor Calificado"
- Nombre del proveedor
- Precio y rating
- Botones Comprar/Ver detalles

### 4. Blog Cards
- Imagen destacada
- Categoría y badge AI
- Título y excerpt
- Meta información (autor, fecha, tiempo de lectura)

### 5. Footer
- Grid 4 columnas
- Enlaces organizados
- Color oscuro (#1a1a1a)
- Texto gris claro

## 🧩 Utilidades CSS

### Spacing
- SM: 0.5rem (8px)
- MD: 1rem (16px)
- LG: 1.5rem (24px)
- XL: 2rem (32px)
- 2XL: 3rem (48px)

### Tipografía
- **Fuente principal:** Inter
- **Tamaños:**
  - Display: 3rem (48px)
  - H1: 2.25rem (36px)
  - H2: 1.875rem (30px)
  - H3: 1.5rem (24px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### Bordes y Sombras
- Border radius: 12px (cards), 9999px (botones)
- Shadow: `0 4px 6px -1px rgba(0,0,0,0.1)`

## ⚡ Clases Tailwind Disponibles

```html
<!-- Botones -->
<button class="btn btn-primary">Comprar ahora</button>

<!-- Cards -->
<div class="card card-hover">Contenido</div>

<!-- Grid -->
<div class="grid-responsive">Productos</div>

<!-- Badges -->
<span class="badge badge-primary">AI Generated</span>

<!-- Container -->
<div class="container">Contenido</div>

<!-- Loading -->
<div class="spinner"></div>
```

## 🎯 Responsividad

| Breakpoint | Dimensiones | Uso típico |
|------------|-------------|------------|
| SM | < 640px | Móvil |
| MD | 640px - 768px | Tablet |
| LG | 768px - 1024px | Desktop pequeño |
| XL | 1024px - 1280px | Desktop |
| 2XL | > 1280px | Desktop grande |

## 📱 Mobile First

Todos los componentes están diseñados mobile-first:
- Touch targets mínimo 44px
- Espaciado generoso
- Imágenes responsive
- Menú hamburguesa en móvil