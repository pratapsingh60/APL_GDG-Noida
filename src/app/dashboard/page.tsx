'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Submission {
  id: string
  teamName: string
  repoUrl: string
  members: string[]
  problemStatement: string
  judged: boolean
  score: number | null
  details?: {
    finalScore: number
    commitScore: number
    timingScore: number
    messageScore: number
    authenticityScore: number
    warnings: string[]
    commitCount: number
    commitTimeline: Array<{ sha: string; message: string; date: string; author: string }>
  }
}

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<Submission | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions')
      const data = await response.json()
      setSubmissions(data.sort((a: Submission, b: Submission) => (b.score || 0) - (a.score || 0)))
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const judgeTeam = async (id: string) => {
    try {
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: id })
      })
      const data = await response.json()
      if (data.success) {
        fetchSubmissions() // Refresh the list
      } else {
        alert('Judging failed: ' + data.error)
      }
    } catch (error) {
      alert('Failed to judge submission')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-green"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stadium-darker pt-24">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-stadium-green">Leaderboard</h1>
          <Link href="/submission" className="btn-secondary">
            + New Submission
          </Link>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left">Rank</th>
                  <th className="px-6 py-4 text-left">Team</th>
                  <th className="px-6 py-4 text-left">Project</th>
                  <th className="px-6 py-4 text-center">Commits</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, idx) => (
                  <tr key={sub.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4 font-bold">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td className="px-6 py-4 font-semibold">{sub.teamName}</td>
                    <td className="px-6 py-4">
                      <a href={sub.repoUrl} target="_blank" className="text-stadium-green hover:underline text-sm">
                        View Repo
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">{sub.details?.commitCount || '-'}</td>
                    <td className="px-6 py-4 text-center font-bold text-stadium-green text-xl">
                      {sub.score !== null ? sub.score : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${sub.judged ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {sub.judged ? 'Judged' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!sub.judged ? (
                        <button
                          onClick={() => judgeTeam(sub.id)}
                          className="text-stadium-green hover:underline text-sm"
                        >
                          Judge Now
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedTeam(sub)}
                          className="text-blue-400 hover:underline text-sm"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {selectedTeam && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedTeam(null)}>
            <div className="glass-card max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-stadium-green">{selectedTeam.teamName}</h2>
                <button onClick={() => setSelectedTeam(null)} className="hover:bg-white/10 p-2 rounded">✕</button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Score Breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-3">
                    <div className="text-sm text-gray-400">Commit Score (40%)</div>
                    <div className="text-2xl font-bold text-stadium-green">{selectedTeam.details?.commitScore}</div>
                  </div>
                  <div className="glass-card p-3">
                    <div className="text-sm text-gray-400">Timing Score (30%)</div>
                    <div className="text-2xl font-bold text-stadium-green">{selectedTeam.details?.timingScore}</div>
                  </div>
                  <div className="glass-card p-3">
                    <div className="text-sm text-gray-400">Message Score (20%)</div>
                    <div className="text-2xl font-bold text-stadium-green">{selectedTeam.details?.messageScore}</div>
                  </div>
                  <div className="glass-card p-3">
                    <div className="text-sm text-gray-400">Authenticity (10%)</div>
                    <div className="text-2xl font-bold text-stadium-green">{selectedTeam.details?.authenticityScore}</div>
                  </div>
                </div>
              </div>
              
              {selectedTeam.details?.warnings && selectedTeam.details.warnings.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-yellow-400">Warnings</h3>
                  {selectedTeam.details.warnings.map((w, i) => (
                    <div key={i} className="text-sm text-yellow-400/80">⚠️ {w}</div>
                  ))}
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-2">Commit Timeline</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedTeam.details?.commitTimeline.map((commit, i) => (
                    <div key={i} className="glass-card p-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stadium-green">{new Date(commit.date).toLocaleTimeString()}</span>
                        <span className="text-gray-400">{commit.author}</span>
                      </div>
                      <div className="text-white mt-1">{commit.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}