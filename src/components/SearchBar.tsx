'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { AIService } from '@/services/ai-service';

interface SearchBarProps {
  placeholder?: string;
  showSuggestions?: boolean;
}

export default function SearchBar({ 
  placeholder = 'Busca productos, artículos o temas...', 
  showSuggestions = true 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const aiService = new AIService();

  // Generar sugerencias inteligentes
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const generateSuggestions = async () => {
      setIsSearching(true);
      
      try {
        // Obtener keywords IA sugeridas
        const keywords = await aiService.generateKeywords(query, 'general', 8);
        setSuggestions([...query.split(' '), ...keywords.slice(0, 5)] as string[]);
      } catch (error) {
        // Fallback a búsqueda local si falla la API
        const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
        const localSuggestions = products
          .filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
          .map(p => p.title.split(' ').slice(0, 3).join(' '));
        
        setSuggestions([...query.split(' '), ...localSuggestions]);
      }
      
      setIsSearching(false);
    };

    const timeoutId = setTimeout(generateSuggestions, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    // Redirigir a página de resultados con SEO
    const searchParams = new URLSearchParams({ q: searchTerm });
    router.push(`/search?${searchParams.toString()}`);
    setShowDropdown(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  // Bucle visual para input
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* Input principal */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-6 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 shadow-lg"
        />

        {/* Icono de búsqueda */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.354-4.354M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          )}
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={() => handleSearch(query)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
        >
          Buscar
        </button>
      </div>

      {/* Dropdown de sugerencias */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 mt-2 z-50">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0"
              >
                <span className="text-sm font-medium text-gray-900">{suggestion}</span>
                <span className="text-xs text-gray-400 block">Buscar en nuestra tienda</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}