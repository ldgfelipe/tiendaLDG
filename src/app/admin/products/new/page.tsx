'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

const CATEGORIES = ['Calzado', 'Ropa', 'Tecnología', 'Hogar', 'Belleza', 'Deportes'];

function ProductForm() {
  // States - sin useAuth para evitar errores de prerender
  const [viewMode, setViewMode] = useState('url');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualPrice, setManualPrice] = useState('0');
  const [manualCategory, setManualCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [modeState, setModeState] = useState('url');
  const router = useRouter();

  // Función para extraer producto de URL (sin depender de useAuth)
  const extractProductInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: affiliateUrl })
      });
      
      const data = await response.json();
      
      if (data && data.product && data.product.title) {
        setProduct({
          id: Date.now().toString(),
          title: data.product.title,
          description: data.product.description || '',
          price: typeof data.product.price === 'number' ? data.product.price : 0,
          originalPrice: data.product.originalPrice,
          category: Array.isArray(data.product.category) ? data.product.category : [data.product.category || 'Sin categoría'],
          affiliateLink: data.product.affiliateLink || affiliateUrl || '',
          affiliateProvider: data.product.affiliateProvider || 'manual',
          image: data.product.image || '/placeholder-product.jpg',
          images: Array.isArray(data.product.images) ? data.product.images : ['/placeholder-product.jpg'],
          rating: typeof data.product.rating === 'number' ? data.product.rating : 4,
          reviewCount: typeof data.product.reviewCount === 'number' ? data.product.reviewCount : 0,
          clickCount: 0,
          seoKeywords: Array.isArray(data.product.seoKeywords) ? data.product.seoKeywords : [],
          aiSummary: data.product.aiSummary || data.product.description || 'Producto agregado',
        });
      } else {
        // Producto manual básico
        setProduct({
          id: Date.now().toString(),
          title: manualTitle || 'Producto nuevo',
          description: manualDesc || 'Producto agregado a tu tienda',
          price: manualPrice ? parseFloat(manualPrice) : 0,
          originalPrice: null,
          category: manualCategory ? [manualCategory] : ['Sin categoría'],
          affiliateLink: affiliateUrl || '',
          affiliateProvider: 'manual',
          image: '/placeholder-product.jpg',
          images: ['/placeholder-product.jpg'],
          rating: 4,
          reviewCount: 0,
          clickCount: 0,
          seoKeywords: ['producto', 'compra'],
          aiSummary: manualDesc || 'Producto agregado manualmente',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback manual
      setProduct({
        id: Date.now().toString(),
        title: manualTitle || 'Producto nuevo',
        description: manualDesc || 'Producto agregado a tu tienda',
        price: manualPrice ? parseFloat(manualPrice) : 0,
        originalPrice: null,
        category: manualCategory ? [manualCategory] : ['Sin categoría'],
        affiliateLink: affiliateUrl || '',
        affiliateProvider: 'manual',
        image: '/placeholder-product.jpg',
        images: ['/placeholder-product.jpg'],
        rating: 4,
        reviewCount: 0,
        clickCount: 0,
        seoKeywords: ['producto', 'compra'],
        aiSummary: manualDesc || 'Producto agregado manualmente',
      });
    } finally {
      setLoading(false);
    }
  };

  // Cambiar modo
  const changeMode = (newMode: string) => {
    setViewMode(newMode);
    setAffiliateUrl('');
    setManualTitle('');
    setManualDesc('');
    setManualPrice('0');
    setManualCategory('');
    setProduct(null);
    setModeState(newMode);
  };

  // Vista previa si hay producto
  if (product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold mb-4">Vista Previa</h1>
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-bold mb-2">{product.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{product.description || 'Sin descripción'}</p>
            <p className="font-medium text-lg">${product.price}</p>
            <p className="text-xs text-gray-500">Categoría: {product.category?.[0] || 'Sin categoría'}</p>
            <button
              onClick={() => setProduct(null)}
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Modificar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modo URL
  if (viewMode === 'url') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">URL de Afiliado</h1>
          <p className="text-gray-500 text-sm mb-6">Pega la URL del producto</p>
          
          <div className="bg-white rounded-lg p-6">
            <input
              type="url"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://www.ejemplo.com/producto"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
              required
            />
            <button
              onClick={extractProductInfo}
              disabled={!affiliateUrl}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg"
            >
              {loading ? 'Procesando con IA...' : 'Extraer Información'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => changeMode('manual')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg"
            >
              ← Cambiar a modo manual
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modo Manual
  if (viewMode === 'manual') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Datos Manuales</h1>
          <form onSubmit={(e) => {
            e.preventDefault();
            changeMode('url');
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Nombre del producto"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                <input
                  type="number"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Seleccionar...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                value={manualDesc}
                onChange={(e) => setManualDesc(e.target.value)}
                rows={3}
                placeholder="Describe las características..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Generar Producto
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => changeMode('url')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg"
            >
              ← Usar URL en su lugar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modo por defecto - selector
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Añadir Producto</h1>

        <div className="bg-white rounded-lg p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">¿Cómo quieres añadir el producto?</h2>
            <p className="text-gray-500 text-sm">Elige el método más conveniente</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="text-3xl font-bold mb-2">🔗</div>
                <h3 className="font-medium">URL de Afiliado</h3>
                <p className="text-sm text-gray-500">Pega cualquier URL y la IA lo completará</p>
              </div>
              <button
                onClick={() => changeMode('url')}
                className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg"
              >
                Empezar
              </button>
            </div>

            <div>
              <div className="p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                <div className="text-3xl font-bold mb-2">📝</div>
                <h3 className="font-medium">Datos Manuales</h3>
                <p className="text-sm text-gray-500">Ingresa la información tú mismo</p>
              </div>
              <button
                onClick={() => changeMode('manual')}
                className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg"
              >
                Empezar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminNewProduct() {
  return <ProductForm />;
}