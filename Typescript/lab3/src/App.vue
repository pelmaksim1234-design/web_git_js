<script setup lang="ts">
const tutorialUrl = 'https://ua.vuejs.org/tutorial/#step-1'
</script>

<template>
  <main class="lab-page">
    <h1>Практична частина</h1>

    <ol class="task-list">
      <li>
        <p>
          Пройдіть весь
          <a :href="tutorialUrl" target="_blank" rel="noopener noreferrer">tutorial</a>
          <span class="url">{{ tutorialUrl }}</span>
          (Стиль API: Компонізійний, SFC).
        </p>
        <p>
          Результат виконання кожного завдання фіксувати у вигляді скріншоту з відповідним
          номером (step-1.jpg | png).
        </p>
      </li>
    </ol>
  </main>
</template>

<style scoped>
.lab-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
  background: #fff;
  min-height: 100vh;
}

h1 {
  margin: 0 0 24px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
  font-weight: 700;
  color: #111;
}

.task-list {
  margin: 0;
  padding-left: 2rem;
  list-style: decimal;
}

.task-list li {
  margin-bottom: 18px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #111;
}

.task-list p {
  margin: 0 0 8px;
}

.url {
  color: #111;
  text-decoration: none;
}

a {
  color: #0b57d0;
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
