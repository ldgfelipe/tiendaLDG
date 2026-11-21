// Script para configurar CORS en Firebase Storage usando Google Cloud CLI
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

async function setCors() {
  // Inicializar con credenciales del sistema o desde GOOGLE_APPLICATION_CREDENTIALS
  const storage = new Storage({ projectId: 'tiendaldg' });
  
  const BUCKET = 'tiendaldg.firebasestorage.app';
  
  const corsConfig = [
    {
      origin: ['https://tienda22077--tiendaldg.us-east4.hosted.app'],
      method: ['GET', 'PUT', 'POST', 'DELETE'],
      responseHeader: ['*'],
      maxAgeSeconds: 3600
    }
  ];
  
  try {
    // Verificar si el bucket existe y actualizar CORS
    await storage.bucket(BUCKET).setCorsConfiguration(corsConfig);
    console.log(`✅ CORS configured for bucket: ${BUCKET}`);
    console.log(`   Origin: https://tienda22077--tiendaldg.us-east4.hosted.app`);
    console.log(`   Methods: GET, PUT, POST, DELETE`);
    return true;
  } catch (error) {
    console.error('❌ Error configuring CORS:', error.message);
    
    // Si el error es por permisos, dar instrucciones manuales
    if (error.message.includes('Permission') || error.message.includes('403')) {
      console.log('\n🔑 Necesitas autenticarte primero:');
      console.log('   firebase login');
      console.log('   google auth login\n');
    }
    
    return false;
  }
}

setCors().then(success => {
  if (!success) {
    console.log('\n⚠️ Intenta configurarlo manualmente en Firebase Console → Storage → Configurar CORS');
    process.exit(1);
  }
});
