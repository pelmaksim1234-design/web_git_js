import { defineStore } from 'pinia'
import { ServiceProvider } from '../services/service-provider'
import type { CreateUserDto, UpdateUserDto, User } from '../types'

const PAGE_SIZE = 10

function matchesQuery(user: User, query: string): boolean {
  const normalized = query.trim().toLocaleLowerCase()
  return (
    normalized.length === 0 ||
    `${user.firstName} ${user.lastName} ${user.username} ${user.email}`
      .toLocaleLowerCase()
      .includes(normalized)
  )
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    total: 0,
    loading: false,
    error: null as string | null,
    loadedKey: '',
    knownUsers: {} as Record<number, User>,
    localChanges: {} as Record<number, User>,
    localCreated: [] as User[],
    localDeleted: [] as User[],
  }),
  actions: {
    async fetchUsers(page: number, query: string): Promise<void> {
      const key = `${page}:${query.trim().toLocaleLowerCase()}`
      if (this.loadedKey === key) {
        return
      }

      this.loading = true
      this.error = null
      try {
        const response = await ServiceProvider.users.getAll({
          limit: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
          query: query.trim() || undefined,
        })
        const visible = response.users
          .filter((user) => !this.localDeleted.some((deleted) => deleted.id === user.id))
          .map((user) => this.localChanges[user.id] ?? user)
        const additions =
          page === 1
            ? this.localCreated.filter(
                (user) =>
                  matchesQuery(user, query) &&
                  !visible.some((existing) => existing.id === user.id) &&
                  !this.localDeleted.some((deleted) => deleted.id === user.id),
              )
            : []

        this.users = [...additions, ...visible]
        this.total =
          response.total +
          this.localCreated.filter((user) => matchesQuery(user, query)).length -
          this.localDeleted.filter((user) => matchesQuery(user, query)).length
        this.loadedKey = key
        for (const user of this.users) {
          this.knownUsers[user.id] = user
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Не вдалося завантажити користувачів.'
      } finally {
        this.loading = false
      }
    },
    async getUser(id: number): Promise<User> {
      const cached = this.knownUsers[id]
      if (cached !== undefined) {
        return cached
      }

      const user = await ServiceProvider.users.getById(id)
      this.knownUsers[id] = user
      return user
    },
    async createUser(data: CreateUserDto): Promise<User> {
      const created = await ServiceProvider.users.create(data)
      this.localCreated = [created, ...this.localCreated.filter((user) => user.id !== created.id)]
      this.localChanges[created.id] = created
      this.knownUsers[created.id] = created
      if (matchesQuery(created, this.currentQuery)) {
        this.total += 1
        if (this.currentPage === 1) {
          this.users = [created, ...this.users.filter((user) => user.id !== created.id)].slice(
            0,
            PAGE_SIZE,
          )
        }
      }
      return created
    },
    async updateUser(id: number, data: UpdateUserDto): Promise<User> {
      const updated = await ServiceProvider.users.update(id, data)
      const previous = this.knownUsers[id]
      const merged = { ...previous, ...updated, ...data, id } as User
      const wasVisible = this.users.some((user) => user.id === id)
      const wasCreatedLocally = this.localCreated.some((user) => user.id === id)
      const matchedBefore = previous !== undefined && matchesQuery(previous, this.currentQuery)
      const matchedCurrentQuery = matchesQuery(merged, this.currentQuery)
      this.localChanges[id] = merged
      this.knownUsers[id] = merged
      this.localCreated = this.localCreated.map((user) => (user.id === id ? merged : user))
      if (matchedBefore !== matchedCurrentQuery) {
        this.total = Math.max(0, this.total + (matchedCurrentQuery ? 1 : -1))
      }
      if (wasVisible || wasCreatedLocally) {
        const remaining = this.users.filter((user) => user.id !== id)
        this.users =
          matchedCurrentQuery && this.currentPage === 1
            ? [merged, ...remaining].slice(0, PAGE_SIZE)
            : remaining
      }
      return merged
    },
    async deleteUser(id: number): Promise<void> {
      const deleted = await ServiceProvider.users.delete(id)
      const existing = this.knownUsers[id] ?? deleted
      const wasCreatedLocally = this.localCreated.some((user) => user.id === id)
      if (!wasCreatedLocally) {
        this.localDeleted = [existing, ...this.localDeleted.filter((user) => user.id !== id)]
      }
      this.localCreated = this.localCreated.filter((user) => user.id !== id)
      delete this.localChanges[id]
      delete this.knownUsers[id]
      this.users = this.users.filter((user) => user.id !== id)
      if (matchesQuery(existing, this.currentQuery)) {
        this.total = Math.max(0, this.total - 1)
      }
    },
  },
  getters: {
    currentPage: (state): number => {
      const [page] = state.loadedKey.split(':')
      const parsed = Number(page)
      return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
    },
    currentQuery: (state): string => state.loadedKey.split(':').slice(1).join(':'),
  },
})
