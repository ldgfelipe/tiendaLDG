'use client';

/**
 * Product Creation Form with 3-step wizard
 * Features:
 * - URL scraping or manual entry
 * - React Quill rich text editor
 * - Firebase Storage image upload with fallback
 * - All fields saved properly
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/components/AdminAuthWrapper';
import { ImageUploadService } from '@/lib/firebase-client';
import dynamic from 'next/dynamic';

// Cargar react-quill dinámicamente para evitar problemas de SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const CATEGORIES = ['Calzado', 'Ropa', 'Tecnología', 'Hogar', 'Belleza', 'Deportes'];
const imageService = new ImageUploadService();

function ProductForm() {
  const { user, loading: authLoading, logout } = useAdminAuth();
  const router = useRouter();

  // Estado del formulario
  const [mode, setMode] = useState<'url' | 'manual'>('url');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  
  // Nuevo estado: feedback de imagen
  const [imageError, setImageError] = useState<string | null>(null);

  // Si hay autenticación pendiente, mostrar spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado
  if (!user) {
    router.replace('/admin/login');
    return null;
  }

  // Subir imagen con manejo de errores mejorado
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setImageError(null);
    setLoading(true);
    try {
      const files = Array.from(e.target.files);
      const urls = await Promise.all(
        files.map(f => imageService.uploadImage(f, `products/${Date.now()}_${f.name}`))
      );
      // Convertir URLs a proxy relative para evitar CORS
      const proxyUrls = urls.map(url => ImageUploadService.convertToProxyUrl(url));
      setUploadedImages(proxyUrls);
      setImageError(null);
    } catch (error: any) {
      console.error('Error subiendo imagen:', error);
      // Error amigable
      setImageError('No se pudo subir la imagen. Verifica la configuración de Firebase Storage.');
      alert('Error al subir imagen: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // Extraer producto desde URL usando IA
  const extractFromUrl = async () => {
    if (!affiliateUrl) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: affiliateUrl }),
      });
      
      const data = await res.json();
      
      if (data.product) {
        setTitle(data.product.title || '');
        setDescription(data.product.description || '');
        setPrice(data.product.price?.toString() || '0');
        if (data.product.category?.[0]) setCategory(data.product.category[0]);
        if (data.product.image) {
          // Convertir URL a proxy si es necesario
          const proxyUrl = ImageUploadService.convertToProxyUrl(data.product.image);
          setUploadedImages([proxyUrl]);
        }
        setStep(2);
      } else {
        alert('No se pudo extraer información del producto. Verifica la URL.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error procesando la URL');
    } finally {
      setLoading(false);
    }
  };

  // Detectar proveedor desde la URL de referido
  const detectProvider = (url: string): string => {
    const lower = url.toLowerCase();
    if (lower.includes('mercadolibre') || lower.includes('mercadolibre.com')) return 'mercadolibre';
    if (lower.includes('amazon') || lower.includes('amzn.to')) return 'amazon';
    if (lower.includes('ebay')) return 'ebay';
    if (lower.includes('walmart')) return 'walmart';
    if (lower.includes('target')) return 'target';
    return 'other';
  };

  // Guardar producto - ahora con mejor manejo
  const saveProduct = async () => {
    if (!title || !price) {
      alert('Completa título y precio');
      return;
    }

    if (!affiliateUrl || !affiliateUrl.startsWith('http')) {
      alert('Agrega un link de referido válido (debe empezar con https://)');
      setStep(1);
      return;
    }
    
    setLoading(true);
    try {
      const productData = {
        id: Date.now().toString(),
        title,
        description,
        price: parseFloat(price),
        originalPrice: null,
        category: [category || 'Sin categoría'],
        affiliateLink: affiliateUrl,
        affiliateProvider: detectProvider(affiliateUrl),
        image: uploadedImages[0] || '/placeholder-product.jpg',
        images: uploadedImages.length ? uploadedImages : ['/placeholder-product.jpg'],
        rating: 0,
        reviewCount: 0,
        clickCount: 0,
        seoKeywords: [],
        aiSummary: description.replace(/<[^>]*>/g, ' ').slice(0, 200),
        targetAudience: [],
        features: [],
        pros: [],
        cons: [],
        faq: [],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const errorData = await res.json();
        alert('Error guardando producto: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error guardando producto');
    } finally {
      setLoading(false);
    }
  };

  // Método para obtener HTML limpio de la descripción
  const getDescriptionHtml = (): string => {
    if (!description) {
      return '<em class="text-gray-400">Sin descripción</em>';
    }
    // Si la descripción ya tiene HTML (del Quill), úsala directamente
    // Si es texto plano, envolver en párrafos básicos
    return description;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Agregar Producto</h1>
          <button onClick={logout} className="mt-2 text-sm text-red-600 hover:text-red-800">
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          <span className={`px-4 py-2 rounded-full text-sm ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
            1. Datos
          </span>
          <span className={`px-4 py-2 rounded-full text-sm ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
            2. Imágenes
          </span>
          <span className={`px-4 py-2 rounded-full text-sm ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
            3. Confirmar
          </span>
        </div>

        {/* Mode selector - step 1 */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* URL Mode */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🔗</span> Desde URL
              </h2>
              <input
                type="url"
                value={affiliateUrl}
                onChange={e => setAffiliateUrl(e.target.value)}
                placeholder="https://mercadolibre.com.mx/producto..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={extractFromUrl}
                disabled={!affiliateUrl || loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Extraer con IA'}
              </button>
              <p className="text-xs text-gray-500 mt-2">Amazon, MercadoLibre, eBay, etc.</p>
            </div>

            {/* Manual Mode */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span> Datos Manuales
              </h2>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nombre del producto"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
              />
              
              {/* Rich Text Editor */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción <span className="text-gray-400">(texto enriquecido)</span>
                </label>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  placeholder="Escribe una descripción detallada del producto..."
                  className="min-h-[150px] bg-white rounded-lg"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ color: [] }, { background: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ align: [] }],
                      ['blockquote', 'code-block'],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                />
                <div className="mt-1 text-xs text-gray-500">
                  Usa el editor para formatear texto: negrita, listas, colores, tablas, etc.
                </div>
              </div>

              <div className="flex gap-3 mb-3">
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="Precio"
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg"
                />
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Categoría</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* LINK DE REFERIDO - campo obligatorio para que los visitantes abran el producto en la tienda */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🔗 Link de referido <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={affiliateUrl}
                  onChange={e => setAffiliateUrl(e.target.value)}
                  placeholder="https://mercadolibre.com.mx/producto..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Los visitantes serán llevados a esta URL al hacer clic en "Comprar Ahora".
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Images step */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold mb-4">Imágenes del Producto</h2>
            
            {/* Feedback about image upload status */}
            {imageError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
                <p className="text-red-700">{imageError}</p>
                <p className="text-sm text-red-500 mt-1">
                  Las imágenes no se cargaron por configuración CORS. 
                  Para arreglarlo, ve a Firebase Console → Storage → Settings → CORS
                  y agrega: https://tienda22077--tiendaldg.us-east4.hosted.app
                </p>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="img-upload"
              />
              <label htmlFor="img-upload" className="cursor-pointer">
                <p className="text-gray-500 text-lg">Haz clic para seleccionar imágenes</p>
                <p className="text-gray-400 text-sm mt-2">JPG, PNG, WebP - Máximo 5MB cada una</p>
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className="flex gap-3 flex-wrap mb-6">
                {uploadedImages.map((url, i) => (
                  <div key={i} className="relative w-24 h-24">
                    <img src={url} alt={`Img ${i+1}`} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg">
                ← Atrás
              </button>
              <button onClick={() => setStep(3)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg">
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Confirm step */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold mb-4">Confirmar Producto</h2>
            
            <div className="space-y-4 mb-6">
              <div><strong>Título:</strong> {title || '(sin título)'}</div>
              <div>
                <strong>Precio:</strong> ${price}
              </div>
              <div>
                <strong>Categoría:</strong> {category || 'Sin categoría'}
              </div>
              <div>
                <strong>URL Afiliado:</strong> {affiliateUrl || 'No proporcionada'}
              </div>
              <div>
                <strong>Imágenes:</strong> {uploadedImages.length} subida(s)
                {imageError && (
                  <span className="text-red-500 text-sm ml-2">(error en upload)</span>
                )}
              </div>
              <div>
                <strong>Descripción:</strong>
                <div 
                  className="mt-2 p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap max-h-40 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: getDescriptionHtml() }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg">
                ← Atrás
              </button>
              <button
                onClick={saveProduct}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Guardando...' : '✓ Guardar Producto'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminNewProductPage() {
  return (
    <AdminAuthProvider>
      <ProductForm />
    </AdminAuthProvider>
  );
}