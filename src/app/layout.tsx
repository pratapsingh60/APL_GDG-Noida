import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'GDG Noida APL 2026 - Agentic Premier League',
  description: 'Big Plays. Big Builds. Join us at Moire Cafe on 31st May 2026',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="pt-16">
        <Header />
        {children}
      </body>
    </html>
  )
}