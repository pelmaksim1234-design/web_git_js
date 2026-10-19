import type { Participant } from '../types'

const STORAGE_KEY = 'vue-lottery-participants'

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const participant = value as Record<string, unknown>
  return (
    typeof participant.id === 'string' &&
    typeof participant.name === 'string' &&
    typeof participant.dateOfBirth === 'string' &&
    typeof participant.email === 'string' &&
    typeof participant.phone === 'string'
  )
}

export function loadParticipants(): Participant[] {
  const serialized = window.localStorage.getItem(STORAGE_KEY)
  if (serialized === null) {
    return []
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(serialized)
  } catch (error) {
    throw new Error('Збережені дані учасників пошкоджені.', { cause: error })
  }

  if (!Array.isArray(parsed) || !parsed.every(isParticipant)) {
    throw new Error('Збережені дані учасників мають неправильний формат.')
  }

  return parsed
}

export function saveParticipants(participants: Participant[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(participants))
}
