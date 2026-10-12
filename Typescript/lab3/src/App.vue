<script setup lang="ts">
import Users from './components/Users.vue'
</script>

<template>
  <main class="lab-page">
    <header class="page-header">
      <p class="eyebrow">Лабораторна робота №3</p>
      <h1>Користувачі</h1>
      <p class="intro">
        Переглядайте картки користувачів, фільтруйте їх за статтю та віком і змінюйте порядок
        сортування.
      </p>
    </header>

    <Users />
  </main>
</template>

<style scoped>
.lab-page {
  min-height: 100vh;
  padding: 24px 0 48px;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 0;
}

.eyebrow {
  margin: 0 0 8px;
  color: #5d7da0;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #21364f;
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.1;
}

.intro {
  max-width: 680px;
  margin: 12px 0 0;
  color: #496581;
  font-size: 1.05rem;
  line-height: 1.6;
}
</style>
