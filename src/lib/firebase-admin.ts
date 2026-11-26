// Cliente Firebase para el servidor (API routes)
// Usa la configuración pública del proyecto Firebase
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, increment } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAtdzDzkjkZBhPLgnzemJbYxNwsdVpd8TQ',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tiendaldg.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tiendaldg',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tiendaldg.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '379198593942',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:379198593942:web:9f17f3f60a916394b8dbb7',
};

// Inicializar Firebase (reutilizar si ya existe)
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const productsCollection = collection(db, 'products');

// Funciones helper para productos
export const productFirestore = {
  async create(productData: any) {
    const id = productData.id || Date.now().toString();
    const docRef = doc(db, 'products', id);
    const product = {
      ...productData,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      clickCount: productData.clickCount || 0,
    };
    await setDoc(docRef, product);
    return product;
  },

  async getAll() {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
  },

  async getById(id: string) {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  },

  async update(id: string, data: any) {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { id, ...data };
  },

  async delete(id: string) {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return { success: true };
  },

  async incrementClick(id: string) {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      clickCount: increment(1),
      lastUpdated: serverTimestamp(),
    });
    return { success: true };
  },
};