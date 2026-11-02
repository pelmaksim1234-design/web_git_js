<script setup lang="ts">
import { AppHeader } from '@/widgets/app-header'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="page-container">
      <slot />
    </main>
    <footer class="site-footer">Vue User Portal · Лабораторна робота №6</footer>
  </div>
</template>
