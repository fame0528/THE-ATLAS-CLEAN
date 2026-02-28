import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THE ATLAS - Clean Rebuild',
  description: 'Local-first control panel for the swarm',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}