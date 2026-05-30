'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useP2P } from '@/hooks/useP2P'
import confetti from 'canvas-confetti'

const emojis = ['🔥', '🏏', '👏', '🎉', '😱']

function TapContent() {
  const searchParams = useSearchParams()
  const peerId = searchParams.get('peer')
  const [status, setStatus] = useState('Connecting...')
  const [lastTap, setLastTap] = useState('')
  
  const { isConnected, sendReaction, connectToHost, error } = useP2P({
    role: 'client',
    hostId: peerId || undefined
  })

  useEffect(() => {
    if (peerId) {
      connectToHost()
      setStatus('Connecting to projector...')
    } else {
      setStatus('Invalid QR code')
    }
  }, [peerId, connectToHost])

  useEffect(() => {
    if (isConnected) setStatus('Connected! Tap an emoji')
    if (error) setStatus(`Error: ${error}`)
  }, [isConnected, error])

  const handleTap = (emoji: string) => {
    if (sendReaction(emoji)) {
      setLastTap(emoji)
      
      // Visual feedback
      const btn = document.activeElement as HTMLElement
      if (btn) btn.style.transform = 'scale(0.95)'
      setTimeout(() => { if (btn) btn.style.transform = '' }, 100)
      
      // Haptic feedback for mobile devices
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50)
      }
      
      // Confetti effect
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00FF87', '#00cc6a', '#ffffff']
      })
      
      // Clear last tap after 1 second
      setTimeout(() => setLastTap(''), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stadium-darker to-stadium-dark flex flex-col items-center justify-center p-6">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-stadium-green mb-2">GDG APL</h1>
        <p className="text-gray-400 mb-6">{status}</p>
        
        {lastTap && (
          <div className="mb-4 text-4xl animate-bounce">
            Sent {lastTap}!
          </div>
        )}
        
        {isConnected && (
          <div className="grid grid-cols-2 gap-4">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleTap(emoji)}
                className="glass-card p-6 text-5xl hover:scale-110 transition-transform active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {!isConnected && peerId && (
          <div className="animate-pulse">
            <p className="text-stadium-green">Waiting for connection...</p>
            <div className="mt-4 w-8 h-8 border-2 border-stadium-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {!peerId && (
          <p className="text-red-500">Invalid connection. Please scan the QR code again.</p>
        )}
      </div>
    </div>
  )
}

export default function TapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-green mx-auto"></div>
        </div>
      </div>
    }>
      <TapContent />
    </Suspense>
  )
}