'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/components/AdminAuthWrapper';
import { Product } from '@/types';

function DashboardContent() {
  const { user, loading, logout } = useAdminAuth();
  const router = useRouter();

  // Redirigir si no está autenticado (hooks en mismo orden)
  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // State en orden consistente
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos - useEffect al final
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        // En producción, traería desde Firebase/Firestore API
        // Por ahora: datos mock o vacíos
        const mockProducts: any[] = [
          {
            id: '1',
            title: 'Producto en carga',
            description: 'El primer producto se está agregando...',
            price: 0,
            originalPrice: null,
            category: ['Sin categoría'],
            affiliateLink: '',
            affiliateProvider: 'manual',
            image: '/placeholder-product.jpg',
            images: ['/placeholder-product.jpg'],
            rating: 0,
            reviewCount: 0,
            clickCount: 0,
            seoKeywords: [],
            aiSummary: 'Producto recién agregado al catálogo',
          }
        ];
        setProducts(mockProducts);
        setError(null);
      } catch (err) {
        console.error('Error cargando productos:', err);
        setProducts([]);
        setError('Error al cargar productos. Inténtalo de nuevo.');
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []); // Dependency array vacío - llamado solo una vez

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hola, {user?.email?.split('@')[0] || 'Admin'}</span>
              <button
                onClick={() => logout()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm text-gray-600">Productos</h3>
            <p className="text-2xl font-bold text-purple-600">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm text-gray-600">Clicks</h3>
            <p className="text-2xl font-bold text-emerald-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm text-gray-600">Conversiones</h3>
            <p className="text-2xl font-bold text-indigo-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm text-gray-600">Ingresos</h3>
            <p className="text-2xl font-bold text-pink-600">$0</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <a
            href="/admin/products/new"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-lg text-white text-center hover:opacity-90 transition-colors"
          >
            + Agregar Nuevo Producto
          </a>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Productos en Catálogo</h2>

          {/* Loading State */}
          {loadingProducts && !error ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando productos...</p>
            </div>
          ) : null}

          {/* Error State */}
          {loadingProducts && error ? (
            <div className="p-6 bg-red-50 rounded-lg text-red-700">
              <p className="font-medium">{error}</p>
            </div>
          ) : null}

          {/* Empty State */}
          {!loadingProducts && products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay productos en el catálogo</p>
              <p className="text-sm text-gray-400">Sé el primero en agregar un producto</p>
            </div>
          ) : null}

          {/* Products List */}
          {!loadingProducts && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <img
                      src={product.image || '/placeholder-product.jpg'}
                      alt={product.title || 'Producto'}
                      className="max-w-full max-h-32 object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{product.title || 'Sin título'}</h3>
                  <p className="text-sm text-gray-500 mb-3">{product.description || 'Sin descripción'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-purple-600">${product.price}</span>
                    <div className="text-xs text-gray-500">
                      {product.rating ? `${product.rating.toFixed(1)}★` : 'Sin rating'}
                      {product.reviewCount ? ` (${product.reviewCount} rev)` : ''}
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <button
                      onClick={() => router.push(`/admin/products/new/${product.id}`)}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-sm text-red-600 hover:text-red-900 ml-2"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No hay productos en el catálogo</p>
              <p className="text-sm text-gray-400">Sé el primero en agregar un producto</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <>{/* Wrapper necesario para JSX */}</>
  );
}