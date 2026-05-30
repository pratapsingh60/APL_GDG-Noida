import { useEffect, useRef, useState, useCallback } from 'react'
import Peer from 'peerjs'

interface UseP2PProps {
  onReaction?: (emoji: string) => void
  role: 'host' | 'client'
  hostId?: string
}

export function useP2P({ onReaction, role, hostId }: UseP2PProps) {
  const [peer, setPeer] = useState<Peer | null>(null)
  const [peerId, setPeerId] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const connectionRef = useRef<any>(null)

  useEffect(() => {
    const newPeer = new Peer()
    
    newPeer.on('open', (id) => {
      setPeerId(id)
      setPeer(newPeer)
      console.log(`Peer ${role} started with ID:`, id)
    })

    newPeer.on('error', (err) => {
      console.error('Peer error:', err)
      setError(err.message)
    })

    return () => {
      if (connectionRef.current) connectionRef.current.close()
      newPeer.destroy()
    }
  }, [role])

  useEffect(() => {
    if (role === 'host' && peer) {
      peer.on('connection', (conn) => {
        console.log('Client connected:', conn.peer)
        connectionRef.current = conn
        setIsConnected(true)

        conn.on('data', (data: any) => {
          if (data.type === 'reaction' && onReaction) {
            onReaction(data.emoji)
          }
        })

        conn.on('close', () => setIsConnected(false))
      })
    }
  }, [peer, role, onReaction])

  const connectToHost = useCallback(() => {
    if (role === 'client' && peer && hostId && !connectionRef.current) {
      const conn = peer.connect(hostId)
      
      conn.on('open', () => {
        console.log('Connected to host')
        connectionRef.current = conn
        setIsConnected(true)
      })

      conn.on('error', (err) => setError(err.message))
      conn.on('close', () => setIsConnected(false))
    }
  }, [peer, role, hostId])

  const sendReaction = useCallback((emoji: string) => {
    if (connectionRef.current && isConnected) {
      connectionRef.current.send({ type: 'reaction', emoji, timestamp: Date.now() })
      return true
    }
    return false
  }, [isConnected])

  return { peerId, isConnected, sendReaction, connectToHost, error }
}