import './globals.css';
import { Inter } from 'next/font/google';
import Layout from '@/components/Layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'TiendaLDG - Referidos Premium de Alta Calidad',
  description: 'Descubre los mejores productos de referidos verificados con recomendaciones de IA. Envíos gratis, garantía de devolución y precios optimizados.',
  keywords: ['referidos, afiliados, productos premium, ropa, calzado, moda, recomendaciones IA', 'envíos gratis', 'garantía devolución'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head />
      <body className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-slate-50 to-indigo-50`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}