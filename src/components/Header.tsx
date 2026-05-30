'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0 backdrop-blur-md bg-black/80">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Left: GDG Logo */}
          <Link href="https://gdgnoida.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <Image
              src="/gdg-logo.png"
              alt="Google Developer Groups"
              width={48}
              height={48}
              className="w-auto h-12 object-contain"
              style={{ width: 'auto', height: '48px' }}
            />
          </Link>

          {/* Center: Navigation Links - Desktop */}
          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-white hover:text-stadium-green transition">
              Home
            </Link>
            <Link href="/register" className="text-white hover:text-stadium-green transition">
              Register
            </Link>
            <Link href="/leaderboard" className="text-white hover:text-stadium-green transition">
              Leaderboard
            </Link>
            <Link href="/projector" className="text-white hover:text-stadium-green transition">
              Live
            </Link>
          </div>

          {/* Right: Qualcomm Logo */}
          <Link href="https://www.qualcomm.com/developer" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <Image
              src="/qualcomm-logo.png"
              alt="Qualcomm Developers"
              width={48}
              height={48}
              className="w-auto h-12 object-contain"
              style={{ width: 'auto', height: '48px' }}
            />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link href="/" className="text-white hover:text-stadium-green transition" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/register" className="text-white hover:text-stadium-green transition" onClick={() => setMobileMenuOpen(false)}>
              Register
            </Link>
            <Link href="/leaderboard" className="text-white hover:text-stadium-green transition" onClick={() => setMobileMenuOpen(false)}>
              Leaderboard
            </Link>
            <Link href="/projector" className="text-white hover:text-stadium-green transition" onClick={() => setMobileMenuOpen(false)}>
              Live
            </Link>
            <Link href="/admin" className="text-gray-400 text-sm hover:text-stadium-green transition" onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}