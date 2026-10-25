<script setup lang="ts">
import AppNavigation from './AppNavigation.vue'
import Logo from './Logo.vue'
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="brand-link" :to="{ name: 'home' }" aria-label="User Portal — головна">
        <Logo />
      </RouterLink>
      <AppNavigation />
    </div>
  </header>
</template>
