<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '../stores/users'
import type { User } from '../types'

const props = defineProps<{ id: string }>()
const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const user = ref<User | null>(null)
const loading = ref(false)
const error = ref('')
const operationError = ref('')
const isEditing = computed(() => route.name === 'user-edit')

watch(
  () => `${props.id}:${String(route.name)}`,
  async () => {
    loading.value = true
    error.value = ''
    try {
      user.value = await usersStore.getUser(Number(props.id))
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : 'Не вдалося завантажити користувача.'
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

async function deleteUser(): Promise<void> {
  if (user.value === null || !window.confirm(`Видалити ${user.value.firstName} ${user.value.lastName}?`)) {
    return
  }

  operationError.value = ''
  try {
    await usersStore.deleteUser(user.value.id)
    await router.replace({ name: 'users' })
  } catch (reason) {
    operationError.value =
      reason instanceof Error ? reason.message : 'Не вдалося видалити користувача.'
  }
}
</script>

<template>
  <section class="content-card">
    <RouterView v-if="isEditing" />
    <template v-else>
      <RouterLink class="back-link" :to="{ name: 'users' }">← До списку</RouterLink>
      <div v-if="loading" class="loading-state" role="status">Завантаження профілю…</div>
      <div v-else-if="error" class="notice notice--error" role="alert">{{ error }}</div>
      <template v-else-if="user">
        <div class="page-title-row user-profile-heading">
          <div class="profile-panel">
            <img v-if="user.image" class="profile-avatar" :src="user.image" :alt="user.firstName" />
            <span v-else class="profile-avatar" aria-hidden="true">{{ user.firstName[0] }}</span>
            <div>
              <p class="eyebrow">Профіль користувача #{{ user.id }}</p>
              <h1>{{ user.firstName }} {{ user.lastName }}</h1>
              <p class="muted-copy">@{{ user.username }}</p>
            </div>
          </div>
          <div class="hero-actions">
            <RouterLink
              class="button button--primary"
              :to="{ name: 'user-edit', params: { id: user.id } }"
            >
              Редагувати
            </RouterLink>
            <button class="button button--danger" type="button" @click="deleteUser">Видалити</button>
          </div>
        </div>
        <div v-if="operationError" class="notice notice--error" role="alert">
          {{ operationError }}
        </div>
        <dl class="user-details">
          <div><dt>Email</dt><dd><a :href="`mailto:${user.email}`">{{ user.email }}</a></dd></div>
          <div><dt>Телефон</dt><dd>{{ user.phone }}</dd></div>
          <div><dt>Вік</dt><dd>{{ user.age }}</dd></div>
          <div><dt>Стать</dt><dd>{{ user.gender }}</dd></div>
          <div v-if="user.birthDate"><dt>Дата народження</dt><dd>{{ user.birthDate }}</dd></div>
          <div v-if="user.address">
            <dt>Адреса</dt>
            <dd>{{ user.address.address }}, {{ user.address.city }}, {{ user.address.state }}</dd>
          </div>
        </dl>
      </template>
    </template>
  </section>
</template>
