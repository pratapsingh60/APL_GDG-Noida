// In-memory storage for registration status
let registrationOpen = true

export function setRegistrationOpen(status: boolean) {
  registrationOpen = status
  return registrationOpen
}

export function getRegistrationOpen() {
  return registrationOpen
}