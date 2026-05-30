export interface Challenge {
  id: string
  title: string
  icon: string
  tagline: string
  description: string
  scoring: string[]
  timeLimit: string
}

export interface Participant {
  id: string
  rank: number
  name: string
  projectName: string
  projectDescription: string
  totalScore: number
  aiScore: number
  communityScore: number
  commitTimeline: Commit[]
  feedback: string[]
}

export interface Commit {
  id: string
  message: string
  timestamp: string
  score: number
}

export interface ScoreboardData {
  lastUpdated: string
  participants: Participant[]
}

export interface Reaction {
  emoji: string
  id: string
  timestamp: number
  x: number
  y: number
}