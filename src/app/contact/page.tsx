import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Enviar a Firebase Function o API
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setLoading(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Contáctanos
        </h1>
        <p className="text-lg text-gray-600">
          ¿Tienes preguntas? ¿Quieres colaborar? Escríbenos
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Tu nombre..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asunto
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Asunto de tu mensaje..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Tu mensaje..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-full transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>

        {/* Información de contacto */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Información
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <span>soporte@tiendaldg.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕒</span>
                <span>Lunes a Viernes 9:00 - 18:00</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <span>+52 123 456 7890</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Enlaces Útiles
            </h2>
            <ul className="space-y-3">
              <li>
                <a href="/terminos" className="text-indigo-600 hover:underline">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="/privacidad" className="text-indigo-600 hover:underline">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="/afiliados" className="text-indigo-600 hover:underline">
                  Programa de Afiliados
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}