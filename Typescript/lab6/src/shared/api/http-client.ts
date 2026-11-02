interface HttpOptions extends RequestInit {
  skipAuth?: boolean
  retried?: boolean
}

export interface HttpAuthProvider {
  getAccessToken(): string | null
  refreshAccessToken(): Promise<string>
  clearSession(): void
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
let authProvider: HttpAuthProvider | null = null

export function configureHttpAuth(provider: HttpAuthProvider): void {
  authProvider = provider
}

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
  if (authProvider === null) {
    throw new HttpError('Сесію завершено. Увійдіть знову.', 401)
  }

  refreshRequest = authProvider.refreshAccessToken()
  try {
    return await refreshRequest
  } catch (error) {
    authProvider.clearSession()
    throw error
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
    const token = authProvider?.getAccessToken()
    if (token !== undefined && token !== null) {
      headers.set('Authorization', `Bearer ${token}`)
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
