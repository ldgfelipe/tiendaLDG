// Server Component - Admin Layout
// Este layout envuelve todas las páginas del admin

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>{children}</>
  );
}