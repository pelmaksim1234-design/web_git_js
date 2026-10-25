<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="page-container">
      <slot />
    </main>
    <footer class="site-footer">Vue User Portal · Лабораторна робота №5</footer>
  </div>
</template>
