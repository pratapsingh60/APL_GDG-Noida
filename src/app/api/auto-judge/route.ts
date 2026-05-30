import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { autoJudgeAll, isJudgingActive } from '@/services/autoJudgeService'

const participantsFile = path.join(process.cwd(), 'src/data/participants.json')

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(participantsFile, 'utf8'))
    
    if (!isJudgingActive(data.judgingEnabled)) {
      return NextResponse.json({ 
        message: 'Judging is not active',
        judgingEnabled: data.judgingEnabled,
        active: false
      })
    }
    
    const unjudged = data.participants.filter((p: any) => !p.judged)
    
    if (unjudged.length === 0) {
      return NextResponse.json({ 
        message: 'All participants have been judged',
        active: true,
        judged: data.participants.filter((p: any) => p.judged).length
      })
    }
    
    const { updated, failed } = await autoJudgeAll(unjudged)
    
    for (const updatedParticipant of updated) {
      const index = data.participants.findIndex((p: any) => p.id === updatedParticipant.id)
      if (index !== -1) {
        data.participants[index] = updatedParticipant
      }
    }
    
    data.lastUpdated = new Date().toISOString()
    fs.writeFileSync(participantsFile, JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      message: `Judged ${updated.length} participants (${failed} failed)`,
      active: true
    })
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}