// Configuración de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Helpers de Firestore
export const productsCollection = collection(db, 'products');
export const blogPostsCollection = collection(db, 'blogPosts');
export const categoriesCollection = collection(db, 'categories');
export const usersCollection = collection(db, 'users');
export const analyticsCollection = collection(db, 'analytics');

export default app;