// Servicio de SEO para optimización automática
import { SEOMetadata } from '@/types';

export class SEOService {
  private siteName = 'TiendaLDG';
  private siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Generar metadatos SEO para página de producto
  generateProductSEO(
    title: string,
    description: string,
    product: any
  ): SEOMetadata {
    const keywords = this.extractKeywords(title, description, product);
    
    return {
      title: this.optimizeTitle(title, product),
      description: this.optimizeDescription(description, product),
      keywords,
      canonicalUrl: `${this.siteUrl}/product/${product?.id || 'unknown'}`,
      openGraph: {
        title: `${title} - ${this.siteName}`,
        image: product?.image || product?.images?.[0] || '/og-image.jpg',
        type: 'product',
        description: this.optimizeDescription(description, product)
      },
      structuredData: this.generateProductSchema(product)
    };
  }

  // Generar metadatos SEO para artículo de blog
  generateBlogSEO(
    title: string,
    excerpt: string,
    post: any
  ): SEOMetadata {
    const keywords = this.extractBlogKeywords(title, excerpt, post);
    
    return {
      title: this.optimizeTitle(title, post),
      description: this.truncateDescription(excerpt, 155),
      keywords,
      canonicalUrl: `${this.siteUrl}/blog/${post?.slug || 'unknown'}`,
      openGraph: {
        title: `${title} - ${this.siteName}`,
        image: post?.featuredImage || '/og-blog.jpg',
        type: 'article',
        description: this.truncateDescription(excerpt, 155)
      },
      structuredData: this.generateBlogSchema(post)
    };
  }

  // Optimizar título SEO
  optimizeTitle(title: string, product?: any): string {
    // Máximo 60 caracteres
    const baseTitle = title.length > 55 ? title.substring(0, 52) + '...' : title;
    
    if (product?.affiliateProvider) {
      const providerName = product.affiliateProvider.toUpperCase();
      return `${baseTitle} | ${providerName} - ${this.siteName}`;
    }
    
    return `${baseTitle} | ${this.siteName}`;
  }

  // Optimizar descripción SEO
  optimizeDescription(description: string, product?: any): string {
    // Máximo 160 caracteres
    let desc = this.truncateDescription(description, 155);
    
    // Añadir información adicional relevante
    if (product?.price) {
      const price = `$${product.price}`;
      if (!desc.includes(price)) {
        desc = `${desc} Precio: ${price}`;
      }
    }
    
    return desc;
  }

  // Extraer keywords relevantes
  extractKeywords(title: string, description: string, product?: any): string[] {
    const keywords: string[] = [];
    
    // Palabras del título
    const titleWords = title.toLowerCase().split(/\s+/);
    keywords.push(...titleWords.filter(w => w.length > 3));
    
    // Palabras del description
    const descWords = description.toLowerCase().match(/\b\w{4,}\b/g) || [];
    keywords.push(...descWords.slice(0, 10));
    
    // Keywords del producto
    if (product?.seoKeywords) {
      keywords.push(...product.seoKeywords);
    }
    
    if (product?.category) {
      keywords.push(...product.category);
    }
    
    if (product?.affiliateProvider) {
      keywords.push(product.affiliateProvider.toLowerCase());
    }
    
    // Remover duplicados y devolver
    return [...new Set(keywords)].slice(0, 15);
  }

  // Extraer keywords para blog
  extractBlogKeywords(title: string, excerpt: string, post?: any): string[] {
    const keywords: string[] = [];
    
    // Palabras clave principales
    const mainKeywords = ['blog', 'guía', 'recomendación', 'producto', 'opinión'];
    keywords.push(...mainKeywords);
    
    // Palabras del título y excerpt
    const content = `${title} ${excerpt}`.toLowerCase();
    const words = content.match(/\b\w{4,}\b/g) || [];
    keywords.push(...words.slice(0, 10));
    
    // Tags del post
    if (post?.tags) {
      keywords.push(...post.tags);
    }
    
    return [...new Set(keywords)].slice(0, 12);
  }

  // Troncar descripción a longitud óptima
  truncateDescription(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }

  // Generar Schema.org para producto
  generateProductSchema(product: any): any {
    return {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': product?.title || '',
      'image': product?.image || product?.images?.[0] || '',
      'description': product?.description || '',
      'sku': product?.id || '',
      'brand': {
        '@type': 'Brand',
        'name': product?.affiliateProvider || ''
      },
      'offers': {
        '@type': 'Offer',
        'url': product?.affiliateLink || '',
        'priceCurrency': 'USD',
        'price': product?.price || 0,
        'priceValidUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        'availability': 'https://schema.org/InStock',
        'itemCondition': 'https://schema.org/NewCondition'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': product?.rating || 0,
        'reviewCount': product?.reviewCount || 0
      }
    };
  }

  // Generar Schema.org para blog
  generateBlogSchema(post: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': post?.title || '',
      'description': post?.excerpt || '',
      'image': post?.featuredImage || '',
      'author': {
        '@type': 'Person',
        'name': post?.author || 'TiendaLDG'
      },
      'publisher': {
        '@type': 'Organization',
        'name': this.siteName,
        'logo': {
          '@type': 'ImageObject',
          'url': `${this.siteUrl}/favicon.ico`
        }
      },
      'datePublished': post?.publishedAt || new Date().toISOString(),
      'dateModified': post?.updatedAt || new Date().toISOString(),
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${this.siteUrl}/blog/${post?.slug}`
      }
    };
  }

  // Generar sitemap XML
  generateSitemap(posts: any[]): string {
    const urls = posts.map(post => `
      <url>
        <loc>${this.siteUrl}${post.slug}</loc>
        <lastmod>${post.updatedAt || post.publishedAt}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`;
  }

  // Generar robots.txt
  generateRobotsTxt(): string {
    return `# Robots.txt para ${this.siteName}
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /draft/
Allow: /

Sitemap: ${this.siteUrl}/sitemap.xml

# Speed up crawlers
Crawl-delay: 10

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /
`;
  }
}