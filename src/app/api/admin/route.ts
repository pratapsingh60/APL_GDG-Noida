import { NextRequest, NextResponse } from 'next/server'
import { setRegistrationOpen, getRegistrationOpen } from '@/lib/registrationStatus'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// In-memory storage for judging status
let judgingEnabled = false

export async function POST(request: NextRequest) {
  try {
    const { password, action } = await request.json()
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Toggle registration open/close
    if (action === 'toggle_registration') {
      const currentStatus = getRegistrationOpen()
      const newStatus = !currentStatus
      setRegistrationOpen(newStatus)
      return NextResponse.json({ 
        success: true, 
        registrationOpen: newStatus 
      })
    }
    
    // Toggle auto-judging on/off
    if (action === 'toggle_judging') {
      judgingEnabled = !judgingEnabled
      return NextResponse.json({ 
        success: true, 
        judgingEnabled: judgingEnabled 
      })
    }
    
    // Get all stats
    if (action === 'get_stats') {
      return NextResponse.json({
        totalParticipants: 0,
        judged: 0,
        disqualified: 0,
        pending: 0,
        registrationOpen: getRegistrationOpen(),
        judgingEnabled: judgingEnabled,
        participants: []
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Admin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}