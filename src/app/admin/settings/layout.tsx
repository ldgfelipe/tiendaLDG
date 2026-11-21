import { ReactNode } from 'react';
import { AdminAuthProvider } from '@/components/AdminAuthWrapper';

export default function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminAuthProvider>{children}</AdminAuthProvider>
  );
}