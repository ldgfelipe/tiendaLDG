// Firebase Functions para scraping y procesamiento
// Instalar: npm install firebase-functions firebase-admin

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Inicializar Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Función para scrapear productos afiliados
export const scrapeProduct = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL es requerida' });
  }

  try {
    // Lógica de scraping real aquí
    // Usaria puppeteer o cheerio
    const product = {
      title: 'Nombre del Producto',
      description: 'Descripción del producto...',
      price: 99.99,
      image: 'url_de_imagen',
      url,
      extractedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Guardar temporalmente
    res.status(200).json({ product });
  } catch (error) {
    console.error('Error scraping:', error);
    res.status(500).json({ error: 'Error al procesar' });
  }
});

// Función para tracking de clics
export const trackClick = functions.https.onRequest(async (req, res) => {
  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: 'productId es requerido' });
  }

  try {
    await db.collection('products').doc(productId).update({
      clickCount: admin.firestore.FieldValue.increment(1),
      lastClick: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking:', error);
    res.status(500).json({ error: 'Error al registrar clic' });
  }
});

// Generar contenido con IA
export const generateContent = functions.https.onRequest(async (req, res) => {
  const { topic, type } = req.body;
  
  // Aquí iría la llamada a OpenAI
  res.status(200).json({ content: 'Contenido generado por IA...' });
});

// Función de limpieza de datos
export const cleanupOldData = functions.pubsub.schedule('every 24 hours from 02:00').onRun(async () => {
  const cutoff = admin.firestore.Timestamp.fromDate(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  // Borrar datos antiguos de analytics
  const oldAnalytics = await db.collection('analytics')
    .where('timestamp', '<', cutoff)
    .get();

  const batch = db.batch();
  oldAnalytics.forEach(doc => batch.delete(doc.ref));
  
  await batch.commit();
  
  return null;
});