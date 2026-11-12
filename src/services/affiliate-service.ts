// Servicio para gestión de enlaces de afiliados
import { AffiliateLink, Product } from '../types';

export class AffiliateService {
  private providers: {
    amazon: string;
    shareasale: string;
   CJ: string;
    clickbank: string;
  } = {
    amazon: 'https://affiliate-program.amazon.com',
    shareasale: 'https://shareasale.com',
    CJ: 'https://advertising.cj.com',
    clickbank: 'https://clickbank.com'
  };

  // Extraer información del producto desde URL afiliada
  async extractProductInfo(affiliateUrl: string): Promise<any> {
    try {
      // Detectar proveedor
      const provider = this.detectProvider(affiliateUrl);
      
      // Llamar al endpoint de extracción
      const response = await fetch('/api/extract-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: affiliateUrl, provider })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error extracting product info:', error);
      return null;
    }
  }

  // Detectar proveedor de afiliado
  detectProvider(url: string): string {
    if (url.includes('amazon.') || url.includes('amzn.to')) return 'amazon';
    if (url.includes('shareasale.com')) return 'shareasale';
    if (url.includes('cj.com') || url.includes('compat.com')) return 'CJ';
    if (url.includes('clickbank.com')) return 'clickbank';
    if (url.includes('ebay.com')) return 'ebay';
    if (url.includes('walmart.com')) return 'walmart';
    if (url.includes('target.com')) return 'target';
    if (url.includes('bestbuy.com')) return 'bestbuy';
    return 'other';
  }

  // Generar enlace de afiliado limpio (sin ID de afiliado para preview)
  generateCleanLink(affiliateUrl: string): string {
    // Eliminar parámetros de seguimiento de afiliado para vista previa
    const url = new URL(affiliateUrl);
    url.searchParams.delete('tag'); // Amazon
    url.searchParams.delete('affiliate'); // Otros
    return url.toString();
  }

  // Crear enlace de tracking
  createTrackedLink(originalUrl: string, productId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    return `${baseUrl}/api/track-affiliate/${productId}?url=${encodeURIComponent(originalUrl)}`;
  }

  // Verificar si el enlace es válido
  async validateAffiliateLink(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Obtener logo del proveedor
  getProviderLogo(provider: string): string {
    const logos: Record<string, string> = {
      amazon: '/images/providers/amazon.svg',
      shareasale: '/images/providers/shareasale.svg',
      CJ: '/images/providers/cj.svg',
      clickbank: '/images/providers/clickbank.svg',
      other: '/images/providers/other.svg'
    };
    return logos[provider] || logos.other;
  }

  // Formatear precio para mostrar
  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  }

  // Calcular comisión estimada
  calculateCommission(price: number, rate: number): number {
    return price * (rate / 100);
  }

  // Crear producto desde enlace afiliado
  async createProductFromAffiliate(affiliateUrl: string): Promise<Omit<Product, 'id' | 'lastUpdated'>> {
    const productInfo = await this.extractProductInfo(affiliateUrl);
    
    return {
      title: productInfo?.title || 'Producto desconocido',
      description: productInfo?.description || '',
      price: productInfo?.price || 0,
      originalPrice: productInfo?.originalPrice,
      affiliateLink: this.createTrackedLink(affiliateUrl, 'temp-id'),
      image: productInfo?.mainImage || '',
      images: productInfo?.images || [],
      category: productInfo?.category ? [productInfo.category] : [],
      rating: productInfo?.rating || 0,
      reviewCount: productInfo?.reviewCount || 0,
      affiliateProvider: this.detectProvider(affiliateUrl),
      commission: productInfo?.commission || 0,
      seoKeywords: [],
      targetAudience: productInfo?.targetAudience || [],
      features: productInfo?.features || []
    };
  }
}