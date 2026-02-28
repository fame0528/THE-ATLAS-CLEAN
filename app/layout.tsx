import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'THE ATLAS — Clean Rebuild',
  description: 'Local-first control panel for the swarm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        <header className="border-b border-gray-700 p-4">
          <h1 className="text-xl font-bold">THE ATLAS <span className="text-sm font-normal text-gray-400 ml-2">Clean Rebuild — Local-First Control Panel</span></h1>
        </header>
        <main className="p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
