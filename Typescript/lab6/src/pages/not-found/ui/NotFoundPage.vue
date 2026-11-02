<template>
  <section class="content-card empty-state">
    <p class="eyebrow">Помилка 404</p>
    <h1>Сторінку не знайдено</h1>
    <p class="muted-copy">Перевірте адресу або поверніться на головну сторінку.</p>
    <RouterLink class="button button--primary" :to="{ name: 'home' }">На головну</RouterLink>
  </section>
</template>
