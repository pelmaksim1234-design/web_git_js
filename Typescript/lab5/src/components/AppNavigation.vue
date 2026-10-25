<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout(): void {
  auth.logout()
  void router.replace({ name: 'login' })
}
</script>

<template>
  <nav class="main-navigation" aria-label="Головна навігація">
    <RouterLink :to="{ name: 'home' }">Home</RouterLink>
    <RouterLink :to="{ name: 'about' }">About author</RouterLink>
    <RouterLink :to="{ name: 'users' }">Users</RouterLink>
    <RouterLink v-if="!auth.isAuthenticated" :to="{ name: 'login' }">Login</RouterLink>
    <button v-else class="navigation-logout" type="button" @click="logout">Logout</button>
  </nav>
</template>
