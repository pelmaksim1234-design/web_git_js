import type { Pinia } from 'pinia'
import { AuthService } from '@/entities/session'
import { clearAuthSession, readAuthSession, saveAuthSession } from '@/entities/session'
import { UserService } from '@/entities/user'
import { configureHttpAuth, HttpError } from '@/shared/api'

interface ApplicationServices {
  auth: AuthService
  users: UserService
}

declare module 'pinia' {
  interface Pinia {
    $services: ApplicationServices
  }
}

export function registerServices(pinia: Pinia): void {
  const auth = new AuthService()
  pinia.$services = {
    auth,
    users: new UserService(),
  }

  configureHttpAuth({
    getAccessToken: () => readAuthSession()?.accessToken ?? null,
    async refreshAccessToken(): Promise<string> {
      const session = readAuthSession()
      if (session === null) {
        throw new HttpError('Сесію завершено. Увійдіть знову.', 401)
      }

      const tokens = await auth.refresh(session.refreshToken)
      const refreshedSession = {
        ...session,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? session.refreshToken,
      }
      saveAuthSession(refreshedSession)
      return refreshedSession.accessToken
    },
    clearSession: clearAuthSession,
  })
}
