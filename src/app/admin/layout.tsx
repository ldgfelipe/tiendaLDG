import { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import AdminRoute from '@/components/AdminRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminRoute>{children}</AdminRoute>
    </AuthProvider>
  );
}