'use client';

import Link from 'next/link';
import { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Imagen destacada */}
      <div className="relative">
        <img
          src={post.featuredImage || '/placeholder-blog.jpg'}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            {post.category}
          </span>
          {post.aiGenerated && (
            <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
              AI
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Título */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta información */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>por {post.author}</span>
            <span>•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString('es-ES')}</span>
            <span>•</span>
            <span>{post.readTime} min</span>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            Leer artículo →
          </Link>
        </div>
      </div>
    </article>
  );
}