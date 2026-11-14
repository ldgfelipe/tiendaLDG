'use client';

import { FaShippingFast, FaShieldAlt, FaStar, FaUsers } from 'react-icons/fa';

export default function StatsSection() {
  const stats = [
    {
      icon: FaShippingFast,
      value: 'Envíos Gratis',
      description: 'En pedidos superiores a $50',
      iconColor: 'text-purple-600'
    },
    {
      icon: FaShieldAlt,
      value: 'Garantía 30 Días',
      description: 'Devolución total si no estás satisfecho',
      iconColor: 'text-emerald-600'
    },
    {
      icon: FaStar,
      value: '4.8/5 Promedio',
      description: 'Calificación de clientes verificados',
      iconColor: 'text-yellow-500'
    },
    {
      icon: FaUsers,
      value: '10K+ Clientes',
      description: 'Más de 10.000 compradores satisfechos',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Por qué elegirnos?</h2>
          <p className="text-purple-100 max-w-2xl mx-auto">
            Tres razones por las que miles de clientes confían en nuestro servicio
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <stat.icon className={`w-12 h-12 ${stat.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold mb-2">{stat.value}</h3>
              <p className="text-purple-200 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}