import { NextRequest, NextResponse } from 'next/server'
import { setRegistrationOpen, getRegistrationOpen, setProjectorVisible, getProjectorVisible } from '@/lib/registrationStatus'
import { getAllParticipants } from '@/services/sheetsService'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'GDG_ogs_teamAPL2k26'

// Move judgingEnabled outside and make it persistent for the session
let judgingEnabled = false

export async function POST(request: NextRequest) {
  try {
    const { password, action } = await request.json()
    
    console.log('Admin action:', action)
    console.log('Current judgingEnabled:', judgingEnabled)
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (action === 'toggle_registration') {
      const newStatus = !getRegistrationOpen()
      setRegistrationOpen(newStatus)
      return NextResponse.json({ success: true, registrationOpen: newStatus })
    }
    
    if (action === 'toggle_judging') {
      judgingEnabled = !judgingEnabled
      console.log('Toggled judgingEnabled to:', judgingEnabled)
      return NextResponse.json({ success: true, judgingEnabled: judgingEnabled })
    }
    
    if (action === 'toggle_projector') {
      const newStatus = !getProjectorVisible()
      setProjectorVisible(newStatus)
      return NextResponse.json({ success: true, projectorVisible: newStatus })
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
        judgingEnabled: judgingEnabled,
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