import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import BlogCard from '@/components/BlogCard';
import SearchBar from '@/components/SearchBar';
import AIChatBot from '@/components/AIChatBot';
import HeroSection from '@/components/HeroSection';
import { FirestoreService } from '@/services/firestore';
import { sampleProducts } from '@/data/sample-products';

async function getFeaturedProducts(): Promise<Product[]> {
  // Usar productos de ejemplo en desarrollo
  return sampleProducts.map(p => ({
    ...p,
    id: p.id,
    lastUpdated: new Date()
  }));
}

async function getFeaturedBlogPosts(): Promise<any[]> {
  const firestoreService = new FirestoreService();
  return [];
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const featuredPosts = await getFeaturedBlogPosts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <p className="text-gray-600">Productos Verificados</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">10K+</div>
              <p className="text-gray-600">Clientes Satisfechos</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
              <p className="text-gray-600">Tasa de Comisión</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">24/7</div>
              <p className="text-gray-600">Soporte AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ✨ Productos Recomendados por IA
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Todos los productos pasan por un proceso de análisis de IA para garantizar la mejor calidad
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              featured={index < 3}
            />
          ))}
        </div>
      </section>

      {/* Blog destacado */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">📚 Guías y Recomendaciones</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Artículos creados por IA para ayudarte a tomar mejores decisiones
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Próximamente contenido del blog...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI ChatBot */}
      <AIChatBot products={featuredProducts} category="ropa-y-calzado" />
    </div>
  );
}