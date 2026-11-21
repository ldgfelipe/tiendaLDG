// Cliente Firebase para el frontend
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAtdzDzkjkZBhPLgnzemJbYxNwsdVpd8TQ',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tiendaldg.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tiendaldg',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tiendaldg.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '379198593942',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:379198593942:web:9f17f3f60a916394b8dbb7',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Servicio de subida de imágenes
export class ImageUploadService {
  private bucket = storage;

  async uploadImage(file: File, path: string): Promise<string> {
    try {
      // Crear referencia única
      const storageRef = ref(this.bucket, path);
      
      // Compresión básica (opcional)
      const compressedFile = await this.compressImage(file);
      
      // Subir imagen
      const snapshot = await uploadBytes(storageRef, compressedFile);
      
      // Obtener URL pública
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw new Error('Error al subir la imagen');
    }
  }

  async uploadMultipleImages(files: File[], folder: string): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const path = `${folder}/${Date.now()}_${index}_${file.name}`;
      return this.uploadImage(file, path);
    });
    
    return Promise.all(uploadPromises);
  }

  async deleteImage(url: string): Promise<void> {
    try {
      const storageRef = ref(this.bucket, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error eliminando imagen:', error);
    }
  }

  // Compresión básica de imagen (reducir tamaño)
  private async compressImage(file: File, maxSize: number = 800): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar si es muy grande
          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width = width * ratio;
            height = height * ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.8 // Calidad 80%
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target!.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  }
}

export default app;