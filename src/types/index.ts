// Tipos principales para la tienda de referidos

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  affiliateLink: string;
  image: string;
  images: string[];
  category: string[];
  rating: number;
  reviewCount: number;
  clickCount?: number;
  affiliateProvider: string;
  commission: number;
  lastUpdated: Date;
  seoKeywords: string[];
  aiSummary?: string;
  targetAudience?: string[];
  features?: string[];
  pros?: string[];
  cons?: string[];
  faq?: Array<{ question: string; answer: string }>;
}

export interface AffiliateLink {
  id: string;
  url: string;
  provider: 'amazon' | 'shareasale' | 'cj' | 'clickbank' | 'other';
  brand?: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  category: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  relatedProducts?: string[];
  readTime: number;
  featuredImage: string;
  status: 'draft' | 'published' | 'archived';
  aiGenerated: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent?: string;
  products: string[];
  seoKeywords: string[];
  aiSummary?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor' | 'contributor';
  createdAt: Date;
  lastLogin: Date;
}

export interface Analytics {
  pageViews: number;
  affiliateClicks: number;
  conversions: number;
  revenue: number;
  topProducts: Array<{ productId: string; clicks: number }>;
  seoPerformance: Array<{ keyword: string; impressions: number; clicks: number }>;
}

export interface AIAnalysis {
  productSummary: string;
  targetKeywords: string[];
  contentSuggestions: string[];
  seoScore: number;
  readabilityScore: number;
  suggestions: string[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: 'website' | 'article' | 'product';
  };
  structuredData: any;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'newsletter' | 'product-recommendation' | 'affiliate-thankyou';
  variables: string[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscriptionDate: Date;
  source: string;
  preferences: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
}

// Configuración de IA
export interface AIConfig {
  models: {
    chat: string;
    embeddings: string;
    image: string;
  };
  temperature: number;
  maxTokens: number;
  topP: number;
}

// Tipos para API de afiliados
export interface AffiliateAPIResponse {
  product: Product;
  metadata: {
    images: string[];
    priceHistory?: number[];
    ratingHistory?: number[];
  };
}