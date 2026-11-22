export class HttpError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
  }
}

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
  ?? 'https://dummyjson.com'

export async function httpRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new HttpError('Не вдалося підключитися до сервера.')
  }

  if (!response.ok) {
    let message = `Запит завершився помилкою (${response.status}).`
    try {
      const body = await response.json() as { message?: string }
      if (body.message) message = body.message
    } catch {
      // The status code is enough when the response has no JSON body.
    }
    throw new HttpError(message, response.status)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
