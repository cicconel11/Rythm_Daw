import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Rythm – Home</title>
        <meta name="description" content="Welcome to the Rythm beta!" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-4xl font-bold">It works! 🥳</h1>
        <p className="text-lg text-gray-600">
          Your Next.js app compiled successfully inside Docker.
        </p>
        <Link
          href="#"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Continue
        </Link>
      </main>
    </>
  );
} 