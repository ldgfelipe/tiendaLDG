// Servicio Firestore para gestión de datos
import { Product, BlogPost, Category, User, Analytics } from '../types';

export class FirestoreService {
  private db: any; // Firestore DB instance

  constructor() {
    // Inicializar Firebase
    this.db = null; // Se inicializará en el cliente
  }

  // ========== PRODUCTOS =========
  
  async getAllProducts(filters?: { category?: string; search?: string; limit?: number }): Promise<Product[]> {
    let query = this.db.collection('products');
    
    if (filters?.category) {
      query = query.where('category', 'array-contains', filters.category);
    }
    
    if (filters?.search) {
      query = query.where('title', '>=', filters.search).where('title', '<=', filters.search + '\uf8ff');
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  }

  async getProductById(id: string): Promise<Product | null> {
    const doc = await this.db.collection('products').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async createProduct(product: Omit<Product, 'id' | 'lastUpdated'>): Promise<string> {
    const docRef = await this.db.collection('products').add({
      ...product,
      lastUpdated: new Date()
    });
    return docRef.id;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    await this.db.collection('products').doc(id).update({
      ...updates,
      lastUpdated: new Date()
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.db.collection('products').doc(id).delete();
  }

  // ========== AFILIADOS =========
  
  async scrapeAffiliateProduct(url: string): Promise<any> {
    // Endpoint funcional para extraer información del producto afiliado
    // Usa Puppeteer o cheerio en Cloud Functions
    try {
      const response = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      return await response.json();
    } catch (error) {
      console.error('Error scraping product:', error);
      return null;
    }
  }

  // ========== BLOG =========
  
  async getAllBlogPosts(filters?: { category?: string; tag?: string; published?: boolean }): Promise<BlogPost[]> {
    let query = this.db.collection('blogPosts');
    
    if (filters?.category) {
      query = query.where('category', '==', filters.category);
    }
    
    if (filters?.tag) {
      query = query.where('tags', 'array-contains', filters.tag);
    }
    
    if (filters?.published !== undefined) {
      query = query.where('status', '==', filters.published ? 'published' : 'draft');
    }

    const snapshot = await query.orderBy('publishedAt', 'desc').get();
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const snapshot = await this.db.collection('blogPosts').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // ========== ANALITICS =========
  
  async getAnalytics(): Promise<Analytics> {
    const snapshot = await this.db.collection('analytics').doc('global').get();
    return snapshot.data() || {
      pageViews: 0,
      affiliateClicks: 0,
      conversions: 0,
      revenue: 0,
      topProducts: [],
      seoPerformance: []
    };
  }

  async trackAffiliateClick(productId: string): Promise<void> {
    await this.db.collection('analytics').update('global', {
      affiliateClicks: this.db.FieldValue.increment(1),
      lastClick: new Date()
    });
    
    // Track individual product clicks
    const productRef = this.db.collection('products').doc(productId);
    productRef.update({
      clickCount: this.db.FieldValue.increment(1)
    });
  }

  // ========== CATEGORÍAS =========
  
  async getCategories(): Promise<Category[]> {
    const snapshot = await this.db.collection('categories').orderBy('name').get();
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  }

  // ========== USUARIOS =========
  
  async createUser(user: User): Promise<string> {
    const docRef = await this.db.collection('users').add(user);
    return docRef.id;
  }
}