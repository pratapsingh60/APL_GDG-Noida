'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    gender: '',
    problemStatement: '',
    githubRepo: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ id?: string; message?: string; error?: string } | null>(null)

  const challenges = [
    'Gamified Habit Builder',
    'Autonomous AI Agent',
    'Real-time Collaboration Hub',
    'Interactive Data Visualizer'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult({ id: data.id, message: data.message })
        setFormData({
          fullName: '',
          designation: '',
          gender: '',
          problemStatement: '',
          githubRepo: ''
        })
      } else {
        setResult({ error: data.error })
      }
    } catch (error) {
      setResult({ error: 'Failed to register. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stadium-darker pt-24">
      <div className="container mx-auto px-6 max-w-2xl">
        <Link href="/" className="text-stadium-green hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-stadium-green mb-2">Participant Registration</h1>
          <p className="text-gray-400 mb-6">Register for GDG Noida APL 2026</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white mb-2">Full Name *</label>
              <input
                type="text"
                required
                className="w-full glass-card px-4 py-2 bg-white/5 focus:outline-none focus:border-stadium-green text-white placeholder-gray-500"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">Designation *</label>
              <select
                required
                className="w-full glass-card px-4 py-2 bg-stadium-darker border border-white/10 focus:outline-none focus:border-stadium-green text-white appearance-none cursor-pointer"
                style={{ 
                  backgroundColor: '#0A0F0D',
                  color: 'white'
                }}
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              >
                <option value="" className="bg-stadium-darker text-gray-400">Select designation</option>
                <option value="student" className="bg-stadium-darker text-white">Student</option>
                <option value="professional" className="bg-stadium-darker text-white">Professional</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white mb-2">Gender *</label>
              <select
                required
                className="w-full glass-card px-4 py-2 bg-stadium-darker border border-white/10 focus:outline-none focus:border-stadium-green text-white appearance-none cursor-pointer"
                style={{ 
                  backgroundColor: '#0A0F0D',
                  color: 'white'
                }}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="" className="bg-stadium-darker text-gray-400">Select gender</option>
                <option value="male" className="bg-stadium-darker text-white">Male</option>
                <option value="female" className="bg-stadium-darker text-white">Female</option>
                <option value="other" className="bg-stadium-darker text-white">Other</option>
                <option value="prefer-not-to-say" className="bg-stadium-darker text-white">Prefer not to say</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white mb-2">Problem Statement *</label>
              <select
                required
                className="w-full glass-card px-4 py-2 bg-stadium-darker border border-white/10 focus:outline-none focus:border-stadium-green text-white appearance-none cursor-pointer"
                style={{ 
                  backgroundColor: '#0A0F0D',
                  color: 'white'
                }}
                value={formData.problemStatement}
                onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              >
                <option value="" className="bg-stadium-darker text-gray-400">Select a challenge</option>
                {challenges.map(c => (
                  <option key={c} value={c} className="bg-stadium-darker text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white mb-2">GitHub Repository URL *</label>
              <input
                type="url"
                required
                className="w-full glass-card px-4 py-2 bg-white/5 focus:outline-none focus:border-stadium-green text-white placeholder-gray-500"
                value={formData.githubRepo}
                onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
              <p className="text-gray-500 text-xs mt-1">Make sure your repository is PUBLIC</p>
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Register Now'}
            </button>
          </form>
          
          {result && (
            <div className={`mt-6 p-4 rounded-lg ${result.error ? 'bg-red-500/20 border border-red-500' : 'bg-stadium-green/20 border border-stadium-green'}`}>
              {result.error ? (
                <p className="text-red-400">{result.error}</p>
              ) : (
                <>
                  <p className="text-stadium-green font-semibold">✓ {result.message}</p>
                  <p className="text-gray-300 text-sm mt-2">Keep this ID for reference: {result.id}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}