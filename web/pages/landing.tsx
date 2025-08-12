import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

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
    <>
      <Head>
        <title>Rythm Daw - AI-Powered Music Collaboration</title>
        <meta name="description" content="Create, share, and remix music with creators worldwide. Instant cloud DAW, real-time collab, and seamless sharing." />
      </Head>
      <main className="min-h-screen bg-white dark:bg-black transition-colors">
        {/* Header Navigation */}
        <header className="bg-white dark:bg-gray-900 shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Rythm</h1>
              </div>
              <div className="flex items-center space-x-8">
                <a href="#features" data-testid="nav-features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Features
                </a>
                <a href="#pricing" data-testid="nav-pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Pricing
                </a>
                <a href="/docs" data-testid="nav-docs" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Docs
                </a>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero flex flex-col justify-center items-center py-16 px-6 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl text-center">
            <h1 
              className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100"
              data-testid="landing-main-heading"
            >
              Rythm: AI-Powered Music Collaboration
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10">
              Create, share, and remix music with creators worldwide. Instant cloud DAW, real-time
              collab, and seamless sharing. No installs required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register/credentials"
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors inline-flex items-center justify-center"
                data-testid="btn-get-started"
              >
                Get Started
              </Link>
              <button
                className="px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold shadow transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => router.push('/auth/login')}
                data-testid="btn-login"
              >
                Login
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-6 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800" data-testid="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful Features for Musicians
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Everything you need to create, collaborate, and share your music
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                <div className="text-3xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-300">Work together with other musicians in real-time, no matter where you are.</p>
              </div>
              
              <div className="feature-card bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                <div className="text-3xl mb-4">☁️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cloud Storage</h3>
                <p className="text-gray-600 dark:text-gray-300">All your projects are automatically saved and synced across devices.</p>
              </div>
              
              <div className="feature-card bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Assistance</h3>
                <p className="text-gray-600 dark:text-gray-300">Get intelligent suggestions and help with your music production.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 px-6 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Choose the plan that works best for you
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Free</h3>
                <p className="text-gray-600 dark:text-gray-300">Perfect for getting started</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Pro</h3>
                <p className="text-gray-600 dark:text-gray-300">For serious musicians</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Team</h3>
                <p className="text-gray-600 dark:text-gray-300">For studios and teams</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-6 sm:px-6 lg:px-8" data-testid="footer-links">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Rythm</h3>
                <p className="text-gray-400">AI-powered music collaboration platform</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="/docs" className="text-gray-400 hover:text-white">Documentation</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="/blog" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="/careers" className="text-gray-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="/help" className="text-gray-400 hover:text-white">Help Center</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="/status" className="text-gray-400 hover:text-white">Status</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400">&copy; 2024 Rythm. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
