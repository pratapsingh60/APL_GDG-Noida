import fs from 'fs'
import path from 'path'
import { fetchRepoCommits, fetchRepoMetadata } from './githubService'
import { calculateFinalScore } from './scoringEngine'

const participantsFile = path.join(process.cwd(), 'src/data/participants.json')

// Challenge timeline (6 PM to 10 PM IST on May 31, 2026)
export const CHALLENGE_START = new Date('2026-05-31T18:00:00+05:30')
export const CHALLENGE_END = new Date('2026-05-31T22:00:00+05:30')
export const JUDGING_STOP = new Date('2026-05-31T22:30:00+05:30')

// Check if judging should be active
export function isJudgingActive(judgingEnabled: boolean): boolean {
  if (!judgingEnabled) return false
  const now = new Date()
  return now <= JUDGING_STOP
}

// Judge a single participant
export async function judgeParticipant(participant: any): Promise<any> {
  try {
    console.log(`[AutoJudge] Judging ${participant.id}: ${participant.fullName}`)
    
    const commits = await fetchRepoCommits(
      participant.githubRepo,
      CHALLENGE_START,
      CHALLENGE_END
    )
    
    const repoMetadata = await fetchRepoMetadata(participant.githubRepo)
    
    // Check for disqualification
    const disqualifyReason = checkDisqualification(commits, repoMetadata)
    
    if (disqualifyReason) {
      return {
        ...participant,
        judged: true,
        disqualified: true,
        disqualifyReason,
        score: 0,
        judgedAt: new Date().toISOString()
      }
    }
    
    const commitMessages = commits.map((c: any) => c.commit.message)
    const commitTimeline = commits.map((c: any) => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message,
      date: c.commit.author.date,
      author: c.author?.login || 'unknown'
    }))
    
    const scoreResult = calculateFinalScore(
      commits.length,
      commitTimeline,
      commitMessages,
      repoMetadata.createdAt,
      CHALLENGE_START,
      CHALLENGE_END
    )
    
    return {
      ...participant,
      judged: true,
      disqualified: false,
      score: scoreResult.finalScore,
      details: {
        ...scoreResult,
        commitCount: commits.length,
        commitTimeline,
        repoMetadata
      },
      judgedAt: new Date().toISOString()
    }
    
  } catch (error: any) {
    console.error(`[AutoJudge] Error judging ${participant.id}:`, error.message)
    return {
      ...participant,
      judged: true,
      disqualified: true,
      disqualifyReason: `GitHub API Error: ${error.message}`,
      score: 0,
      judgedAt: new Date().toISOString()
    }
  }
}

// Check if participant should be disqualified
function checkDisqualification(commits: any[], repoMetadata: any): string | null {
  if (repoMetadata.isPrivate) {
    return 'Repository is private - cannot judge'
  }
  
  if (commits.length === 0) {
    return 'No commits during challenge period'
  }
  
  const now = new Date()
  if (now > JUDGING_STOP && commits.length === 0) {
    return 'No commits submitted before deadline'
  }
  
  return null
}

// Auto-judge all pending participants
export async function autoJudgeAll(participants: any[]): Promise<{ updated: any[]; failed: number }> {
  const updated = []
  let failed = 0
  
  for (const participant of participants) {
    if (!participant.judged) {
      const judged = await judgeParticipant(participant)
      updated.push(judged)
      if (judged.disqualified && judged.disqualifyReason?.includes('Error')) {
        failed++
      }
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  return { updated, failed }
}