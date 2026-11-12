import { BlogPost } from '@/types';
import BlogCard from '@/components/BlogCard';

export default function BlogPage() {
  // En producción, veniría de Firestore
  const posts: BlogPost[] = [];
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Blog de TiendaLDG
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Guías, comparativas y recomendaciones de productos afiliados 
          generadas con inteligencia artificial
        </p>
      </header>

      {/* Categorías */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {['Guías', 'Comparativas', 'Reseñas', 'Tendencias', 'Trucos'].map((cat) => (
          <button key={cat} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 mb-4">Próximamente contenido del blog...</p>
            <div className="animate-pulse">
              <div className="h-4 w-64 bg-gray-300 rounded mx-auto mb-4" />
              <div className="h-4 w-full bg-gray-300 rounded mb-2" />
              <div className="h-4 w-5/6 bg-gray-300 rounded" />
            </div>
          </div>
        )}
      </div>

      {/* Newsletter */}
      <section className="mt-16 bg-indigo-600 text-white rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          ¿Quieres más recomendaciones?
        </h2>
        <p className="mb-6 max-w-md mx-auto">
          Suscríbete a nuestro newsletter y recibe las mejores ofertas directamente en tu email.
        </p>
        <form className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Tu email..."
            className="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none"
          />
          <button type="submit" className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold hover:opacity-90 transition-colors">
            Suscribirse
          </button>
        </form>
      </section>
    </div>
  );
}