'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';

export default function HeroSection() {
  const [email, setEmail] = useState('');

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-emerald-600">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full filter blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white opacity-10 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white opacity-5 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badges */}
        <div className="inline-block mb-6">
          <span className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium">
            ✅ Recomendaciones verificadas • Envíos gratis • Devolución 30 días
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none">
          <span className="block">Ropa y Calzado Premium</span>
          <span className="block text-emerald-300">con IA</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
          Descubre los mejores productos de referidos verificados con 
          recomendaciones de IA. <strong className="text-white">Calidad garantizada</strong>, 
          precios optimizados y enlaces seguros.
        </p>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar 
            placeholder="Busca por nombre, marca o característica..."
            showSuggestions={true}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-1">500+</div>
            <div className="text-white/80 text-sm">Productos Verificados</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-white/80 text-sm">Clientes Satisfechos</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-1">98%</div>
            <div className="text-white/80 text-sm">Tasa de Comisión</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group bg-white text-purple-600 font-bold px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300">
            Ver Productos Populares
            <svg className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          
          <button className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
            Ver Nuestras Recomendaciones
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-400 rounded-full animate-pulse opacity-20" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400 rounded-full animate-pulse opacity-20" style={{ animationDelay: '2s' }} />
    </section>
  );
}