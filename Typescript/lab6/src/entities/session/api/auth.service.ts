import { http } from '@/shared/api'
import type { AuthSession } from '../model/types'
import type { User } from '@/entities/user'

interface LoginResponse extends User {
  accessToken: string
  refreshToken: string
}

interface RefreshResponse {
  accessToken: string
  refreshToken?: string
}

export class AuthService {
  async login(username: string, password: string): Promise<AuthSession> {
    const response = await http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
      skipAuth: true,
    })
    const { accessToken, refreshToken, ...user } = response
    return { accessToken, refreshToken, user }
  }

  me(): Promise<User> {
    return http<User>('/auth/me')
  }

  refresh(refreshToken: string): Promise<RefreshResponse> {
    return http<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
      skipAuth: true,
    })
  }
}
