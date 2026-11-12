// Servicio de scraping para extraer información de productos afiliados
import { Product } from '@/types';

export class ProductScraper {
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  // Extraer información de cualquier URL afiliada
  async extractProductInfo(url: string): Promise<any> {
    try {
      // Determinar el tipo de sitio
      const siteType = this.detectSiteType(url);
      
      // Usar puppeteer o cheerio dependiendo del sitio
      switch (siteType) {
        case 'amazon':
          return await this.scrapeAmazon(url);
        case 'ebay':
          return await this.scrapeEbay(url);
        case 'walmart':
          return await this.scrapeWalmart(url);
        case 'shareasale':
          return await this.scrapeGeneric(url);
        default:
          return await this.scrapeGeneric(url);
      }
    } catch (error) {
      console.error('Error scraping product:', error);
      return null;
    }
  }

  // Detectar tipo de sitio
  detectSiteType(url: string): string {
    if (url.includes('amazon.')) return 'amazon';
    if (url.includes('ebay.')) return 'ebay';
    if (url.includes('walmart.')) return 'walmart';
    if (url.includes('shareasale.com')) return 'shareasale';
    if (url.includes('clickbank.')) return 'clickbank';
    if (url.includes('cj.com')) return 'cj';
    return 'generic';
  }

  // Scraping específico para Amazon
  async scrapeAmazon(url: string): Promise<any> {
    // Nota: Este es un ejemplo. En producción necesitarías:
    // 1. Puppeteer o Playwright para scraping
    // 2. API oficial de Amazon Product Advertising
    // 3. Servidor proxy para evitar bloqueos
    
    const response = await fetch('/api/scrape/amazon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    return await response.json();
  }

  // Scraping genérico
  async scrapeGeneric(url: string): Promise<any> {
    // Usar método de extracción genérica
    const response = await fetch('/api/scrape-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, provider: 'generic' })
    });

    return await response.json();
  }

  // Scraping para eBay
  async scrapeEbay(url: string): Promise<any> {
    const response = await fetch('/api/scrape/ebay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    return await response.json();
  }

  // Scraping para Walmart
  async scrapeWalmart(url: string): Promise<any> {
    const response = await fetch('/api/scrape/walmart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    return await response.json();
  }

  // Parsear respuesta del scraper
  parseProductData(data: any): Omit<Product, 'id' | 'lastUpdated'> {
    return {
      title: this.extractTitle(data),
      description: this.extractDescription(data),
      price: parseFloat(this.extractPrice(data)) || 0,
      originalPrice: parseFloat(this.extractOriginalPrice(data)) || undefined,
      affiliateLink: data.url || data.originalUrl,
      image: this.extractMainImage(data),
      images: this.extractAllImages(data),
      category: this.extractCategories(data),
      rating: parseFloat(this.extractRating(data)) || 0,
      reviewCount: parseInt(this.extractReviewCount(data)) || 0,
      affiliateProvider: this.extractProvider(data.url || data.originalUrl),
      commission: this.calculateCommission(data),
      seoKeywords: [],
      targetAudience: this.extractTargetAudience(data),
      features: this.extractFeatures(data),
      pros: [],
      cons: []
    };
  }

  extractTitle(data: any): string {
    return data.title || data.name || data.productName || 'Producto sin título';
  }

  extractDescription(data: any): string {
    return data.description || data.productDescription || data.shortDescription || '';
  }

  extractPrice(data: any): string {
    if (typeof data.price === 'number') return data.price.toString();
    
    const priceMatch = data.price?.match(/\$?(\d+(?:\.\d+)?)/);
    return priceMatch?.[1] || '0';
  }

  extractOriginalPrice(data: any): string {
    if (typeof data.originalPrice === 'number') return data.originalPrice.toString();
    
    const priceMatch = data.originalPrice?.match(/\$?(\d+(?:\.\d+)?)/);
    return priceMatch?.[1];
  }

  extractMainImage(data: any): string {
    return data.image || data.mainImage || data.images?.[0] || '/placeholder-product.jpg';
  }

  extractAllImages(data: any): string[] {
    return data.images || data.allImages || [this.extractMainImage(data)];
  }

  extractCategories(data: any): string[] {
    const categories = data.categories || data.category || data.productType || [];
    return Array.isArray(categories) ? categories : [categories];
  }

  extractRating(data: any): string {
    return data.rating?.toString() || '0';
  }

  extractReviewCount(data: any): string {
    return data.reviewCount?.toString() || '0';
  }

  extractProvider(url: string): string {
    const scraper = new (await import('./affiliate-service')).AffiliateService();
    return scraper.detectProvider(url);
  }

  calculateCommission(data: any): number {
    return data.commission || data.commissionRate || 0;
  }

  extractTargetAudience(data: any): string[] {
    return data.targetAudience || data.audience || [];
  }

  extractFeatures(data: any): string[] {
    return data.features || data.benefits || [];
  }
}