// Scoring rules based on commit count
export function calculateCommitScore(commitCount: number): number {
  if (commitCount === 1) return 10
  if (commitCount >= 2 && commitCount <= 3) return 40
  if (commitCount >= 4 && commitCount <= 8) return 100
  if (commitCount >= 9 && commitCount <= 12) return 80
  if (commitCount >= 13 && commitCount <= 16) return 50
  if (commitCount >= 17 && commitCount <= 20) return 20
  if (commitCount > 20) return 5
  return 0
}

// Calculate timing distribution score
export function calculateTimingScore(commits: any[], challengeStart: Date, challengeEnd: Date): number {
  if (commits.length <= 1) return 0
  
  const totalDuration = challengeEnd.getTime() - challengeStart.getTime()
  let totalSpread = 0
  
  for (let i = 1; i < commits.length; i++) {
    const gap = new Date(commits[i].date).getTime() - new Date(commits[i-1].date).getTime()
    totalSpread += gap
  }
  
  const avgGap = totalSpread / (commits.length - 1)
  const idealGap = totalDuration / 8 // Ideal spread over 8 intervals
  
  if (avgGap >= idealGap * 0.5) return 100
  if (avgGap >= idealGap * 0.3) return 70
  if (avgGap >= idealGap * 0.1) return 40
  return 20
}

// Bad commit messages
const badMessages = ['update', 'done', 'final', 'latest', 'test', 'fix', 'wip', 'tmp', 'temp', 'asd', 'qwe']
const goodPrefixes = ['feat', 'feature', 'add', 'implement', 'create', 'build', 'refactor', 'improve', 'optimize']

export function calculateMessageScore(commitMessages: string[]): number {
  if (commitMessages.length === 0) return 0
  
  let score = 0
  let badCount = 0
  let goodCount = 0
  
  for (const msg of commitMessages) {
    const lowerMsg = msg.toLowerCase()
    
    if (badMessages.some(bad => lowerMsg.includes(bad))) {
      badCount++
    } else if (goodPrefixes.some(good => lowerMsg.startsWith(good))) {
      goodCount++
    } else if (lowerMsg.length > 15) {
      goodCount++
    }
  }
  
  const total = commitMessages.length
  score = ((goodCount / total) * 100) - ((badCount / total) * 50)
  
  return Math.max(0, Math.min(100, score))
}

// Calculate authenticity score
export function calculateAuthenticityScore(
  commitCount: number,
  commits: any[],
  repoCreatedAt: Date,
  challengeStart: Date
): { score: number; warnings: string[] } {
  const warnings: string[] = []
  let score = 100
  
  // Check if repo created before challenge
  if (repoCreatedAt < challengeStart) {
    warnings.push('Repository created before challenge started')
    score -= 30
  }
  
  // Suspicious commit patterns
  if (commitCount === 1) {
    warnings.push('Only 1 commit - suspicious activity')
    score -= 40
  }
  
  if (commitCount > 20) {
    warnings.push('Unusually high commit count (20+)')
    score -= 20
  }
  
  // Check if all commits are clustered at the end
  if (commits.length > 1) {
    const lastCommit = new Date(commits[commits.length - 1].date)
    const firstCommit = new Date(commits[0].date)
    const lastHour = commits.filter((c: any) => {
      const commitDate = new Date(c.date)
      const hourBeforeEnd = new Date(lastCommit.getTime() - 60 * 60 * 1000)
      return commitDate >= hourBeforeEnd
    }).length
    
    if (lastHour === commits.length) {
      warnings.push('All commits pushed in final hour')
      score -= 30
    }
  }
  
  return { score: Math.max(0, score), warnings }
}

// Calculate final score
export function calculateFinalScore(
  commitCount: number,
  commits: any[],
  commitMessages: string[],
  repoCreatedAt: Date,
  challengeStart: Date,
  challengeEnd: Date
) {
  const commitScore = calculateCommitScore(commitCount)
  const timingScore = calculateTimingScore(commits, challengeStart, challengeEnd)
  const messageScore = calculateMessageScore(commitMessages)
  const { score: authenticityScore, warnings } = calculateAuthenticityScore(
    commitCount,
    commits,
    repoCreatedAt,
    challengeStart
  )
  
  const finalScore = 
    (commitScore * 0.4) +
    (timingScore * 0.3) +
    (messageScore * 0.2) +
    (authenticityScore * 0.1)
  
  return {
    finalScore: Math.round(finalScore),
    commitScore,
    timingScore,
    messageScore,
    authenticityScore,
    warnings
  }
}