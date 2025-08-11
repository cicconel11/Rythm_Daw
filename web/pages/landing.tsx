import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Landing() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-black transition-colors">
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading...</div>
      </main>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (status === 'authenticated') {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-black transition-colors">
      <section className="w-full max-w-2xl px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Rythm: AI-Powered Music Collaboration
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10">
          Create, share, and remix music with creators worldwide. Instant cloud DAW, real-time
          collab, and seamless sharing. No installs required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors"
            onClick={() => router.push('/register/credentials')}
            data-testid="btn-get-started"
          >
            Get Started
          </button>
          <button
            className="px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold shadow transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => router.push('/auth/login')}
            data-testid="btn-login"
          >
            Login
          </button>
        </div>
      </section>
    </main>
  );
}
