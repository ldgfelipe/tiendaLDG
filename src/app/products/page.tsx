import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { productFirestore } from '@/lib/firebase-admin';

interface ProductPageProps {
  searchParams?: {
    category?: string;
    search?: string;
    sort?: string;
  };
}

export const dynamic = 'force-dynamic'; // Cargar productos guardados en cada petición

async function getProducts(): Promise<Product[]> {
  try {
    const products = await productFirestore.getAll();
    return products as Product[];
  } catch (error) {
    console.error('Error cargando productos desde Firestore:', error);
    return [];
  }
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
  let products = await getProducts();

  // Filtrar por categoría si se proporciona
  if (searchParams?.category) {
    products = products.filter(p =>
      p.category?.some(c => c.toLowerCase() === searchParams.category!.toLowerCase())
    );
  }

  // Filtrar por búsqueda si se proporciona
  if (searchParams?.search) {
    const search = searchParams.search.toLowerCase();
    products = products.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search) ||
      p.seoKeywords?.some(k => k.toLowerCase().includes(search))
    );
  }

  // Ordenar
  if (searchParams?.sort === 'price-asc') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (searchParams?.sort === 'price-desc') {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (searchParams?.sort === 'rating') {
    products = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Obtener categorías únicas de los productos guardados
  const categories = Array.from(
    new Set(products.flatMap(p => p.category || []))
  );

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
      {categories.length > 0 && (
        <div className="flex gap-4 mb-6 flex-wrap">
          <a
            href="/products"
            className="px-4 py-2 bg-indigo-600 text-white rounded-full"
          >
            Todos
          </a>
          {categories.map(cat => (
            <a
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 border rounded-full hover:bg-gray-50 ${
                searchParams?.category === cat
                  ? 'bg-indigo-100 border-indigo-600 text-indigo-700'
                  : 'border-gray-300'
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      )}

      {/* Grid de productos */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 mb-4">
            {searchParams?.category || searchParams?.search
              ? 'No se encontraron productos con esos filtros'
              : 'Aún no hay productos disponibles'}
          </p>
          <a
            href="/admin/products/new"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full"
          >
            Agregar un producto
          </a>
        </div>
      )}
    </div>
  );
}