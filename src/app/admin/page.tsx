'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [projectorUrl, setProjectorUrl] = useState('')
  const [accessCode, setAccessCode] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProjectorUrl(`${window.location.origin}/projector`)
      
      fetch('/api/projector-config')
        .then(res => res.json())
        .then(data => setAccessCode(data.accessCode))
        .catch(err => console.error('Failed to fetch access code:', err))
    }
  }, [])

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  
  console.log('=== DEBUG ADMIN PAGE ===')
  console.log('Password entered:', password)
  console.log('Password length:', password.length)
  
  try {
    const response = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, action: 'get_stats' })
    })
    
    console.log('Response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      setStats(data)
      setAuthenticated(true)
    } else {
      const error = await response.json()
      console.log('Error response:', error)
      alert('Invalid password')
    }
  } catch (error) {
    console.error('Login error:', error)
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
        alert(`Auto-judging ${data.judgingEnabled ? 'STARTED' : 'STOPPED'}`)
        
        if (data.judgingEnabled) {
          triggerAutoJudge()
        }
      }
    } catch (error) {
      alert('Failed to toggle judging')
    }
  }

  const triggerAutoJudge = async () => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'trigger_judging' })
      })
      const result = await response.json()
      console.log('Auto-judge result:', result)
      if (result.success) {
        alert(`Judged ${result.judgedCount || 0} participants`)
        // Refresh stats
        const statsResponse = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, action: 'get_stats' })
        })
        const newStats = await statsResponse.json()
        setStats(newStats)
      }
    } catch (error) {
      console.error('Trigger auto-judge failed:', error)
    }
  }
  const toggleProjector = async () => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'toggle_projector' })
      })
      
      const data = await response.json()
      if (data.success) {
        setStats({ ...stats, projectorVisible: data.projectorVisible })
        alert(`Live button ${data.projectorVisible ? 'VISIBLE' : 'HIDDEN'}`)
      }
    } catch (error) {
      alert('Failed to toggle projector')
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
            
            <button
              onClick={toggleProjector}
              className={`px-6 py-3 rounded-lg font-semibold ${stats?.projectorVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-stadium-green hover:bg-green-600'} transition text-black`}
            >
              {stats?.projectorVisible ? 'Hide Live Button' : 'Show Live Button'}
            </button>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-sm">Registration Status: {stats?.registrationOpen ? '🟢 Open' : '🔴 Closed'}</p>
            <p className="text-sm">Auto-Judging Status: {stats?.judgingEnabled ? '🟢 Running (every 2 min)' : '🔴 Stopped'}</p>
            <p className="text-sm">Live Button: {stats?.projectorVisible ? '🟢 Visible' : '🔴 Hidden'}</p>
          </div>
        </div>
        
        {/* Projector Access (Admin Only) */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-stadium-green">Projector Access</h2>
          <p className="text-sm text-gray-400 mb-3">Only admins should use these links. Do not share publicly.</p>
          
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Projector Page (for laptop):</p>
            <div className="flex flex-wrap items-center gap-3">
              <code className="glass-card px-4 py-2 text-sm break-all bg-black/40">
                {`${projectorUrl}?access=${accessCode}`}
              </code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${projectorUrl}?access=${accessCode}`)
                  alert('Projector URL copied!')
                }}
                className="glass-card px-4 py-2 text-stadium-green hover:bg-white/10 transition text-sm"
              >
                Copy Link
              </button>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-2">Tap Page (embedded in QR code):</p>
            <div className="flex flex-wrap items-center gap-3">
              <code className="glass-card px-4 py-2 text-sm break-all bg-black/40">
                {`${typeof window !== 'undefined' ? window.location.origin : ''}/tap?access=${accessCode}&peer=PEER_ID`}
              </code>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            ⚠️ The Live button in the header is {stats?.projectorVisible ? 'visible' : 'hidden'} to the public.
          </p>
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
                  <th className="px-4 py-2 text-center">Score</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
  {stats?.participants?.map((p: any, index: number) => (
    <tr key={p.ID || `row-${index}`} className="border-t border-white/10">
      <td className="px-4 py-2 font-mono text-xs">{p.ID || 'N/A'}</td>
      <td className="px-4 py-2">{p['Full Name'] || 'Unknown'}</td>
      <td className="px-4 py-2">{p.Gender || 'N/A'}</td>
      <td className="px-4 py-2">{p.Designation || 'N/A'}</td>
      <td className="px-4 py-2 text-xs">{p['Problem Statement']?.substring(0, 20) || 'N/A'}...</td>
      <td className="px-4 py-2 text-center font-bold">
        {p.Disqualified === 'YES' ? (
          <span className="text-red-400">DQ</span>
        ) : p.Score ? (
          <span className="text-stadium-green">{p.Score}</span>
        ) : (
          <span className="text-yellow-400">-</span>
        )}
      </td>
      <td className="px-4 py-2 text-center">
        {p.Disqualified === 'YES' ? (
          <span className="text-red-400 text-xs" title={p['Disqualify Reason']}>🚫</span>
        ) : p.Judged === 'YES' ? (
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