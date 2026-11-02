<script setup lang="ts">
import { useSessionStore } from '@/entities/session'
import { ThemeToggle } from '@/features/theme-toggle'
import { AppButton } from '@/shared/ui'
import { useRouter } from 'vue-router'

const auth = useSessionStore()
const router = useRouter()

function logout(): void {
  auth.clearSession()
  void router.replace({ name: 'login' })
}
</script>

<template>
  <nav class="main-navigation" aria-label="Головна навігація">
    <RouterLink :to="{ name: 'home' }">Home</RouterLink>
    <RouterLink :to="{ name: 'about' }">About author</RouterLink>
    <RouterLink :to="{ name: 'users' }">Users</RouterLink>
    <RouterLink v-if="!auth.isAuthenticated" :to="{ name: 'login' }">Login</RouterLink>
    <AppButton v-else class="navigation-logout" severity="secondary" text @click="logout">
      Logout
    </AppButton>
    <ThemeToggle />
  </nav>
</template>
