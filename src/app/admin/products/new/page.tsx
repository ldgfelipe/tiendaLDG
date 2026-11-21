'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { ImageUploadService } from '@/lib/firebase-client';
import { AdminAuthProvider, useAdminAuth } from '@/components/AdminAuthWrapper';

const CATEGORIES = ['Calzado', 'Ropa', 'Tecnología', 'Hogar', 'Belleza', 'Deportes'];

const imageUploadService = new ImageUploadService();

function ProductForm() {
  // Auth para proteger la página
  const { user, loading: authLoading, logout } = useAdminAuth();
  const [viewMode, setViewMode] = useState<'url' | 'manual' | 'preview'>('url');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualPrice, setManualPrice] = useState('0');
  const [manualCategory, setManualCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const router = useRouter();

  // Redirigir si no está autenticado
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center"><p>Redirigiendo al login...</p></div>;
  }

  // Subir imágenes a Firebase Storage
  const handleImageUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    setPreviewImages(fileArray);
    setUploading(true);

    try {
      const uploadPromises = fileArray.map((file, index) => {
        const path = `products/${Date.now()}_${index}_${file.name.replace(/\s+/g, '_')}`;
        return imageUploadService.uploadImage(file, path);
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImageUrls(urls);
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      alert('Error al subir las imágenes. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  // Eliminar imagen
  const removeImage = async (index: number) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    const newUrls = uploadedImageUrls.filter((_, i) => i !== index);
    
    setPreviewImages(newPreviews);
    setUploadedImageUrls(newUrls);
    
    // También eliminar de Firebase Storage
    if (uploadedImageUrls[index]) {
      try {
        await imageUploadService.deleteImage(uploadedImageUrls[index]);
      } catch (error) {
        console.error('Error eliminando imagen:', error);
      }
    }
  };

  // Función para extraer producto de URL
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
          image: data.product.image || uploadedImageUrls[0] || '/placeholder-product.jpg',
          images: data.product.images?.length ? data.product.images : (uploadedImageUrls.length ? uploadedImageUrls : ['/placeholder-product.jpg']),
          rating: typeof data.product.rating === 'number' ? data.product.rating : 4,
          reviewCount: typeof data.product.reviewCount === 'number' ? data.product.reviewCount : 0,
          clickCount: 0,
          seoKeywords: Array.isArray(data.product.seoKeywords) ? data.product.seoKeywords : [],
          aiSummary: data.product.aiSummary || data.product.description || 'Producto agregado',
        });
      } else {
        // Producto manual básico con imágenes subidas
        createManualProduct();
      }
    } catch (error) {
      console.error('Error:', error);
      createManualProduct();
    } finally {
      setLoading(false);
    }
  };

  // Crear producto con datos manuales + imágenes subidas
  const createManualProduct = () => {
    setProduct({
      id: Date.now().toString(),
      title: manualTitle || 'Producto nuevo',
      description: manualDesc || 'Producto agregado a tu tienda',
      price: manualPrice ? parseFloat(manualPrice) : 0,
      originalPrice: null,
      category: manualCategory ? [manualCategory] : ['Sin categoría'],
      affiliateLink: affiliateUrl || '',
      affiliateProvider: 'manual',
      image: uploadedImageUrls[0] || '/placeholder-product.jpg',
      images: uploadedImageUrls.length ? uploadedImageUrls : ['/placeholder-product.jpg'],
      rating: 4,
      reviewCount: 0,
      clickCount: 0,
      seoKeywords: ['producto', 'compra'],
      aiSummary: manualDesc || 'Producto agregado manualmente',
    });
  };

  // Guardar producto final
  const saveProduct = async () => {
    if (!product) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Producto guardado correctamente');
        router.push('/admin/products');
      } else {
        alert('Error al guardar: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar modo
  const changeMode = (newMode: 'url' | 'manual' | 'preview') => {
    setViewMode(newMode);
    if (newMode !== 'preview') {
      setAffiliateUrl('');
      setManualTitle('');
      setManualDesc('');
      setManualPrice('0');
      setManualCategory('');
      setProduct(null);
      setPreviewImages([]);
      setUploadedImageUrls([]);
    }
  };

  // Vista previa del producto
  if (viewMode === 'preview' || product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header con navegación */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Vista Previa del Producto</h1>
            <button
              onClick={() => changeMode('url')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg"
            >
              ← Modificar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Imágenes */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-medium mb-4">Imágenes del Producto</h3>
              <div className="space-y-4">
                {uploadedImageUrls.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {uploadedImageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`Producto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Sin imágenes</span>
                  </div>
                )}
              </div>
              
              {/* Upload zone */}
              <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <p className="text-gray-600">Haz clic o arrastra para agregar imágenes</p>
                  <p className="text-sm text-gray-400">JPG, PNG, WebP - Máx 5MB cada una</p>
                </label>
              </div>
            </div>

            {/* Formulario de datos */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-medium mb-4">Datos del Producto</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                saveProduct();
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                  <input
                    type="text"
                    value={product.title}
                    onChange={(e) => setProduct({ ...product, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                    <select
                      value={product.category[0] || ''}
                      onChange={(e) => setProduct({ ...product, category: [e.target.value] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar...</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL de Afiliado *</label>
                  <input
                    type="url"
                    value={product.affiliateLink}
                    onChange={(e) => setProduct({ ...product, affiliateLink: e.target.value })}
                    placeholder="https://www.ejemplo.com/producto-afiliado"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => changeMode('url')}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : 'Guardar Producto'}
                  </button>
                </div>
              </form>
            </div>
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
          <p className="text-gray-500 text-sm mb-6">Pega la URL del producto (Amazon, MercadoLibre, eBay, etc.)</p>
          
          <div className="bg-white rounded-lg p-6 mb-6">
            <input
              type="url"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://www.ejemplo.com/producto"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
              required
            />
            
            {/* Upload de imágenes opcional */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes (opcional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              {previewImages.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {previewImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={extractProductInfo}
              disabled={!affiliateUrl || loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Procesando con IA...' : 'Extraer y Generar'}
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
          
          <div className="bg-white rounded-lg p-6 mb-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              createManualProduct();
              changeMode('preview');
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                  <input
                    type="number"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                    min="0"
                    step="0.01"
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe las características..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de Afiliado</label>
                <input
                  type="url"
                  value={affiliateUrl}
                  onChange={(e) => setAffiliateUrl(e.target.value)}
                  placeholder="https://www.ejemplo.com/producto"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes (opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                {previewImages.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {previewImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Generar Producto
              </button>
            </form>
          </div>

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
  return (
    <AdminAuthProvider>
      <ProductForm />
    </AdminAuthProvider>
  );
}