import { NextRequest, NextResponse } from 'next/server'
import { setRegistrationOpen, getRegistrationOpen, setProjectorVisible, getProjectorVisible, setJudgingEnabled, getJudgingEnabled } from '@/lib/registrationStatus'
import { getAllParticipants } from '@/services/sheetsService'
import { autoJudgeAll, reSyncAll } from '@/services/autoJudgeService'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'GDG_ogs_teamAPL2k26'

export async function POST(request: NextRequest) {
  try {
    const { password, action } = await request.json()
    
    console.log('Admin action:', action)
    console.log('Current judgingEnabled:', getJudgingEnabled())
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (action === 'toggle_registration') {
      const newStatus = !getRegistrationOpen()
      setRegistrationOpen(newStatus)
      return NextResponse.json({ success: true, registrationOpen: newStatus })
    }
    
    if (action === 'toggle_judging') {
      const newStatus = !getJudgingEnabled()
      setJudgingEnabled(newStatus)
      console.log('Toggled judgingEnabled to:', newStatus)
      return NextResponse.json({ success: true, judgingEnabled: newStatus })
    }
    
    if (action === 'toggle_projector') {
      const newStatus = !getProjectorVisible()
      setProjectorVisible(newStatus)
      return NextResponse.json({ success: true, projectorVisible: newStatus })
    }

    if (action === 'trigger_judging') {
      const { updated, failed } = await autoJudgeAll()
      return NextResponse.json({
        success: true,
        message: `Judged ${updated.length} participants (${failed} failed)`,
        active: true,
        judgedCount: updated.filter((p: any) => !p.disqualified).length,
        disqualifiedCount: updated.filter((p: any) => p.disqualified).length
      })
    }

    if (action === 're_sync') {
      const { updated, failed } = await reSyncAll()
      return NextResponse.json({
        success: true,
        message: `Re-synced ${updated.length} participants (${failed} failed)`,
        updatedCount: updated.length,
        failedCount: failed
      })
    }
    
    if (action === 'get_stats') {
      const participants = await getAllParticipants()
      const judged = participants.filter((p: any) => p.Judged === 'YES' && p.Disqualified !== 'YES').length
      const disqualified = participants.filter((p: any) => p.Disqualified === 'YES').length
      const pending = participants.filter((p: any) => p.Judged !== 'YES').length
      
      return NextResponse.json({
        totalParticipants: participants.length,
        judged,
        disqualified,
        pending,
        registrationOpen: getRegistrationOpen(),
        judgingEnabled: getJudgingEnabled(),
        projectorVisible: getProjectorVisible(),
        participants: participants
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Admin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}