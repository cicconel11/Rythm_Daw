import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="mb-6 text-gray-500">
        Sorry, the page you requested does not exist.
      </p>
      <Link
        to="/landing"
        data-testid="nf-home"
        className="inline-block px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
