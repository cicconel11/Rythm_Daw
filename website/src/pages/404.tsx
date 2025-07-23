import Layout from '@/components/layouts/Main';
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404 – Page not found</h1>
      <p className="text-lg text-gray-500">The page you requested doesn’t exist.</p>
    </main>
  );
} 