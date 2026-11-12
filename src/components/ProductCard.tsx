'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { AffiliateService } from '@/services/affiliate-service';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const affiliateService = new AffiliateService();

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // Registrar clic en Firestore
      const response = await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      });
      
      // Redirigir al enlace de afiliado
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${featured ? 'border-2 border-indigo-500' : ''}`}>
      {/* Badge de mejor calificación */}
      {product.rating >= 4.5 && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          ★ Mejor Calificado
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative aspect-[4/3]">
        <img
          src={product.images?.[0] || product.image || '/placeholder-product.jpg'}
          alt={product.title}
          className="w-full h-full object-cover"
          loading={featured ? 'eager' : 'lazy'}
        />
        {featured && (
          <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs">
            Recomendado AI
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="font-semibold text-gray-900">{product.affiliateProvider}</span>
          <span>•</span>
          <span>{product.category?.[0] || 'Producto'}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Precio y rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${affiliateService.formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-indigo-600">
              ${affiliateService.formatPrice(product.price)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-yellow-500">★</span>
            <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Descripción SEO */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {product.aiSummary || product.description}
        </p>

        {/* Botones */}
        <div className="flex gap-2">
          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Redirigiendo...' : 'Comprar Ahora'}
          </button>
          
          <Link
            href={`/product/${product.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center text-sm"
          >
            Detalles
          </Link>
        </div>

        {/* Link de afiliado (solo visible en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded block truncate">
              {product.affiliateLink.substring(0, 50)}...
            </code>
          </div>
        )}
      </div>
    </div>
  );
}