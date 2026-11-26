// Admin SDK de Firebase para las API routes del servidor.
// El Admin SDK omite las reglas de seguridad de Firestore, por lo que permite
// crear/actualizar/eliminar productos sin necesidad de un usuario autenticado.
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Inicializar solo una vez (Next.js puede recargar módulos en dev)
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tiendaldg',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'tiendaldg.appspot.com',
  });
}

const db = getFirestore();
const productsCollection = db.collection('products');

// Convertir timestamps de Firestore a Date/ISO para el frontend
function serialize(doc: any) {
  const data = doc.data();
  const serialized: any = { ...data };

  for (const key of Object.keys(serialized)) {
    const value = serialized[key];
    if (value && typeof value.toDate === 'function') {
      serialized[key] = value.toDate().toISOString();
    }
  }

  return { id: doc.id, ...serialized };
}

export const productFirestore = {
  async create(productData: any) {
    const id = productData.id || Date.now().toString();
    const docRef = productsCollection.doc(id);
    const product = {
      ...productData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      clickCount: productData.clickCount || 0,
    };
    delete (product as any).lastUpdated; // Evitar conflictos con Date serializado
    await docRef.set(product);
    return product;
  },

  async getAll() {
    const snapshot = await productsCollection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(serialize);
  },

  async getById(id: string) {
    const doc = await productsCollection.doc(id).get();
    if (!doc.exists) return null;
    return serialize(doc);
  },

  async update(id: string, data: any) {
    const docRef = productsCollection.doc(id);
    const updateData = { ...data, updatedAt: new Date() };
    delete (updateData as any).id;
    await docRef.update(updateData);
    return { id, ...updateData };
  },

  async delete(id: string) {
    await productsCollection.doc(id).delete();
    return { success: true };
  },

  async incrementClick(id: string) {
    await productsCollection.doc(id).update({
      clickCount: FieldValue.increment(1),
      lastUpdated: new Date(),
    });
    return { success: true };
  },
};
