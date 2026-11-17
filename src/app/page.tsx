import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { FirestoreService } from '@/services/firestore';
import { sampleProducts } from '@/data/sample-products';

export const revalidate = 60; // Revalidar cada 60 segundos

async function getFeaturedProducts(): Promise<Product[]> {
  // Usar productos de ejemplo en desarrollo
  return sampleProducts.map(p => ({
    ...p,
    id: p.id,
    lastUpdated: new Date()
  }));
}

export default async function Home() {
  const products = await getFeaturedProducts();
  
  // Productos con mejor rating
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);
  
  // Productos más populares (mayor clickCount)
  const mostPopular = [...products]
    .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Ropa y Calzado Premium
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Descubre los mejores productos verificados con reseñas auténticas
          </p>
          
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Buscar productos, marcas, características..."
              className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>
      </section>

      {/* Top Rated Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ⭐ Productos Mejor Calificados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Productos con mejores reseñas de clientes verificados
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topRated.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              featured={true}
            />
          ))}
        </div>
      </section>

      {/* Most Popular */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🔥 Más Populares
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mostPopular.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes un producto que recomendar?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Usa nuestro chat de IA para obtener recomendaciones personalizadas
          </p>
          <button className="bg-white text-purple-600 font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">
            Hablar con IA
          </button>
        </div>
      </section>
    </div>
  );
}