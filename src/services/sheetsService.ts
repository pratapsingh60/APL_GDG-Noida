const SHEETS_API_URL = process.env.NEXT_PUBLIC_SHEETS_API_URL ||'https://script.google.com/macros/s/AKfycbyh-_k6gDv00LXYEZ2lt8sk1RI2pgmzyS3KjgEGRslrjyxVvCO0bOUGU0-JyDEEBzKI/exec'

// Get all participants from Google Sheets
export async function getAllParticipants() {
  try {
    const response = await fetch(SHEETS_API_URL)
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching participants:', error)
    return []
  }
}

// Add a new participant to Google Sheets
export async function addParticipant(participant: any) {
  try {
    const response = await fetch(SHEETS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participant)
    })
    return await response.json()
  } catch (error) {
    console.error('Error adding participant:', error)
    return { success: false, error: 'Network error' }
  }
}

// Update participant after judging
export async function updateParticipantInSheet(participant: {
  id: string;
  judged: string;
  disqualified: string;
  disqualifyReason: string;
  score: string;
  commitCount: string;
}) {
  try {
    console.log('Updating participant in sheet:', participant)
    
    const response = await fetch(SHEETS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'update',
        id: participant.id,
        judged: participant.judged,
        disqualified: participant.disqualified,
        disqualifyReason: participant.disqualifyReason,
        score: participant.score,
        commitCount: participant.commitCount
      })
    })
    
    const result = await response.json()
    console.log('Update result:', result)
    return result
  } catch (error) {
    console.error('Error updating participant:', error)
    return { success: false, error: 'Network error' }
  }
}