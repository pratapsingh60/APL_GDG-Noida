const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbyh-_k6gDv00LXYEZ2lt8sk1RI2pgmzyS3KjgEGRslrjyxVvCO0bOUGU0-JyDEEBzKI/exec'

export async function getAllParticipants() {
  const response = await fetch(SHEETS_API_URL)
  return response.json()
}

export async function addParticipant(participant: any) {
  const response = await fetch(SHEETS_API_URL, {
    method: 'POST',
    body: JSON.stringify(participant)
  })
  return response.json()
}

export async function updateParticipant(participant: any) {
  // For updates, you'd need a separate endpoint
  // Or just use POST with an 'update' flag
  const response = await fetch(SHEETS_API_URL, {
    method: 'POST', 
    body: JSON.stringify({ action: 'update', ...participant })
  })
  return response.json()
}