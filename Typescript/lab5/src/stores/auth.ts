import { defineStore } from 'pinia'
import { clearAuthSession, readAuthSession, saveAuthSession } from '../auth/session'
import { ServiceProvider } from '../services/service-provider'
import type { AuthSession, User } from '../types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: readAuthSession() as AuthSession | null,
  }),
  getters: {
    isAuthenticated: (state) => state.session !== null && state.session.accessToken.length > 0,
    currentUser: (state): User | null => state.session?.user ?? null,
  },
  actions: {
    async login(username: string, password: string): Promise<void> {
      const session = await ServiceProvider.auth.login(username, password)
      saveAuthSession(session)
      this.session = session
    },
    async loadCurrentUser(): Promise<User> {
      const user = await ServiceProvider.auth.me()
      if (this.session === null) {
        throw new Error('Немає активної сесії.')
      }
      this.session = { ...this.session, user }
      saveAuthSession(this.session)
      return user
    },
    logout(): void {
      clearAuthSession()
      this.session = null
    },
  },
})
