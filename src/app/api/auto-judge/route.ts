import { NextResponse } from 'next/server'
import { autoJudgeAll } from '@/services/autoJudgeService'
import { getJudgingEnabled, setJudgingEnabled } from '@/lib/registrationStatus'

export async function GET() {
  try {
    const isEnabled = getJudgingEnabled()
    console.log('Auto-judge called, judgingEnabled:', isEnabled)
    
    if (!isEnabled) {
      return NextResponse.json({ 
        message: 'Judging is not active', 
        judgingEnabled: false, 
        active: false 
      })
    }
    
    const { updated, failed } = await autoJudgeAll()
    
    return NextResponse.json({
      success: true,
      message: `Judged ${updated.length} participants (${failed} failed)`,
      active: true,
      judgedCount: updated.filter((p: any) => !p.disqualified).length,
      disqualifiedCount: updated.filter((p: any) => p.disqualified).length
    })
    
  } catch (error: any) {
    console.error('Auto-judge error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { enabled } = await request.json()
  setJudgingEnabled(enabled)
  console.log('Auto-judge enabled set to:', enabled)
  return NextResponse.json({ success: true, judgingEnabled: enabled })
}