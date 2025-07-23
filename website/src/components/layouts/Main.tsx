import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export default function MainLayout({ title, children }: { title: string; children: ReactNode }) {
  const { pathname } = useRouter();

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/chat', label: 'Chat' },
    { href: '/friends', label: 'Friends' },
    { href: '/settings', label: 'Settings' },
    { href: '/fileshare', label: 'File Share' },
    { href: '/history', label: 'History' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto flex gap-4 p-4">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-medium ${pathname === href ? 'text-blue-600' : 'text-gray-600'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto p-6">
        <h1 className="mb-6 text-4xl font-bold">{title}</h1>
        {children}
      </main>
    </div>
  );
} 