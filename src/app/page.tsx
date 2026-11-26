import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { productFirestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic'; // Cargar productos guardados en cada petición

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await productFirestore.getAll();
    return products as Product[];
  } catch (error) {
    console.error('Error cargando productos desde Firestore:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  // Productos con mejor rating (top 6)
  const topRated = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  // Productos más populares (mayor clickCount)
  const mostPopular = [...products]
    .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    .slice(0, 6);

  const hasProducts = products.length > 0;

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

      {!hasProducts ? (
        /* Empty state - sin productos guardados */
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-xl shadow-sm p-12 max-w-2xl mx-auto">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Aún no hay productos
            </h2>
            <p className="text-gray-600 mb-6">
              Los productos que agregues desde el panel de administración aparecerán aquí.
            </p>
            <a
              href="/admin/products/new"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full"
            >
              Agregar el primer producto
            </a>
          </div>
        </section>
      ) : (
        <>
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
        </>
      )}

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