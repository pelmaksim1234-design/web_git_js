import { clearAuthSession, readAuthSession, saveAuthSession } from '../auth/session'
import type { AuthSession } from '../types'

interface HttpOptions extends RequestInit {
  skipAuth?: boolean
  retried?: boolean
}

interface RefreshResponse {
  accessToken: string
  refreshToken?: string
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

let refreshRequest: Promise<string> | null = null

function getBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')
  if (!baseUrl) {
    throw new Error('Не задано VITE_API_URL. Створіть файл .env на основі .env.example.')
  }
  return baseUrl
}

async function refreshAccessToken(): Promise<string> {
  if (refreshRequest !== null) {
    return refreshRequest
  }

  refreshRequest = (async () => {
    const session = readAuthSession()
    if (session === null) {
      throw new HttpError('Сесію завершено. Увійдіть знову.', 401)
    }

    const response = await fetch(`${getBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken, expiresInMins: 30 }),
    })

    if (!response.ok) {
      clearAuthSession()
      throw new HttpError('Не вдалося оновити сесію. Увійдіть знову.', response.status)
    }

    const tokens = (await response.json()) as RefreshResponse
    const nextSession: AuthSession = {
      ...session,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? session.refreshToken,
    }
    saveAuthSession(nextSession)
    return nextSession.accessToken
  })()

  try {
    return await refreshRequest
  } finally {
    refreshRequest = null
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  const body = await response.text()
  if (body) {
    try {
      const parsed: unknown = JSON.parse(body)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'message' in parsed &&
        typeof parsed.message === 'string'
      ) {
        return parsed.message
      }
    } catch {
      return body
    }
  }
  return `HTTP ${response.status}: ${response.statusText}`
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { skipAuth = false, retried = false, ...requestOptions } = options
  const headers = new Headers(requestOptions.headers)
  if (requestOptions.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (!skipAuth) {
    const session = readAuthSession()
    if (session !== null) {
      headers.set('Authorization', `Bearer ${session.accessToken}`)
    }
  }

  const response = await fetch(`${getBaseUrl()}${path}`, { ...requestOptions, headers })
  if (response.status === 401 && !skipAuth && !retried && !path.startsWith('/auth/')) {
    const accessToken = await refreshAccessToken()
    headers.set('Authorization', `Bearer ${accessToken}`)
    return http<T>(path, { ...requestOptions, headers, retried: true })
  }

  if (!response.ok) {
    throw new HttpError(await readErrorMessage(response), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
