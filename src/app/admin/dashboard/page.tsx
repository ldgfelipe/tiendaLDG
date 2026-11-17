'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/components/AdminAuthWrapper';
import { sampleProducts } from '@/data/sample-products';

function DashboardContent() {
  const { user, loading, logout } = useAdminAuth();
  const router = useRouter();

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // Mostrar loading mientras Firebase verifica
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  // Si no hay usuario, no renderizar
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hola, {user.email?.split('@')[0]}</span>
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
            <p className="text-2xl font-bold text-purple-600">{sampleProducts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm text-gray-600">Clicks</h3>
            <p className="text-2xl font-bold text-emerald-600">1,200</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm text-gray-600">Conversiones</h3>
            <p className="text-2xl font-bold text-indigo-600">86</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm text-gray-600">Ingresos</h3>
            <p className="text-2xl font-bold text-pink-600">$2,340</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/products/new"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-lg text-white text-center hover:opacity-90 transition-colors"
            >
              + Generar Producto con IA
            </a>
            <a
              href="/admin/products"
              className="bg-blue-600 p-4 rounded-lg text-white text-center hover:opacity-90 transition-colors"
            >
              Ver Todos los Productos
            </a>
            <a
              href="/admin/blog"
              className="bg-emerald-600 p-4 rounded-lg text-white text-center hover:opacity-90 transition-colors"
            >
              Blog Automático
            </a>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Productos Recientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-purple-600">${product.price}</span>
                  <a
                    href={`/products/${product.id}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Ver detalles
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminAuthProvider>
      <DashboardContent />
    </AdminAuthProvider>
  );
}