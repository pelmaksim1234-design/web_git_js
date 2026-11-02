<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import { AppButton, AppInput } from '@/shared/ui'
import { UsersTable } from '@/widgets/users-table'

const PAGE_SIZE = 10
const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const { total, loading } = storeToRefs(usersStore)
const searchText = ref(typeof route.query.q === 'string' ? route.query.q : '')
const page = computed(() => {
  const value = Number(route.query.page ?? 1)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

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
      <AppInput
        id="user-search"
        v-model="searchText"
        type="search"
        placeholder="Ім’я, username або email"
      />
      <AppButton type="submit">Знайти</AppButton>
    </form>

    <UsersTable />

    <div class="pagination">
      <p>Всього: {{ total }} · Сторінка {{ page }} з {{ totalPages }}</p>
      <div class="pagination-actions">
        <AppButton severity="secondary" outlined :disabled="page <= 1 || loading" @click="goToPage(page - 1)">
          Назад
        </AppButton>
        <AppButton severity="secondary" outlined :disabled="page >= totalPages || loading" @click="goToPage(page + 1)">
          Далі
        </AppButton>
      </div>
    </div>
  </section>
</template>
