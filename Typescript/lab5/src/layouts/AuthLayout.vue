<script setup lang="ts">
import Logo from '../components/Logo.vue'
</script>

<template>
  <div class="auth-layout">
    <RouterLink class="auth-brand" :to="{ name: 'home' }" aria-label="На головну">
      <Logo />
    </RouterLink>
    <slot />
    <p class="auth-caption">Безпечний доступ до панелі користувачів</p>
  </div>
</template>
