<template>
  <section class="hero-card">
    <p class="eyebrow">Vue 3 · TypeScript · DummyJSON</p>
    <h1>Користувачі — під контролем</h1>
    <p class="hero-copy">
      Vue User Portal — односторінковий застосунок для перегляду та керування користувачами.
      Список завантажується з DummyJSON і підтримує пошук, пагінацію та редагування.
    </p>
    <div class="hero-actions">
      <RouterLink class="button button--primary" :to="{ name: 'users' }">Перейти до користувачів</RouterLink>
      <a
        class="button button--quiet"
        href="https://github.com/pelmaksim1234-design/web_git_js"
        target="_blank"
        rel="noreferrer"
      >
        GitHub проєкту
      </a>
    </div>
    <div class="technology-grid" aria-label="Технології проєкту">
      <article><strong>Vue Router</strong><span>маршрути та навігаційні guards</span></article>
      <article><strong>Repository</strong><span>окремий шар доступу до API</span></article>
      <article><strong>Pinia</strong><span>стан автентифікації та користувачів</span></article>
    </div>
  </section>
</template>
