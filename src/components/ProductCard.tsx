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

  const hasAffiliateLink = Boolean(
    product.affiliateLink &&
    product.affiliateLink !== '#' &&
    product.affiliateLink.startsWith('http')
  );

  const handlePurchase = async () => {
    if (!hasAffiliateLink) return;

    setIsLoading(true);
    try {
      // Registrar clic en Firestore (no bloquea la redirección si falla)
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          affiliateUrl: product.affiliateLink,
        }),
      }).catch(() => null);
    } catch (error) {
      console.error('Error registrando clic:', error);
    } finally {
      // Siempre abrir el enlace de referido aunque falle el tracking
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
      setIsLoading(false);
    }
  };

  // Nombre legible del proveedor para mostrar
  const providerLabel =
    product.affiliateProvider === 'mercadolibre'
      ? 'MercadoLibre'
      : product.affiliateProvider?.charAt(0).toUpperCase() + product.affiliateProvider?.slice(1) || 'Tienda';

  return (
    <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${featured ? 'border-2 border-indigo-500' : ''}`}>
      {/* Badge de mejor calificación */}
      {product.rating >= 4.5 && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          ★ Mejor Calificado
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <img
          src={product.images?.[0] || product.image || '/placeholder-product.jpg'}
          alt={product.title}
          className="w-full h-full object-cover"
          loading={featured ? 'eager' : 'lazy'}
          onError={(e) => {
            // Fallback si la imagen no carga
            (e.currentTarget as HTMLImageElement).src = '/placeholder-product.jpg';
          }}
        />
        {featured && (
          <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs">
            Recomendado
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="font-semibold text-gray-900">{providerLabel}</span>
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

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-yellow-500">★</span>
              <span className="text-sm text-gray-600">{(product.rating || 0).toFixed(1)}</span>
              <span className="text-xs text-gray-400">({product.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Descripción SEO */}
        {product.description && (
          <p
            className="text-sm text-gray-600 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: (product.aiSummary || product.description).replace(/<[^>]*>/g, ' ').slice(0, 200),
            }}
          />
        )}

        {/* LINK DE REFERIDO - visible y clickeable */}
        {hasAffiliateLink && (
          <div className="mb-3 p-2 bg-indigo-50 border border-indigo-100 rounded-lg">
            <p className="text-xs text-indigo-700 font-medium mb-1">
              🔗 Enlace de referido a {providerLabel}
            </p>
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePurchase}
              className="text-xs text-indigo-600 hover:text-indigo-800 underline break-all"
            >
              {product.affiliateLink}
            </a>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-2">
          <button
            onClick={handlePurchase}
            disabled={isLoading || !hasAffiliateLink}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Abriendo tienda...' : hasAffiliateLink ? 'Comprar Ahora' : 'Sin enlace'}
          </button>

          <Link
            href={`/product/${product.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center text-sm"
          >
            Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}