import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">TiendaLDG</h3>
            <p className="text-sm text-gray-400">
              Productos de referidos de alta calidad recomendados por IA.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Productos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white">Todos los productos</Link></li>
              <li><Link href="/products/tecnologia" className="hover:text-white">Tecnología</Link></li>
              <li><Link href="/products/fitness" className="hover:text-white">Fitness</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Blog</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white">Artículos</Link></li>
              <li><Link href="/guides" className="hover:text-white">Guías</Link></li>
              <li><Link href="/comparison" className="hover:text-white">Comparativas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terminos" className="hover:text-white">Términos</Link></li>
              <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
              <li><Link href="/afiliados" className="hover:text-white">Política de afiliados</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TiendaLDG. Todos los derechos reservados.</p>
          <p className="mt-1">
            Enlaces de afiliados • Este sitio puede ganar comisiones sin costo adicional para ti
          </p>
        </div>
      </div>
    </footer>
  );
}