import { getActivePinia, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CreateUserDto, UpdateUserDto, User } from './types'

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

export const useUsersStore = defineStore('users', () => {
  const pinia = getActivePinia()
  if (pinia === undefined || !('$services' in pinia)) {
    throw new Error('Сервіси застосунку не зареєстровано.')
  }

  const userService = pinia.$services.users
  const users = ref<User[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loadedKey = ref('')
  const knownUsers = ref<Record<number, User>>({})
  const localChanges = ref<Record<number, User>>({})
  const localCreated = ref<User[]>([])
  const localDeleted = ref<User[]>([])
  const currentPage = computed(() => {
    const parsed = Number(loadedKey.value.split(':')[0])
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
  })
  const currentQuery = computed(() => loadedKey.value.split(':').slice(1).join(':'))

  async function fetchUsers(page: number, query: string): Promise<void> {
    const key = `${page}:${query.trim().toLocaleLowerCase()}`
    if (loadedKey.value === key) {
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await userService.getAll({
        limit: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        query: query.trim() || undefined,
      })
      const visible = response.users
        .filter((user) => !localDeleted.value.some((deleted) => deleted.id === user.id))
        .map((user) => localChanges.value[user.id] ?? user)
      const additions =
        page === 1
          ? localCreated.value.filter(
              (user) =>
                matchesQuery(user, query) &&
                !visible.some((existing) => existing.id === user.id) &&
                !localDeleted.value.some((deleted) => deleted.id === user.id),
            )
          : []

      users.value = [...additions, ...visible]
      total.value =
        response.total +
        localCreated.value.filter((user) => matchesQuery(user, query)).length -
        localDeleted.value.filter((user) => matchesQuery(user, query)).length
      loadedKey.value = key
      for (const user of users.value) {
        knownUsers.value[user.id] = user
      }
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : 'Не вдалося завантажити користувачів.'
    } finally {
      loading.value = false
    }
  }

  async function getUser(id: number): Promise<User> {
    const cached = knownUsers.value[id]
    if (cached !== undefined) {
      return cached
    }

    const user = await userService.getById(id)
    knownUsers.value[id] = user
    return user
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    const created = await userService.create(data)
    localCreated.value = [created, ...localCreated.value.filter((user) => user.id !== created.id)]
    localChanges.value[created.id] = created
    knownUsers.value[created.id] = created
    if (matchesQuery(created, currentQuery.value)) {
      total.value += 1
      if (currentPage.value === 1) {
        users.value = [created, ...users.value.filter((user) => user.id !== created.id)].slice(
          0,
          PAGE_SIZE,
        )
      }
    }
    return created
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const updated = await userService.update(id, data)
    const previous = knownUsers.value[id]
    const merged = { ...previous, ...updated, ...data, id } as User
    const wasVisible = users.value.some((user) => user.id === id)
    const wasCreatedLocally = localCreated.value.some((user) => user.id === id)
    const matchedBefore = previous !== undefined && matchesQuery(previous, currentQuery.value)
    const matchedCurrentQuery = matchesQuery(merged, currentQuery.value)
    localChanges.value[id] = merged
    knownUsers.value[id] = merged
    localCreated.value = localCreated.value.map((user) => (user.id === id ? merged : user))
    if (matchedBefore !== matchedCurrentQuery) {
      total.value = Math.max(0, total.value + (matchedCurrentQuery ? 1 : -1))
    }
    if (wasVisible || wasCreatedLocally) {
      const remaining = users.value.filter((user) => user.id !== id)
      users.value =
        matchedCurrentQuery && currentPage.value === 1
          ? [merged, ...remaining].slice(0, PAGE_SIZE)
          : remaining
    }
    return merged
  }

  async function removeUser(id: number): Promise<void> {
    const deleted = await userService.delete(id)
    const existing = knownUsers.value[id] ?? deleted
    const wasCreatedLocally = localCreated.value.some((user) => user.id === id)
    if (!wasCreatedLocally) {
      localDeleted.value = [existing, ...localDeleted.value.filter((user) => user.id !== id)]
    }
    localCreated.value = localCreated.value.filter((user) => user.id !== id)
    delete localChanges.value[id]
    delete knownUsers.value[id]
    users.value = users.value.filter((user) => user.id !== id)
    if (matchesQuery(existing, currentQuery.value)) {
      total.value = Math.max(0, total.value - 1)
    }
  }

  return {
    users,
    total,
    loading,
    error,
    currentPage,
    currentQuery,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    removeUser,
  }
})
