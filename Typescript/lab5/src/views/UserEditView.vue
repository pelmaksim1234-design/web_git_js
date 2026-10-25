<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '../components/UserForm.vue'
import { useUsersStore } from '../stores/users'
import type { User, UserFormValues, UpdateUserDto } from '../types'

const props = defineProps<{ id: string }>()
const router = useRouter()
const usersStore = useUsersStore()
const user = ref<User | null>(null)
const loading = ref(true)
const error = ref('')

watch(
  () => props.id,
  async (id) => {
    loading.value = true
    error.value = ''
    try {
      user.value = await usersStore.getUser(Number(id))
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : 'Не вдалося завантажити користувача.'
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

async function saveUser(values: UserFormValues): Promise<void> {
  const { password, ...details } = values
  const updates: UpdateUserDto = password ? { ...details, password } : details
  try {
    const updated = await usersStore.updateUser(Number(props.id), updates)
    user.value = updated
    await router.replace({ name: 'user-detail', params: { id: updated.id } })
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : 'Не вдалося оновити користувача.'
  }
}
</script>

<template>
  <div class="nested-edit">
    <RouterLink class="back-link" :to="{ name: 'user-detail', params: { id } }">
      ← До профілю
    </RouterLink>
    <p class="eyebrow">Редагування</p>
    <h2>Оновити користувача</h2>
    <p class="muted-copy">
      Порожній пароль залишить поточне значення без змін.
    </p>
    <div v-if="loading" class="loading-state" role="status">Завантаження профілю…</div>
    <div v-else-if="error" class="notice notice--error" role="alert">{{ error }}</div>
    <UserForm
      v-else-if="user"
      :key="user.id"
      :initial-user="user"
      editing
      submit-label="Зберегти зміни"
      @submit="saveUser"
      @cancel="router.push({ name: 'user-detail', params: { id: user.id } })"
    />
  </div>
</template>
