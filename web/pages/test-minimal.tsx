import React from 'react';
import Head from 'next/head';

export default function TestMinimalPage() {
  return (
    <>
      <Head>
        <title>Minimal Test Page</title>
      </Head>
      <div>
        <h1>Minimal Test Page</h1>
        <p>This is a minimal test page to verify Next.js works.</p>
        <button data-testid="test-button">Click me</button>
      </div>
    </>
  );
}
