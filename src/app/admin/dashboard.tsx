// Dashboard de administración - Vista previa
'use client';

import { useState, useEffect } from 'react';
import { Product, BlogPost } from '@/types';
import { FirestoreService } from '@/services/firestore';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Cargar datos desde Firestore
    const firestoreService = new FirestoreService();
    
    // Cargar productos
    const productsData = await firestoreService.getAllProducts();
    setProducts(productsData || []);
    
    // Cargar posts
    const postsData = await firestoreService.getAllBlogPosts({ published: true });
    setPosts(postsData || []);
    
    // Cargar analytics
    const analyticsData = await firestoreService.getAnalytics();
    setAnalytics(analyticsData);
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">📊 Dashboard de Administración</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Productos" 
          value={products.length} 
          change="+12%" 
          icon="📦"
        />
        <StatCard 
          title="Clicks Afiliados" 
          value={analytics?.affiliateClicks || 0} 
          change="+8%" 
          icon="👆"
        />
        <StatCard 
          title="Blog Publicado" 
          value={posts.length} 
          change="+5%" 
          icon="📝"
        />
        <StatCard 
          title="Ingresos Estimados" 
          value={`$${analytics?.revenue || 0}`} 
          change="+15%" 
          icon="💰"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-full">
          Productos ({products.length})
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-full">
          Blog ({posts.length})
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-full">
          Analytics
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Últimos productos</h2>
          <div className="space-y-4">
            {products.slice(0, 5).map(product => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
function StatCard({ title, value, change, icon }: any) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-green-600">{change}</p>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100">
      <img 
        src={product.image || '/placeholder.png'} 
        alt={product.title}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h3 className="font-medium">{product.title}</h3>
        <p className="text-sm text-gray-500">
          ${product.price} • {product.affiliateProvider || 'N/A'}
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium">{product.clickCount || 0} clicks</p>
        <button className="text-sm text-indigo-600 hover:underline">
          Ver detalles
        </button>
      </div>
    </div>
  );
}