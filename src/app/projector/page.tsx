'use client'

import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'
import { useP2P } from '@/hooks/useP2P'
import Image from 'next/image'
import { X, Minimize2, Maximize2, BarChart3, QrCode } from 'lucide-react'

export default function ProjectorPage() {
  const [flyingEmojis, setFlyingEmojis] = useState<Array<{id: string, emoji: string, x: number, y: number, timestamp: number}>>([])
  const [reactionCount, setReactionCount] = useState({ '🔥': 0, '🏏': 0, '👏': 0, '🎉': 0, '😱': 0 })
  const [showQR, setShowQR] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const { peerId, isConnected, error } = useP2P({
    role: 'host',
    onReaction: (emoji) => {
      const canvas = canvasRef.current
      const newEmoji = {
        id: `${Date.now()}-${Math.random()}`,
        emoji: emoji,
        x: Math.random() * (canvas?.width || 800),
        y: (canvas?.height || 600) - 50,
        timestamp: Date.now()
      }
      setFlyingEmojis(prev => [...prev, newEmoji])
      setReactionCount(prev => ({ ...prev, [emoji]: (prev[emoji as keyof typeof prev] || 0) + 1 }))
      setTimeout(() => setFlyingEmojis(prev => prev.filter(e => e.id !== newEmoji.id)), 2000)
    }
  })

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      flyingEmojis.forEach(emoji => {
        const age = (Date.now() - emoji.timestamp) / 1000
        const yOffset = age * 200
        const opacity = Math.max(0, 1 - age / 2)
        const size = 48 - age * 20
        ctx.font = `${Math.max(20, size)}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`
        ctx.globalAlpha = opacity
        ctx.fillText(emoji.emoji, emoji.x, emoji.y - yOffset)
      })
      ctx.globalAlpha = 1
      requestAnimationFrame(animate)
    }
    
    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [flyingEmojis])

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const url = typeof window !== 'undefined' ? `${window.location.origin}/tap?peer=${peerId}` : ''

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Live Stream Video Background */}
      <div className="fixed inset-0 z-0">
        <iframe
  className="w-full h-full"
  src="https://www.youtube-nocookie.com/embed/9wMflPIh3No?autoplay=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&playsinline=1&rel=0&showinfo=0&theme=dark"
  title="GDG APL Live Stream"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>
      </div>
      
      {/* Logo Overlay (always visible) */}
      <div className="fixed top-4 left-4 z-30 flex gap-3">
        <div className="glass-card px-2 py-2 backdrop-blur-md bg-black/60">
          <Image
            src="/gdg-logo.png"
            alt="GDG"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
        </div>
        <div className="glass-card px-2 py-2 backdrop-blur-md bg-black/60">
          <Image
            src="/qualcomm-logo.png"
            alt="Qualcomm"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
        </div>
      </div>
      
      {/* Emoji Canvas Overlay */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-10" />
      
      {/* Top Bar with Controls */}
      <div className="fixed top-4 right-4 z-30 flex gap-3">
        <button
          onClick={toggleFullscreen}
          className="glass-card p-2 backdrop-blur-md bg-black/60 hover:bg-white/10 transition"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        
        <Link href="/" className="glass-card px-4 py-2 text-stadium-green hover:bg-white/10 transition">
          Exit
        </Link>
      </div>

      {/* Toggle Buttons for Panels */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-4">
        <button
          onClick={() => setShowQR(!showQR)}
          className={`glass-card px-4 py-2 backdrop-blur-md flex items-center gap-2 transition ${
            showQR ? 'bg-stadium-green text-black' : 'bg-black/60 text-white hover:bg-white/10'
          }`}
        >
          <QrCode className="w-4 h-4" />
          {showQR ? 'Hide QR' : 'Show QR'}
        </button>
        
        <button
          onClick={() => setShowStats(!showStats)}
          className={`glass-card px-4 py-2 backdrop-blur-md flex items-center gap-2 transition ${
            showStats ? 'bg-stadium-green text-black' : 'bg-black/60 text-white hover:bg-white/10'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          {showStats ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>
      
      {/* QR Code Panel - Draggable/Closable */}
      {showQR && (
        <div className="fixed top-24 right-4 z-20 animate-fade-in">
          <div className="glass-card p-5 text-center backdrop-blur-md bg-black/80 relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-bold mb-3">Scan to React</h2>
            {peerId ? (
              <>
                <QRCodeSVG value={url} size={200} />
                <p className="text-xs text-gray-400 mt-3 break-all max-w-[220px]">{url}</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-stadium-green animate-pulse' : 'bg-yellow-500'}`}></div>
                  <p className="text-xs text-gray-300">
                    {isConnected ? 'Connected!' : 'Waiting...'}
                  </p>
                </div>
              </>
            ) : (
              <div className="animate-pulse">
                <p>Loading QR...</p>
                <div className="mt-4 w-8 h-8 border-2 border-stadium-green border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
        </div>
      )}
      
      {/* Stats Panel - Draggable/Closable */}
      {showStats && (
        <div className="fixed top-24 left-4 z-20 animate-fade-in">
          <div className="glass-card p-4 min-w-[200px] backdrop-blur-md bg-black/80 relative">
            <button
              onClick={() => setShowStats(false)}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold mb-3 text-center text-stadium-green">LIVE REACTIONS</h3>
            {Object.entries(reactionCount).map(([emoji, count]) => (
              <div key={emoji} className="flex justify-between gap-6 py-2 border-b border-white/10 last:border-0">
                <span className="text-2xl">{emoji}</span>
                <span className="text-stadium-green font-bold text-xl">{count}</span>
              </div>
            ))}
            {Object.values(reactionCount).every(v => v === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">
                {isConnected ? 'Tap emojis on your phone!' : 'Waiting for audience...'}
              </p>
            )}
            {isConnected && Object.values(reactionCount).reduce((a,b) => a+b, 0) > 0 && (
              <div className="mt-3 pt-2 text-center text-xs text-gray-400 border-t border-white/10">
                Total: {Object.values(reactionCount).reduce((a,b) => a+b, 0)} reactions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}