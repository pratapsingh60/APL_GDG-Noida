'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Trophy, Gamepad, Bot, Users, BarChart, UserPlus, Trophy as TrophyIcon, Eye } from 'lucide-react'
import challengesData from '@/data/challenges.json'

const iconMap: Record<string, any> = { Gamepad, Bot, Users, BarChart }

export default function Home() {
  const [challenges, setChallenges] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [projectorVisible, setProjectorVisible] = useState(true)

  // Fetch projector visibility setting
  useEffect(() => {
    fetch('/api/header-settings')
      .then(res => res.json())
      .then(data => setProjectorVisible(data.projectorVisible))
      .catch(err => console.error('Failed to fetch projector settings:', err))
  }, [])

  useEffect(() => {
    setChallenges(challengesData)
  }, [])

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('May 31, 2026 18:00:00').getTime()
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-stadium-darker">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-8">
        <div className="absolute inset-0 bg-gradient-to-br from-stadium-green/5 via-transparent to-stadium-green/10" />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center">
            <div className="inline-block glass-card px-6 py-2 rounded-full mb-6 animate-pulse">
              <span className="text-stadium-green font-semibold">🚀 Big Plays. Big Builds.</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-stadium-green to-white bg-clip-text text-transparent">
              GDG Noida APL 2026
            </h1>
            
            <p className="text-xl text-gray-300 mb-12">Agentic Premier League</p>
            
            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-12">
              <div className="glass-card p-3 text-center">
                <div className="text-3xl font-bold text-stadium-green">{timeLeft.days}</div>
                <div className="text-xs text-gray-400">Days</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="text-3xl font-bold text-stadium-green">{timeLeft.hours}</div>
                <div className="text-xs text-gray-400">Hours</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="text-3xl font-bold text-stadium-green">{timeLeft.minutes}</div>
                <div className="text-xs text-gray-400">Mins</div>
              </div>
              <div className="glass-card p-3 text-center">
                <div className="text-3xl font-bold text-stadium-green">{timeLeft.seconds}</div>
                <div className="text-xs text-gray-400">Secs</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center mb-12">
              <div className="flex items-center gap-3 glass-card px-6 py-3">
                <Calendar className="text-stadium-green" />
                <span>31st May 2026</span>
              </div>
              <div className="flex items-center gap-3 glass-card px-6 py-3">
                <MapPin className="text-stadium-green" />
                <span>Moire Cafe, Noida</span>
              </div>
              <div className="flex items-center gap-3 glass-card px-6 py-3">
                <Trophy className="text-stadium-green" />
                <span>Exciting Schwags</span>
              </div>
            </div>
            
            {/* Main CTA Buttons - Now with conditional Live button */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register" className="btn-primary flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Register Now
              </Link>
              <Link href="/leaderboard" className="btn-secondary flex items-center gap-2">
                <TrophyIcon className="w-5 h-5" />
                View Leaderboard
              </Link>
              {projectorVisible && (
                <Link href="/projector" className="btn-secondary flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Projector
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">The Challenges</h2>
        <p className="text-gray-400 text-center mb-12">Build something extraordinary in 4 hours</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const Icon = iconMap[challenge.icon] || Gamepad
            return (
              <div key={challenge.id} className="glass-card p-6 hover:glow-border transition-all duration-300 group">
                <Icon className="text-stadium-green w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{challenge.tagline}</p>
                <p className="text-gray-300 text-sm">{challenge.description.substring(0, 100)}...</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-stadium-green">⏱️ {challenge.timeLimit}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="glass-card p-8">
            <div className="text-5xl font-bold text-stadium-green mb-2">50+</div>
            <div className="text-gray-400">Developers</div>
          </div>
          <div className="glass-card p-8">
            <div className="text-5xl font-bold text-stadium-green mb-2">4</div>
            <div className="text-gray-400">Hours</div>
          </div>
          <div className="glass-card p-8">
            <div className="text-5xl font-bold text-stadium-green mb-2">4</div>
            <div className="text-gray-400">Challenges</div>
          </div>
        </div>
      </div>

      {/* Admin Access - Small link at bottom */}
      <div className="text-center pb-8">
        <Link href="/admin" className="text-gray-500 text-xs hover:text-stadium-green transition">
          Admin Access
        </Link>
      </div>
    </div>
  )
}