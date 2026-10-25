<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '../components/UserForm.vue'
import { useUsersStore } from '../stores/users'
import type { UserFormValues } from '../types'

const router = useRouter()
const usersStore = useUsersStore()
const error = ref('')

async function createUser(values: UserFormValues): Promise<void> {
  error.value = ''
  try {
    const user = await usersStore.createUser(values)
    await router.push({ name: 'user-detail', params: { id: user.id } })
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : 'Не вдалося створити користувача.'
  }
}
</script>

<template>
  <section class="content-card form-page">
    <RouterLink class="back-link" :to="{ name: 'users' }">← До списку</RouterLink>
    <p class="eyebrow">Новий запис</p>
    <h1>Додати користувача</h1>
    <p class="muted-copy">
      DummyJSON імітує створення, тому новий користувач буде збережений у стані застосунку.
    </p>
    <div v-if="error" class="notice notice--error" role="alert">{{ error }}</div>
    <UserForm submit-label="Створити користувача" @submit="createUser" />
  </section>
</template>
