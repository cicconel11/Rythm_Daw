"use client";

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Registration Test</h1>
      <p>This is a test page to verify the App Router is working.</p>
      <a href="/register/credentials" className="text-blue-500 underline">
        Go to Registration
      </a>
    </div>
  );
}
