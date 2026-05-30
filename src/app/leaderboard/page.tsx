'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LeaderboardPage() {
  const [participants, setParticipants] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/register')
      const data = await response.json()
      
      const judged = data.participants
        .filter((p: any) => p.judged && !p.disqualified)
        .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
      
      const disqualified = data.participants.filter((p: any) => p.disqualified)
      
      setParticipants([...judged, ...disqualified])
      setLastUpdated(data.lastUpdated)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch:', error)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 120000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stadium-darker pt-24">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-stadium-green mb-2 text-center">Leaderboard</h1>
        <p className="text-center text-gray-400 mb-8">
          Last updated: {new Date(lastUpdated).toLocaleString()}
          <span className="text-stadium-green ml-2">● Auto-refreshes every 2 minutes</span>
        </p>
        
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left">Rank</th>
                  <th className="px-6 py-4 text-left">Participant</th>
                  <th className="px-6 py-4 text-left">Problem Statement</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, idx) => (
                  <tr key={p.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4 font-bold">
                      {p.disqualified ? '🚫' : idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td className="px-6 py-4">{p.fullName}</td>
                    <td className="px-6 py-4 text-gray-300">{p.problemStatement}</td>
                    <td className="px-6 py-4 text-center font-bold text-xl">
                      {p.disqualified ? (
                        <span className="text-red-400 text-sm">Disqualified</span>
                      ) : (
                        <span className="text-stadium-green">{p.score || 'Pending'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {p.disqualified ? (
                        <span className="text-red-400 text-xs" title={p.disqualifyReason}>
                          ⚠️ {p.disqualifyReason?.substring(0, 30)}...
                        </span>
                      ) : p.judged ? (
                        <span className="text-green-400 text-xs">✓ Judged</span>
                      ) : (
                        <span className="text-yellow-400 text-xs">⏳ Judging in progress</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}