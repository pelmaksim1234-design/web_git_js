<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '../stores/users'

const PAGE_SIZE = 10
const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const searchText = ref(typeof route.query.q === 'string' ? route.query.q : '')
const page = computed(() => {
  const value = Number(route.query.page ?? 1)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed(() => Math.max(1, Math.ceil(usersStore.total / PAGE_SIZE)))

watch(
  () => [route.query.page, route.query.q],
  async () => {
    searchText.value = query.value
    await usersStore.fetchUsers(page.value, query.value)
  },
  { immediate: true },
)

function submitSearch(): void {
  void router.replace({
    name: 'users',
    query: { q: searchText.value.trim() || undefined },
  })
}

function goToPage(nextPage: number): void {
  void router.push({
    name: 'users',
    query: {
      ...route.query,
      page: nextPage > 1 ? String(nextPage) : undefined,
    },
  })
}

async function deleteUser(id: number, name: string): Promise<void> {
  if (!window.confirm(`Видалити користувача ${name}?`)) {
    return
  }
  usersStore.error = null
  try {
    await usersStore.deleteUser(id)
  } catch (error) {
    usersStore.error =
      error instanceof Error ? error.message : 'Не вдалося видалити користувача.'
  }
}
</script>

<template>
  <section class="content-card">
    <div class="page-title-row">
      <div>
        <p class="eyebrow">Панель керування</p>
        <h1>Користувачі</h1>
        <p class="muted-copy">Пошук, перегляд та керування записами DummyJSON Users.</p>
      </div>
      <RouterLink class="button button--primary" :to="{ name: 'user-create' }">
        Додати користувача
      </RouterLink>
    </div>

    <form class="search-form" role="search" @submit.prevent="submitSearch">
      <label class="visually-hidden" for="user-search">Пошук користувачів</label>
      <input
        id="user-search"
        v-model="searchText"
        type="search"
        placeholder="Ім’я, username або email"
      />
      <button class="button button--primary" type="submit">Знайти</button>
    </form>

    <div v-if="usersStore.error" class="notice notice--error" role="alert">
      {{ usersStore.error }}
    </div>
    <div v-if="usersStore.loading" class="loading-state" role="status">Завантаження користувачів…</div>
    <div v-else-if="!usersStore.error && usersStore.users.length === 0" class="empty-state">
      <p>За цим запитом користувачів не знайдено.</p>
    </div>
    <div v-else-if="usersStore.users.length > 0" class="table-scroll">
      <table class="users-table">
        <thead>
          <tr>
            <th scope="col">Користувач</th>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Телефон</th>
            <th scope="col">Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersStore.users" :key="user.id">
            <td>
              <RouterLink
                class="user-name-link"
                :to="{ name: 'user-detail', params: { id: user.id } }"
              >
                {{ user.firstName }} {{ user.lastName }}
              </RouterLink>
              <span class="table-subtitle">Вік: {{ user.age }}</span>
            </td>
            <td>{{ user.username }}</td>
            <td><a :href="`mailto:${user.email}`">{{ user.email }}</a></td>
            <td>{{ user.phone }}</td>
            <td>
              <div class="row-actions">
                <RouterLink
                  class="text-action"
                  :to="{ name: 'user-edit', params: { id: user.id } }"
                >
                  Редагувати
                </RouterLink>
                <button class="text-action text-action--danger" @click="deleteUser(user.id, user.firstName)">
                  Видалити
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <p>Всього: {{ usersStore.total }} · Сторінка {{ page }} з {{ totalPages }}</p>
      <div class="pagination-actions">
        <button
          class="button button--quiet"
          type="button"
          :disabled="page <= 1 || usersStore.loading"
          @click="goToPage(page - 1)"
        >
          Назад
        </button>
        <button
          class="button button--quiet"
          type="button"
          :disabled="page >= totalPages || usersStore.loading"
          @click="goToPage(page + 1)"
        >
          Далі
        </button>
      </div>
    </div>
  </section>
</template>
