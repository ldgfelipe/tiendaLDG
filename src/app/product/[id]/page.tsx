import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { productFirestore } from '@/lib/firebase-admin';
import AffiliateButton from '@/components/AffiliateButton';

export const dynamic = 'force-dynamic';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await productFirestore.getById(id);
    return product as Product | null;
  } catch (error) {
    console.error('Error cargando producto:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const hasAffiliateLink = Boolean(
    product.affiliateLink &&
    product.affiliateLink !== '#' &&
    product.affiliateLink.startsWith('http')
  );

  const providerLabel =
    product.affiliateProvider === 'mercadolibre'
      ? 'MercadoLibre'
      : product.affiliateProvider?.charAt(0).toUpperCase() + product.affiliateProvider?.slice(1) || 'Tienda';

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-indigo-600">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-indigo-600">Productos</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Imagen */}
            <div className="bg-gray-100 rounded-lg aspect-square overflow-hidden flex items-center justify-center">
              <img
                src={product.images?.[0] || product.image || '/placeholder-product.jpg'}
                alt={product.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/placeholder-product.jpg';
                }}
              />
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <span className="font-semibold text-gray-900">{providerLabel}</span>
                <span>•</span>
                <span>{product.category?.join(' / ') || 'Producto'}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

              {/* Precio */}
              <div className="flex items-center gap-3 mb-4">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                )}
                <span className="text-4xl font-bold text-indigo-600">${product.price}</span>
              </div>

              {product.reviewCount > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="text-sm text-gray-600">
                    {(product.rating || 0).toFixed(1)} ({product.reviewCount} reseñas)
                  </span>
                </div>
              )}

              {/* LINK DE REFERIDO - lugar principal */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-5 mb-6">
                <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🔗 Comprar en {providerLabel}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Serás redirigido a la tienda original para completar tu compra.
                </p>
                {hasAffiliateLink ? (
                  <>
                    <AffiliateButton
                      productId={product.id}
                      affiliateUrl={product.affiliateLink}
                      provider={providerLabel}
                    />
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-3 text-xs text-indigo-600 hover:text-indigo-800 underline break-all"
                    >
                      {product.affiliateLink}
                    </a>
                  </>
                ) : (
                  <p className="text-sm text-red-600">
                    Este producto aún no tiene un enlace de referido configurado.
                  </p>
                )}
              </div>

              {/* Descripción */}
              {product.description && (
                <div className="prose prose-sm max-w-none text-gray-700">
                  <h3 className="font-bold text-gray-900 mb-2">Descripción</h3>
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              )}
            </div>
          </div>

          {/* Características adicionales */}
          {(product.features?.length || product.pros?.length || product.faq?.length) ? (
            <div className="border-t px-6 md:px-8 py-6">
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Características</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-indigo-600">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.faq && product.faq.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Preguntas Frecuentes</h3>
                  <div className="space-y-3">
                    {product.faq.map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900">{item.question}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-6 text-center">
          <Link href="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Volver a todos los productos
          </Link>
        </div>
      </div>
    </div>
  );
}