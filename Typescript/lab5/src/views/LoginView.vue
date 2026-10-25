<script setup lang="ts">
import { ref } from 'vue'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
import * as yup from 'yup'
import { useAuthStore } from '../stores/auth'

interface Credentials {
  username: string
  password: string
}

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const loginError = ref('')
const schema = toTypedSchema(
  yup.object({
    username: yup.string().trim().required("Введіть ім’я користувача."),
    password: yup.string().required('Введіть пароль.'),
  }),
)

const { defineField, errors, handleSubmit, isSubmitting } = useForm<Credentials>({
  validationSchema: schema,
  initialValues: { username: '', password: '' },
})
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

const submit = handleSubmit(async (credentials) => {
  loginError.value = ''
  try {
    await auth.login(credentials.username, credentials.password)
    const redirect = route.query.redirect
    const target = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
      ? redirect
      : '/users'
    await router.replace(target)
  } catch (error) {
    loginError.value =
      error instanceof Error ? error.message : 'Не вдалося увійти. Перевірте облікові дані.'
  }
})
</script>

<template>
  <section class="login-card">
    <p class="eyebrow">Вітаємо знову</p>
    <h1>Вхід до системи</h1>
    <p class="muted-copy">Увійдіть, щоб переглядати та редагувати список користувачів.</p>
    <div v-if="loginError" class="notice notice--error" role="alert">{{ loginError }}</div>
    <form class="login-form" novalidate @submit.prevent="submit">
      <label class="form-field">
        <span>Ім’я користувача</span>
        <input
          v-model="username"
          v-bind="usernameAttrs"
          autocomplete="username"
          required
          autofocus
        />
        <small v-if="errors.username" class="field-error">{{ errors.username }}</small>
      </label>
      <label class="form-field">
        <span>Пароль</span>
        <input
          v-model="password"
          v-bind="passwordAttrs"
          type="password"
          autocomplete="current-password"
          required
        />
        <small v-if="errors.password" class="field-error">{{ errors.password }}</small>
      </label>
      <button class="button button--primary button--full" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Вхід…' : 'Увійти' }}
      </button>
    </form>
    <p class="demo-credentials">Демо: <code>emilys</code> / <code>emilyspass</code></p>
  </section>
</template>
