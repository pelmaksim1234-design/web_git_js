import type { User } from '@/entities/user'

export interface AuthSession {
  accessToken: string
  refreshToken: string
  user: User
}
