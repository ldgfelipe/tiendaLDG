import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';

interface ProductPageProps {
  searchParams?: {
    category?: string;
    search?: string;
    sort?: string;
  };
}

export default function ProductPage({ searchParams }: ProductPageProps) {
  // En producción, veniría de Firestore
  const products: Product[] = [];
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Productos Premium
        </h1>
        <p className="text-lg text-gray-600">
          Descubre los mejores productos de referidos con precios optimizados
        </p>
      </header>

      {/* Buscador */}
      <div className="mb-8">
        <SearchBar placeholder="Busca por nombre, marca o característica..." />
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-full">
          Todos
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
          Ropa
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
          Calzado
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
          Accesorios
        </button>
      </div>

      {/* Grid de productos */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No se encontraron productos</p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full">
            Ver todos los productos
          </button>
        </div>
      )}

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center mt-12 gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
            Anterior
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-full">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50">
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}