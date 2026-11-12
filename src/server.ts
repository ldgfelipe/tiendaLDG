// Punto de entrada del servidor (para desarrollo)
import { serve } from 'next/server';

// Aquí puedes agregar rutas de API personalizadas
// Ejemplo: Webhook de actualización de precios

export async function POST(request: Request) {
  const body = await request.json();
  
  // Procesar webhook de cambio de precio
  if (body.event === 'price_update') {
    // Actualizar producto en Firestore
    return Response.json({ success: true });
  }
  
  return Response.json({ error: 'Evento no reconocido' });
}