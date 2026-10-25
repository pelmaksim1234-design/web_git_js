import { http } from '../api/http-client'
import type { AuthSession, User } from '../types'

interface LoginResponse extends User {
  accessToken: string
  refreshToken: string
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
}
