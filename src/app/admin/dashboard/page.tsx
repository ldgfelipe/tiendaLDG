'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/components/AdminAuthWrapper';

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAdminAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Redirigir si no autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/admin/login');
    }
  }, [user, authLoading, router]);

  // Spinner de autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // No autenticado - mostrar mensaje
  if (!user) {
    return null;
  }

  // Dashboard principal
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Hola, {user.email?.split('@')[0]}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Productos</p>
            <p className="text-2xl font-bold text-purple-600">{products.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Clicks</p>
            <p className="text-2xl font-bold text-emerald-600">0</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Conversiones</p>
            <p className="text-2xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Ingresos</p>
            <p className="text-2xl font-bold text-pink-600">$0</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mb-8">
          <a
            href="/admin/products/new"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            + Agregar Producto
          </a>
          <a
            href="/admin/settings/ai-configuration"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            ⚙️ Configurar IA
          </a>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Catálogo de Productos</h2>
          
          {loadingProducts ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-500">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No hay productos</p>
              <p className="text-gray-400 text-sm mb-4">Agrega tu primer producto desde arriba</p>
              <a
                href="/admin/products/new"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
              >
                Agregar Producto
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <div key={product.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-purple-600">${product.price}</span>
                      <span className="text-xs text-gray-400">{product.category[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}