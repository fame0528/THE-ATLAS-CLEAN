import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import ErrorBoundary from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'THE ATLAS - Clean Rebuild',
  description: 'Local-first control panel for the swarm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <html lang="en" suppressHydrationWarning>
          <body className="font-sans bg-slate-950 text-slate-100">
            <header className="border-b border-slate-800 p-4">
              <h1 className="text-xl font-bold">THE ATLAS <span className="text-sm font-normal text-slate-400 ml-2">Clean Rebuild - Local-First Control Panel</span></h1>
            </header>
            <main className="p-6">
              {children}
            </main>
          </body>
        </html>
      </ErrorBoundary>
    </ThemeProvider>
  )
}