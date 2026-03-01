'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-4 bg-red-900 border border-red-700 rounded text-red-200">
      <h3 className="font-bold mb-2">Something went wrong</h3>
      <p className="text-sm opacity-75">{error.message}</p>
    </div>
  );
}
