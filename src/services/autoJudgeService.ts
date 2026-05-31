import { getAllParticipants, updateParticipantInSheet } from './sheetsService'
import { fetchRepoCommits, fetchRepoMetadata } from './githubService'
import { calculateFinalScore } from './scoringEngine'

// Challenge timeline (6 PM to 10 PM IST on May 31, 2026)
// Use UTC to avoid timezone issues
export const CHALLENGE_START = new Date('2026-05-01T00:00:00Z')  // Z = UTC
export const CHALLENGE_END = new Date('2026-06-30T23:59:59Z')    // Z = UTC
export const JUDGING_STOP = new Date('2026-12-31T23:59:59+05:30')

// Check if judging should be active
export function isJudgingActive(judgingEnabled: boolean): boolean {
  return judgingEnabled
}

// Judge a single participant
export async function judgeParticipant(participant: any): Promise<any> {
  const pId = participant['ID '] || participant.ID || participant.id;
  try {
    console.log(`[AutoJudge] Judging ${pId}: ${participant['Full Name']}`)
    console.log(`[AutoJudge] Looking for commits between:`, CHALLENGE_START.toISOString(), 'and', CHALLENGE_END.toISOString())
    const githubRepo = participant['Github Repo'] || participant['GitHub Repo']
    
    if (!githubRepo) {
      return {
        ID: pId,
        'Full Name': participant['Full Name'],
        Judged: 'YES',
        Disqualified: 'YES',
        'Disqualify Reason': 'No GitHub repo provided',
        Score: 0,
        'Commit Count': 0
      }
    }
    
    const commits = await fetchRepoCommits(githubRepo, CHALLENGE_START, CHALLENGE_END)
    const repoMetadata = await fetchRepoMetadata(githubRepo)
    
    const disqualifyReason = checkDisqualification(commits, repoMetadata)
    
    if (disqualifyReason) {
      return {
        ID: pId,
        'Full Name': participant['Full Name'],
        Judged: 'YES',
        Disqualified: 'YES',
        'Disqualify Reason': disqualifyReason,
        Score: 0,
        'Commit Count': 0
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
    
    console.log(`[AutoJudge] Score for ${pId}: ${scoreResult.finalScore} (${commits.length} commits)`)
    
    return {
      ID: pId,
      'Full Name': participant['Full Name'],
      Judged: 'YES',
      Disqualified: 'NO',
      'Disqualify Reason': '',
      Score: scoreResult.finalScore,
      'Commit Count': commits.length,
      details: {
        ...scoreResult,
        commitCount: commits.length,
        commitTimeline,
        repoMetadata
      }
    }
    
  } catch (error: any) {
    console.error(`[AutoJudge] Error judging ${pId}:`, error.message)
    return {
      ID: pId,
      'Full Name': participant['Full Name'],
      Judged: 'YES',
      Disqualified: 'YES',
      'Disqualify Reason': `GitHub API Error: ${error.message}`,
      Score: 0,
      'Commit Count': 0
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
  
  return null
}

// Auto-judge all pending participants from Google Sheets
export async function autoJudgeAll(): Promise<{ updated: any[]; failed: number }> {
  const updated = []
  let failed = 0
  
  const allParticipants = await getAllParticipants()
  
  const unjudged = allParticipants.filter((p: any) => p.Judged !== 'YES')
  
  if (unjudged.length === 0) {
    console.log('[AutoJudge] No pending participants to judge')
    return { updated: [], failed: 0 }
  }
  
  console.log(`[AutoJudge] Judging ${unjudged.length} participants...`)
  
  for (const participant of unjudged) {
    const judged = await judgeParticipant(participant)
    
    await updateParticipantInSheet({
      id: judged.ID,
      judged: judged.Judged,
      disqualified: judged.Disqualified,
      disqualifyReason: judged['Disqualify Reason'] || '',
      score: String(judged.Score || 0),
      commitCount: String(judged['Commit Count'] || 0)
    })
    
    updated.push(judged)
    
    if (judged.Disqualified === 'YES' && judged['Disqualify Reason']?.includes('Error')) {
      failed++
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  console.log(`[AutoJudge] Completed: ${updated.length} judged, ${failed} failed`)
  return { updated, failed }
}