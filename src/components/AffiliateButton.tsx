'use client';

import { useState } from 'react';

interface AffiliateButtonProps {
  productId: string;
  affiliateUrl: string;
  provider: string;
}

export default function AffiliateButton({ productId, affiliateUrl, provider }: AffiliateButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // Registrar el clic antes de abrir el enlace
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, affiliateUrl }),
      }).catch(() => null);
    } catch (error) {
      console.error('Error registrando clic:', error);
    } finally {
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? 'Abriendo tienda...' : `Ver en ${provider}`}
      <span aria-hidden="true">↗</span>
    </button>
  );
}