'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { AdminAuthProvider, useAdminAuth } from '@/components/AdminAuthWrapper';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onDelete: (id: string) => void;
}

function ProductTable({ products, loading, onDelete }: ProductTableProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay productos aún.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <span className="font-medium text-gray-900">{product.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 font-medium">${product.price}</td>
              <td className="px-4 py-3">{product.category?.[0] || '-'}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activo
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button 
                  onClick={() => onDelete(product.id)}
                  className="text-red-600 hover:text-red-900 font-medium text-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Aquí iría la llamada a Firebase Firestore
        // Por ahora usamos datos de ejemplo
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        });
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
            <button
              onClick={() => router.push('/admin/products/new')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              + Nuevo Producto
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <ProductTable 
          products={products}
          loading={loading}
          onDelete={handleDelete}
        />
      </section>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminAuthProvider>
      <ProductsContent />
    </AdminAuthProvider>
  );
}