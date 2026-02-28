import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THE ATLAS — Mission Control',
  description: 'Swarm orchestration and intelligence dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 font-sans">
        <header className="border-b border-gray-700 p-4">
          <h1 className="text-xl font-bold">THE ATLAS <span className="text-sm font-normal text-gray-400 ml-2">Clean Rebuild — Local-First Control Panel</span></h1>
        </header>
        <main className="p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
