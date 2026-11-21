'use client';

import { ReactNode } from 'react';
import { AdminAuthProvider } from '@/components/AdminAuthWrapper';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}