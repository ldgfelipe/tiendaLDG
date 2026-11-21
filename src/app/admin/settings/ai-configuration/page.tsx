'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/components/AdminAuthWrapper';

export default function AISettingsPage() {
  const { user, logout } = useAdminAuth();
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
    }
  }, [user, router]);

  // State para configuraciones de IA - declarado al inicio
  const [config, setConfig] = useState({
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    ollamaUrl: process.env.OLLAMA_URL || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    provider: 'fallback',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error' | 'testing'>('idle');
  const [message, setMessage] = useState<string>('');

  // Cargar configuraciones al montar
  useEffect(() => {
    const savedConfig = localStorage.getItem('aiConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Guardar configuración
  const handleSave = () => {
    setLoading(true);
    setStatus('saving');
    try {
      localStorage.setItem('aiConfig', JSON.stringify(config));
      setStatus('success');
      setMessage('Configuración guardada');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  // Probar conexión
  const handleTest = () => {
    setStatus('testing');
    setMessage('Probando conexión...');
    if (config.openaiApiKey && config.openaiApiKey.startsWith('sk-')) {
      setMessage('OpenAI configurado');
    } else if (config.ollamaUrl) {
      setMessage('Ollama configurado');
    } else if (config.geminiApiKey) {
      setMessage('Gemini configurado');
    } else {
      setMessage('Modo fallback activo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Configuración de IA</h1>

        <div className="bg-white rounded-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Proveedores de IA</h2>
            <p className="text-sm text-gray-500 mb-4">
              Selecciona qué motor de IA usarás para extraer productos y generar contenido
            </p>
          </div>

          {/* OpenAI */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium mb-2">🔑 OpenAI</h3>
            <p className="text-xs text-blue-600">$5 gratis al crear cuenta</p>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                type="password"
                value={config.openaiApiKey}
                onChange={(e) => setConfig({ ...config, openaiApiKey: e.target.value })}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 mt-1"
                placeholder="sk-... (empezar por sk-)"
                disabled={config.provider !== 'openai'}
              />
              <p className="text-xxs text-blue-500 mt-1">Deja vacío para desactivar</p>
            </div>
          </div>

          {/* Ollama (Local) */}
          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium mb-2">🖥️ Ollama (Local - Gratis)</h3>
            <p className="text-xs text-green-600">Se ejecuta en tu servidor, sin costos</p>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">URL del servidor</label>
              <input
                type="text"
                value={config.ollamaUrl}
                onChange={(e) => setConfig({ ...config, ollamaUrl: e.target.value })}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 mt-1"
                placeholder="http://localhost:11434"
                disabled={config.provider !== 'ollama'}
              />
              <p className="text-xxs text-green-500 mt-1">Necesitas tener Ollama instalado</p>
            </div>
          </div>

          {/* Gemini */}
          <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-medium mb-2">🌟 Google Gemini</h3>
            <p className="text-xs text-purple-600">Free tier disponible</p>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                type="password"
                value={config.geminiApiKey}
                onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 mt-1"
                placeholder="IA...."
                disabled={config.provider !== 'gemini'}
              />
              <p className="text-xxs text-purple-500 mt-1">Obtener en Google AI Studio</p>
            </div>
          </div>

          {/* Modo Fallback */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">🆓 Modo Fallback (Siempre activo)</h3>
            <p className="text-xs text-gray-600">
              Sin costo ninguno. Usa algoritmos internos cuando no hay API keys
            </p>
            <p className="text-xxs text-gray-500 mt-1">Recomendado para: Desarrollo y pruebas</p>
          </div>

          {/* Acciones */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
              style={{ marginBottom: '10px' }}
            >
              {loading ? 'Guardando...' : 'Guardar Configuración'}
            </button>

            <button
              onClick={handleTest}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Probar Conexión
            </button>
          </div>

          {/* Estado actual */}
          {status !== 'idle' && (
            <div className="mt-4 p-3 rounded-lg">
              <p className="text-sm font-medium" style={{ color: status === 'success' ? 'green' : 'red' }}>
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}