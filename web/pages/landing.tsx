import { useRouter } from 'next/router';

export default function Landing() {
  const router = useRouter();
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
        <button
          className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors"
          onClick={() => router.push('/auth/login')}
          data-testid="btn-get-started"
        >
          Get Started
        </button>
      </section>
    </main>
  );
}
