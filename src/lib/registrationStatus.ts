// In-memory storage for registration status
let registrationOpen = true
let projectorVisible = true
let judgingEnabled = false

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

export function setJudgingEnabled(enabled: boolean) {
  judgingEnabled = enabled
  return judgingEnabled
}

export function getJudgingEnabled() {
  return judgingEnabled
}