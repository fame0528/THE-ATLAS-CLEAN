'use client';

export const dynamic = 'force-dynamic';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 — Not Found</h1>
        <p className="text-gray-400 mb-4">The requested page could not be found.</p>
        <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
          Return Home
        </a>
      </div>
    </div>
  );
}
