import { getActivePinia, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { clearAuthSession, readAuthSession, saveAuthSession } from './session'
import type { AuthSession } from './types'
import type { User } from '@/entities/user'

export const useSessionStore = defineStore('session', () => {
  const pinia = getActivePinia()
  if (pinia === undefined || !('$services' in pinia)) {
    throw new Error('Сервіси застосунку не зареєстровано.')
  }

  const authService = pinia.$services.auth
  const session = ref<AuthSession | null>(readAuthSession())
  const isAuthenticated = computed(() => session.value !== null && session.value.accessToken.length > 0)
  const currentUser = computed(() => session.value?.user ?? null)

  async function setSession(username: string, password: string): Promise<void> {
    const nextSession = await authService.login(username, password)
    saveAuthSession(nextSession)
    session.value = nextSession
  }

  async function loadCurrentUser(): Promise<User> {
    const user = await authService.me()
    if (session.value === null) {
      throw new Error('Немає активної сесії.')
    }

    session.value = { ...session.value, user }
    saveAuthSession(session.value)
    return user
  }

  function clearSession(): void {
    clearAuthSession()
    session.value = null
  }

  return { session, isAuthenticated, currentUser, setSession, loadCurrentUser, clearSession }
})
