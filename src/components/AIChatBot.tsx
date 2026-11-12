'use client';

import { useState, useRef, useEffect } from 'react';
import { Product } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatBotProps {
  products?: Product[];
  category?: string;
}

export default function AIChatBot({ products = [], category = '' }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Llamada al endpoint de chat IA
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          context: {
            category,
            products: products.slice(0, 5),
            previousMessages: messages.slice(-5)
          }
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'No pude procesar tu pregunta en este momento.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Error al conectarse con el asistente. Por favor, inténtalo más tarde.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setInputValue(`¿Qué opinas de "${product.title}"?`);
    handleSubmit({} as React.FormEvent);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
            <h3 className="font-semibold">Asistente AI</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-2">¡Hola! Soy tu asistente de IA especializado en {category || 'productos'}.</p>
                <p>¿En qué puedo ayudarte?</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-50 block mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}