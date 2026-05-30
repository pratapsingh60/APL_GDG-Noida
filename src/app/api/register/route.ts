import { NextRequest, NextResponse } from 'next/server'
import { addParticipant, getAllParticipants } from '@/services/sheetsService'
import { getRegistrationOpen } from '@/lib/registrationStatus'

function generateId(participants: any[]) {
  const nextNumber = participants.length + 1
  return `APL${nextNumber.toString().padStart(3, '0')}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, designation, gender, problemStatement, githubRepo } = body
    
    // Check if all fields are provided
    if (!fullName || !designation || !gender || !problemStatement || !githubRepo) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    
    // Check if registration is open
    if (!getRegistrationOpen()) {
      return NextResponse.json({ error: 'Registration is closed. Please contact the organizer.' }, { status: 400 })
    }
    
    const participants = await getAllParticipants()
    
    // Check if already registered
    const existing = participants.find((p: any) => p['GitHub Repo'] === githubRepo)
    if (existing) {
      return NextResponse.json({ error: 'GitHub repository already registered' }, { status: 400 })
    }
    
    const newParticipant = {
      id: generateId(participants),
      fullName,
      designation,
      gender,
      problemStatement,
      githubRepo,
      registeredAt: new Date().toISOString(),
      judged: false,
      disqualified: false,
      disqualifyReason: null,
      score: null,
      details: { commitCount: 0 }
    }
    
    const result = await addParticipant(newParticipant)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        id: newParticipant.id,
        message: 'Registration successful! Your ID is ' + newParticipant.id
      })
    } else {
      return NextResponse.json({ error: 'Failed to save to Google Sheets' }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const participants = await getAllParticipants()
    return NextResponse.json({
      registrationOpen: getRegistrationOpen(),
      participantCount: participants.length,
      participants: participants,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}