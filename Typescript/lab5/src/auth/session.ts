import type { AuthSession, User } from '../types'

const SESSION_KEY = 'lab5-auth-session'

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const user = value as Record<string, unknown>
  return (
    typeof user.id === 'number' &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    typeof user.email === 'string' &&
    typeof user.username === 'string'
  )
}

export function readAuthSession(): AuthSession | null {
  const serialized = window.localStorage.getItem(SESSION_KEY)
  if (serialized === null) {
    return null
  }

  let value: unknown
  try {
    value = JSON.parse(serialized)
  } catch (error) {
    throw new Error('Збережену сесію пошкоджено. Очистіть дані сайту та увійдіть знову.', {
      cause: error,
    })
  }

  if (
    typeof value !== 'object' ||
    value === null ||
    !('accessToken' in value) ||
    typeof value.accessToken !== 'string' ||
    !('refreshToken' in value) ||
    typeof value.refreshToken !== 'string' ||
    !('user' in value) ||
    !isUser(value.user)
  ) {
    throw new Error('Збережена сесія має неправильний формат. Очистіть дані сайту та увійдіть знову.')
  }

  return value as AuthSession
}

export function saveAuthSession(session: AuthSession): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearAuthSession(): void {
  window.localStorage.removeItem(SESSION_KEY)
}
