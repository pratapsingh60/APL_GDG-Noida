import { NextResponse } from 'next/server'
import { autoJudgeAll } from '@/services/autoJudgeService'

// This should match the same variable - in production, use a database
let judgingEnabled = false

export async function GET() {
  try {
    console.log('Auto-judge called, judgingEnabled:', judgingEnabled)
    
    if (!judgingEnabled) {
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
  judgingEnabled = enabled
  console.log('Auto-judge enabled set to:', judgingEnabled)
  return NextResponse.json({ success: true, judgingEnabled })
}