// Utilidades generales para la tienda
import { Product } from '@/types';

export class Utils {
  // Formatear precio con moneda
  static formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency
    }).format(price);
  }

  // Calcular ahorro
  static calculateSavings(originalPrice: number, price: number): string {
    if (!originalPrice || originalPrice <= price) return '';
    
    const savings = originalPrice - price;
    const percentage = Math.round((savings / originalPrice) * 100);
    
    return `¡${percentage}% de descuento!`;
  }

  // Generar slug SEO-friendly
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Limitar texto con truncar elegante
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > maxLength * 0.8 
      ? truncated.substring(0, lastSpace) + '...' 
      : truncated.substring(0, maxLength - 3) + '...';
  }

  // Calcular tiempo de lectura
  static calculateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Generar ID único
  static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Formatear fecha
  static formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Detectar dispositivo móvil
  static isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }

  // Copiar al portapapeles
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  // Scroll suave al tope
  static scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Validar email
  static isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Generar meta tags para SEO
  static generateMetaTags(metadata: any): string {
    return `
      <meta name="description" content="${metadata.description}">
      <meta name="keywords" content="${metadata.keywords.join(',')}">
      <meta property="og:title" content="${metadata.openGraph.title}">
      <meta property="og:description" content="${metadata.openGraph.description}">
      <meta property="og:image" content="${metadata.openGraph.image}">
    `;
  }
}

// Formatear números con separador de miles
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Debounce para búsquedas
export const debounce = (func: Function, wait: number) => {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Capitalizar primera letra
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Crear slug a partir de string
export const createSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Obtener dominio de URL
export const getDomain = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// Verificar si es URL válida
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};