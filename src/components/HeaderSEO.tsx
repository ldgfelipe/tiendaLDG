import Head from 'next/head';
import { SEOMetadata } from '@/types';

interface HeaderSEOProps {
  metadata: SEOMetadata;
}

export default function HeaderSEO({ metadata }: HeaderSEOProps) {
  return (
    <Head>
      {/* Título SEO */}
      <title>{metadata.title}</title>
      
      {/* Meta descripción */}
      <meta name="description" content={metadata.description} />
      
      {/* Palabras clave */}
      <meta name="keywords" content={metadata.keywords.join(',')} />
      
      {/* Canonical URL */}
      {metadata.canonicalUrl && (
        <link rel="canonical" href={metadata.canonicalUrl} />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta property="og:description" content={metadata.openGraph.description} />
      <meta property="og:image" content={metadata.openGraph.image} />
      <meta property="og:type" content={metadata.openGraph.type} />
      <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
      <meta property="og:site_name" content="TiendaLDG - Referidos de Alta Calidad" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.openGraph.title} />
      <meta name="twitter:description" content={metadata.openGraph.description} />
      <meta name="twitter:image" content={metadata.openGraph.image} />
      
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(metadata.structuredData)
        }}
      />
      
      {/* Preconnect para CDN */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      
      {/* Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet" />
    </Head>
  );
}