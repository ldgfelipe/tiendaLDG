'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

export default function AdminNewProduct() {
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();

  const extractProductInfo = async () => {
    if (!affiliateUrl) return;

    setLoading(true);
    try {
      const response = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: affiliateUrl })
      });
      
      const data = await response.json();
      setProduct(data.product || null);
    } catch (error) {
      console.error('Error scraping product:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async () => {
    if (!product) return;

    try {
      await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Generar Producto con IA</h1>

        {!product ? (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del Producto Afiliado
              </label>
              <input
                type="url"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="https://amzn.to/xxx o URL afiliada"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Pegue la URL de cualquier sitio de afiliados (Amazon, ShareASale, etc.)
              </p>
            </div>

            <button
              onClick={extractProductInfo}
              disabled={loading || !affiliateUrl}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Analizando con IA...' : 'Extraer Información'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Vista Previa del Producto</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  value={product.title}
                  onChange={(e) => setProduct({ ...product, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Precio</label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoría</label>
                  <select
                    value={product.category[0] || ''}
                    onChange={(e) => setProduct({ ...product, category: [e.target.value] })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Calzado">Calzado</option>
                    <option value="Ropa">Ropa</option>
                    <option value="Tecnología">Tecnología</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Precio de afiliado</label>
                <input
                  type="url"
                  value={product.affiliateLink}
                  onChange={(e) => setProduct({ ...product, affiliateLink: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setProduct(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg"
              >
                Reanalizar
              </button>
              <button
                onClick={saveProduct}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Guardar Producto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}