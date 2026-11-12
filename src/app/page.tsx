import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import BlogCard from '@/components/BlogCard';
import SearchBar from '@/components/SearchBar';
import AIChatBot from '@/components/AIChatBot';
import { FirestoreService } from '@/services/firestore';

async function getFeaturedProducts(): Promise<Product[]> {
  const firestoreService = new FirestoreService();
  // En producción, esto vendría de Firestore
  return [];
}

async function getFeaturedBlogPosts(): Promise<any[]> {
  const firestoreService = new FirestoreService();
  return [];
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const featuredPosts = await getFeaturedBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <div className="inline-block bg-gradient-to-r from-indigo-600 to-emerald-600 px-4 py-2 rounded-full mb-6">
          <span className="text-white text-sm font-semibold">
            ✅ Recomendaciones verificadas • Envíos gratis • Devolución garantizada
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            Ropa y Calzado Premium
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Descubre los mejores productos de moda con recomendaciones basadas en IA. 
          Calidad garantizada y precios optimizados para ti.
        </p>

        {/* Buscador inteligente */}
        <SearchBar showSuggestions={true} />
      </section>

      {/* Productos destacados */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
          <span>✨ Productos AI</span>
          <span className="text-indigo-600">(Recomendados por IA)</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
              featured={index < 3}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Cargando productos recomendados...</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog destacado */}
      <section className="mb-20 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">📚 Guías y Recomendaciones</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} featured={index < 3} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Próximamente contenido del blog...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}