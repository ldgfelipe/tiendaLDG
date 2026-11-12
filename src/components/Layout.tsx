'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HeaderSEO from './HeaderSEO';
import { SEOMetadata } from '@/types';

interface LayoutProps {
  children: ReactNode;
  metadata?: SEOMetadata;
}

const navigation = [
  { name: 'Inicio', href: '/', category: 'home' },
  { name: 'Productos', href: '/products', category: 'productos' },
  { name: 'Blog', href: '/blog', category: 'blog' },
  { name: 'Guías', href: '/guides', category: 'guías' },
  { name: 'Contacto', href: '/contact', category: 'contacto' }
];

export default function Layout({ children, metadata }: LayoutProps) {
  const pathname = usePathname();

  const defaultMetadata: SEOMetadata = {
    title: 'TiendaLDG - Referidos Premium de Alta Calidad',
    description: 'Descubre los mejores productos de referidos verificados. Recomendaciones de IA, precios optimizados y enlaces seguros.',
    keywords: ['referidos premium', 'productos de calidad', 'afiliados', 'ofertas verdaderas', 'recomendaciones IA'],
    canonicalUrl: typeof window !== 'undefined' ? window.location.href : '',
    openGraph: {
      title: 'TiendaLDG - Referidos Premium de Alta Calidad',
      description: 'Descubre los mejores productos de referidos verificados. Recomendaciones de IA, precios optimizados y enlaces seguros.',
      image: '/og-image.jpg',
      type: 'website'
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "TiendaLDG",
      "url": typeof window !== 'undefined' ? window.location.origin : ''
    }
  };

  const seoMetadata = metadata || defaultMetadata;

  return (
    <>
      <HeaderSEO metadata={seoMetadata} />
      
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 right-1/2 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-30" />
        <div className="absolute -bottom-1/2 left-1/2 w-96 h-96 bg-emerald-200 rounded-full filter blur-3xl opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-20" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">LDG</span>
              </div>
              <span className="hidden md:block text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                TiendaLDG
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l-1.35 9a2 2 0 01-1.99 1.5H9a2 2 0 01-1.99-1.5L6 13H3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">TiendaLDG</h3>
              <p className="text-sm text-gray-400">
                Productos de referidos de alta calidad recomendados por IA.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Productos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="hover:text-white">Todos los productos</Link></li>
                <li><Link href="/products/tecnologia" className="hover:text-white">Tecnología</Link></li>
                <li><Link href="/products/fitness" className="hover:text-white">Fitness</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Blog</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white">Artículos</Link></li>
                <li><Link href="/guides" className="hover:text-white">Guías</Link></li>
                <li><Link href="/comparison" className="hover:text-white">Comparativas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terminos" className="hover:text-white">Términos</Link></li>
                <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
                <li><Link href="/afiliados" className="hover:text-white">Política de afiliados</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} TiendaLDG. Todos los derechos reservados.</p>
            <p className="mt-1">
              Enlaces de afiliados | Este sitio puede ganar comisiones sin costo adicional para ti
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}