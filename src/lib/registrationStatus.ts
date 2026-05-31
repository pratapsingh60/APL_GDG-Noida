// In-memory storage for registration status
let registrationOpen = true
let projectorVisible = true

export function setRegistrationOpen(status: boolean) {
  registrationOpen = status
  return registrationOpen
}

export function getRegistrationOpen() {
  return registrationOpen
}

export function setProjectorVisible(visible: boolean) {
  projectorVisible = visible
  return projectorVisible
}

export function getProjectorVisible() {
  return projectorVisible
}