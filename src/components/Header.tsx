'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [projectorVisible, setProjectorVisible] = useState(true)

  const fetchSettings = () => {
    fetch('/api/header-settings')
      .then(res => res.json())
      .then(data => setProjectorVisible(data.projectorVisible))
      .catch(err => console.error('Failed to fetch header settings:', err))
  }

  useEffect(() => {
    fetchSettings()
    // Refresh every 2 seconds to catch changes from admin
    const interval = setInterval(fetchSettings, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0 backdrop-blur-md bg-black/80">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/gdg-logo.png"
              alt="Google Developer Groups"
              width={36}
              height={36}
              className="w-auto h-12 object-contain"
              style={{ width: 'auto', height: '36px' }}
              priority
            />
          </Link>

          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-white hover:text-stadium-green transition">Home</Link>
            <Link href="/register" className="text-white hover:text-stadium-green transition">Register</Link>
            <Link href="/leaderboard" className="text-white hover:text-stadium-green transition">Leaderboard</Link>
            {/* {projectorVisible && (
              <Link href="/projector" className="text-white hover:text-stadium-green transition">Live</Link>
            )} */}
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link href="/" className="text-white hover:text-stadium-green transition" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/register" className="text-white hover:text-stadium-green transition" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            <Link href="/leaderboard" className="text-white hover:text-stadium-green transition" onClick={() => setMobileMenuOpen(false)}>Leaderboard</Link>
            {/* {projectorVisible && (
              <Link href="/projector" className="text-white hover:text-stadium-green transition" onClick={() => setMobileMenuOpen(false)}>Live</Link>
            )} */}
          </div>
        )}
      </div>
    </header>
  )
}