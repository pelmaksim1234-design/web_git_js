<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useUsersStore, type User } from '@/entities/user'
import { AppButton, AppConfirmDialog, AppTable } from '@/shared/ui'

const usersStore = useUsersStore()
const { users, loading, error } = storeToRefs(usersStore)
const pendingUser = ref<User | null>(null)
const columns = [
  { field: 'name', header: 'Користувач' },
  { field: 'username', header: 'Username' },
  { field: 'email', header: 'Email' },
  { field: 'phone', header: 'Телефон' },
  { field: 'actions', header: 'Дії' },
]
const rows = computed(() =>
  users.value.map((user) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    username: user.username,
    email: user.email,
    phone: user.phone,
    actions: user.id,
  })),
)

async function confirmDelete(): Promise<void> {
  const user = pendingUser.value
  if (user === null) {
    return
  }

  usersStore.error = null
  try {
    await usersStore.removeUser(user.id)
    pendingUser.value = null
  } catch (reason) {
    usersStore.error = reason instanceof Error ? reason.message : 'Не вдалося видалити користувача.'
    pendingUser.value = null
  }
}
</script>

<template>
  <div v-if="error" class="notice notice--error" role="alert">{{ error }}</div>
  <div v-if="loading" class="loading-state" role="status">Завантаження користувачів…</div>
  <div v-else-if="!error && users.length === 0" class="empty-state">
    <p>За цим запитом користувачів не знайдено.</p>
  </div>
  <div v-else-if="users.length > 0" class="table-scroll">
    <AppTable :value="rows" :columns="columns" data-key="id">
      <template #body-name="{ data }">
        <RouterLink class="user-name-link" :to="{ name: 'user-detail', params: { id: data.id } }">
          {{ data.name }}
        </RouterLink>
        <span class="table-subtitle">Вік: {{ users.find((user) => user.id === data.id)?.age }}</span>
      </template>
      <template #body-email="{ data }">
        <a :href="`mailto:${data.email}`">{{ data.email }}</a>
      </template>
      <template #body-actions="{ data }">
        <div class="row-actions">
          <RouterLink class="text-action" :to="{ name: 'user-edit', params: { id: data.id } }">
            Редагувати
          </RouterLink>
          <AppButton
            class="text-action text-action--danger"
            text
            severity="danger"
            @click="pendingUser = users.find((user) => user.id === data.id) ?? null"
          >
            Видалити
          </AppButton>
        </div>
      </template>
    </AppTable>
  </div>
  <AppConfirmDialog
    :visible="pendingUser !== null"
    title="Видалення користувача"
    :message="pendingUser ? `Видалити користувача ${pendingUser.firstName} ${pendingUser.lastName}?` : ''"
    @update:visible="(visible) => !visible && (pendingUser = null)"
    @confirm="confirmDelete"
  />
</template>
