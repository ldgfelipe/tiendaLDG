# Guía Rápida de Inicio - TiendaLDG

## 🚀 Primeros 5 minutos

### 1. Instalar dependencias
```bash
cd tiendaLDG
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Abre `.env.local` y configura:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=TU_API_KEY_DE_FIREBASE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
OPENAI_API_KEY=TU_API_KEY_DE_OPENAI
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Configurar Firebase
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Crear proyecto
firebase projects:create tienda-ldg

# Inicializar
firebase init
```

Selecciona:
- ✅ Hosting
- ✅ Firestore
- ✅ Functions

### 4. Iniciar en desarrollo
```bash
npm run dev
```

Visita: http://localhost:3000

---

## 📋 Próximos pasos

### Agregar primer producto
1. Copia URL del producto afiliado (ej: Amazon)
2. Visita: `http://localhost:3000/api/scrape-product`
3. Haz POST con: `{"url": "TU_URL"}`
4. Copia respuesta y pégala en Firestore

### Configurar Firebase
Ve a Firebase Console → Firestore → Collections

Crea colección `products` con estructura:
```json
{
  "title": "Nombre del Producto",
  "price": 99.99,
  "affiliateLink": "https://...",
  "image": "https://...",
  "category": ["ropa", "calzado"],
  "rating": 4.7,
  "reviewCount": 128
}
```

### Ver el Chatbot
Haz click en el botón flotante de color azul en la esquina inferior derecha.

---

## 🛠️ Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Generar build para producción |
| `npm run lint` | Verificar código |
| `npm run format` | Formatear código |
| `firebase deploy` | Subir a Firebase |
| `npm run type-check` | Verificar tipos TypeScript |

---

## 📁 Estructura clave

```
src/
├── app/              # Páginas principales
│   ├── api/          # Endpoints
│   └── page.tsx      # Home
├── components/       # Componentes React
│   ├── ProductCard   # Tarjetas de producto
│   ├── BlogCard      # Tarjetas de blog
│   ├── AIChatBot     # Chatbot IA
│   └── Layout        # Header/Footer
├── services/         # Servicios
│   ├── firestore.ts  # Base de datos
│   ├── ai-service.ts # IA
│   └── affiliate-service.ts # Afiliados
├── types/            # Tipos TypeScript
└── firebase.ts       # Config Firebase
```

---

## ⚡ Tips de velocidad

1. **Habilitar imágenes optimizadas** en Firebase
2. **Configurar CDN** en Firebase Hosting
3. **Activar Analytics** en Firebase Console
4. **Crear Sitemap** automático

---

## 🆘 Problemas comunes

### Error de CORS
- Verifica que las URLs estén en `NEXT_PUBLIC_SITE_URL`

### Error de API Key
- Asegúrate de que las keys no tengan comillas

### Productos no cargan
- Verifica que Firestore esté inicializado
- Revisa la consola del navegador

---

## 📧 Contacto

- soporte@tiendaldg.com
- Usa el chatbot IA en la web