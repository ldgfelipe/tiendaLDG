// Script rápido para crear usuarios admin
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const auth = admin.auth();

async function createAdmin(email, password) {
  try {
    const user = await auth.createUser({
      email,
      password,
      emailVerified: true
    });

    // Asignar custom claim de admin
    await auth.setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Usuario admin creado: ${email}`);
    console.log(`🔑 UID: ${user.uid}`);
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`ℹ️  Usuario ${email} ya existe`);
    } else {
      console.error('Error creando usuario:', error);
    }
    process.exit(1);
  }
}

// Uso: node scripts/create-admin.js admin@tuapp.com password123
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Uso: node scripts/create-admin.js <email> <password>');
  process.exit(1);
}

createAdmin(args[0], args[1]);