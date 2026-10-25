<script setup lang="ts">
import { computed } from 'vue'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { User, UserFormValues } from '../types'

const props = withDefaults(
  defineProps<{
    initialUser?: User
    editing?: boolean
    submitLabel?: string
  }>(),
  {
    editing: false,
    submitLabel: 'Зберегти користувача',
  },
)

const emit = defineEmits<{
  submit: [values: UserFormValues]
  cancel: []
}>()

const schema = computed(() =>
  toTypedSchema(
    yup.object({
      firstName: yup.string().trim().required("Введіть ім'я."),
      lastName: yup.string().trim().required('Введіть прізвище.'),
      email: yup.string().trim().email('Введіть коректний email.').required('Введіть email.'),
      username: yup.string().trim().required('Введіть ім’я користувача.'),
      password: props.editing
        ? yup
            .string()
            .test(
              'password-minimum',
              'Пароль має містити щонайменше 6 символів.',
              (value) => !value || value.length >= 6,
            )
        : yup.string().min(6, 'Пароль має містити щонайменше 6 символів.').required('Введіть пароль.'),
      age: yup
        .number()
        .typeError('Вкажіть вік.')
        .integer('Вік має бути цілим числом.')
        .min(1, 'Вік має бути більшим за 0.')
        .required('Вкажіть вік.'),
      gender: yup.string().required('Оберіть стать.'),
      phone: yup.string().trim().required('Введіть номер телефону.'),
    }),
  ),
)

const { defineField, errors, handleSubmit, isSubmitting, resetForm } = useForm<UserFormValues>({
  validationSchema: schema,
  initialValues: {
    firstName: props.initialUser?.firstName ?? '',
    lastName: props.initialUser?.lastName ?? '',
    email: props.initialUser?.email ?? '',
    username: props.initialUser?.username ?? '',
    password: '',
    age: props.initialUser?.age ?? 18,
    gender: props.initialUser?.gender ?? '',
    phone: props.initialUser?.phone ?? '',
  },
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [age, ageAttrs] = defineField('age')
const [gender, genderAttrs] = defineField('gender')
const [phone, phoneAttrs] = defineField('phone')

const submit = handleSubmit((values) => {
  emit('submit', values)
  if (!props.editing) {
    resetForm()
  }
})
</script>

<template>
  <form class="user-form" novalidate @submit.prevent="submit">
    <label class="form-field">
      <span>Ім’я</span>
      <input v-model="firstName" v-bind="firstNameAttrs" autocomplete="given-name" required />
      <small v-if="errors.firstName" class="field-error">{{ errors.firstName }}</small>
    </label>
    <label class="form-field">
      <span>Прізвище</span>
      <input v-model="lastName" v-bind="lastNameAttrs" autocomplete="family-name" required />
      <small v-if="errors.lastName" class="field-error">{{ errors.lastName }}</small>
    </label>
    <label class="form-field">
      <span>Email</span>
      <input v-model="email" v-bind="emailAttrs" type="email" autocomplete="email" required />
      <small v-if="errors.email" class="field-error">{{ errors.email }}</small>
    </label>
    <label class="form-field">
      <span>Ім’я користувача</span>
      <input v-model="username" v-bind="usernameAttrs" autocomplete="username" required />
      <small v-if="errors.username" class="field-error">{{ errors.username }}</small>
    </label>
    <label class="form-field">
      <span>Пароль{{ editing ? ' (залиште порожнім без змін)' : '' }}</span>
      <input
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        autocomplete="new-password"
        :required="!editing"
      />
      <small v-if="errors.password" class="field-error">{{ errors.password }}</small>
    </label>
    <label class="form-field">
      <span>Вік</span>
      <input v-model="age" v-bind="ageAttrs" type="number" min="1" required />
      <small v-if="errors.age" class="field-error">{{ errors.age }}</small>
    </label>
    <label class="form-field">
      <span>Стать</span>
      <select v-model="gender" v-bind="genderAttrs" required>
        <option disabled value="">Оберіть стать</option>
        <option value="male">Чоловіча</option>
        <option value="female">Жіноча</option>
        <option value="other">Інше</option>
      </select>
      <small v-if="errors.gender" class="field-error">{{ errors.gender }}</small>
    </label>
    <label class="form-field">
      <span>Телефон</span>
      <input v-model="phone" v-bind="phoneAttrs" type="tel" autocomplete="tel" required />
      <small v-if="errors.phone" class="field-error">{{ errors.phone }}</small>
    </label>
    <div class="form-actions">
      <button v-if="editing" class="button button--quiet" type="button" @click="emit('cancel')">
        Скасувати
      </button>
      <button class="button button--primary" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Збереження…' : submitLabel }}
      </button>
    </div>
  </form>
</template>
