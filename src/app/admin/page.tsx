'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'get_stats' })
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setAuthenticated(true)
      } else {
        alert('Invalid password')
      }
    } catch (error) {
      alert('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const toggleRegistration = async () => {
  try {
    const response = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, action: 'toggle_registration' })
    })
    
    const data = await response.json()
    if (data.success) {
      setStats({ ...stats, registrationOpen: data.registrationOpen })
      alert(`Registration ${data.registrationOpen ? 'OPENED' : 'CLOSED'}`)
    }
  } catch (error) {
    alert('Failed to toggle registration')
  }
}

  const toggleJudging = async () => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'toggle_judging' })
      })
      
      const data = await response.json()
      if (data.success) {
        setStats({ ...stats, judgingEnabled: data.judgingEnabled })
        alert(`Auto-judging ${data.judgingEnabled ? 'started' : 'stopped'}`)
      }
    } catch (error) {
      alert('Failed to toggle judging')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-stadium-darker flex items-center justify-center pt-24">
        <div className="glass-card p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-stadium-green mb-4">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              className="w-full glass-card px-4 py-2 mb-4 bg-white/5 focus:outline-none focus:border-stadium-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stadium-darker pt-24">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-stadium-green">Admin Dashboard</h1>
          <Link href="/" className="text-stadium-green hover:underline">← Back to Site</Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-stadium-green">{stats?.totalParticipants || 0}</div>
            <div className="text-gray-400">Total Registered</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-green-400">{stats?.judged || 0}</div>
            <div className="text-gray-400">Qualified</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-red-400">{stats?.disqualified || 0}</div>
            <div className="text-gray-400">Disqualified</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-yellow-400">{stats?.pending || 0}</div>
            <div className="text-gray-400">Pending Judging</div>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={toggleRegistration}
              className={`px-6 py-3 rounded-lg font-semibold ${stats?.registrationOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} transition text-white`}
            >
              {stats?.registrationOpen ? 'Close Registration' : 'Open Registration'}
            </button>
            
            <button
              onClick={toggleJudging}
              className={`px-6 py-3 rounded-lg font-semibold ${stats?.judgingEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-stadium-green hover:bg-green-600'} transition text-black`}
            >
              {stats?.judgingEnabled ? 'Stop Auto-Judging' : 'Start Auto-Judging'}
            </button>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-sm">Registration Status: {stats?.registrationOpen ? '🟢 Open' : '🔴 Closed'}</p>
            <p className="text-sm">Auto-Judging Status: {stats?.judgingEnabled ? '🟢 Running (every 2 min)' : '🔴 Stopped'}</p>
            <p className="text-xs text-gray-500">Judging automatically stops at 10:30 PM on event day</p>
          </div>
        </div>
        
        {/* Participants Table */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Registered Participants</h2>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/10 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Gender</th>
                  <th className="px-4 py-2 text-left">Designation</th>
                  <th className="px-4 py-2 text-left">Problem</th>
                  <th className="px-4 py-2 text-left">Repo</th>
                  <th className="px-4 py-2 text-center">Score</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.participants?.map((p: any) => (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="px-4 py-2 font-mono text-xs">{p.id}</td>
                    <td className="px-4 py-2">{p.fullName}</td>
                    <td className="px-4 py-2">{p.gender}</td>
                    <td className="px-4 py-2">{p.designation}</td>
                    <td className="px-4 py-2 text-xs">{p.problemStatement?.substring(0, 20)}...</td>
                    <td className="px-4 py-2">
                      <a href={p.githubRepo} target="_blank" className="text-stadium-green text-xs hover:underline">
                        View
                      </a>
                    </td>
                    <td className="px-4 py-2 text-center font-bold">
                      {p.disqualified ? (
                        <span className="text-red-400">DQ</span>
                      ) : p.score ? (
                        <span className="text-stadium-green">{p.score}</span>
                      ) : (
                        <span className="text-yellow-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {p.disqualified ? (
                        <span className="text-red-400 text-xs" title={p.disqualifyReason}>🚫</span>
                      ) : p.judged ? (
                        <span className="text-green-400 text-xs">✓</span>
                      ) : (
                        <span className="text-yellow-400 text-xs">⏳</span>
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