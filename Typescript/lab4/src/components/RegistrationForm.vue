<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { Participant, ParticipantFormData } from '../types'
import AppButton from './AppButton.vue'
import FormField from './FormField.vue'

type FieldName = keyof ParticipantFormData
type FormErrors = Partial<Record<FieldName, string>>

const props = withDefaults(
  defineProps<{
    initial?: Participant
    isEmailTaken: (email: string) => boolean
    submitLabel?: string
  }>(),
  {
    submitLabel: 'Зберегти учасника',
  },
)

const emit = defineEmits<{
  submit: [value: ParticipantFormData]
  cancel: []
}>()

const today = new Date()
const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
const form = reactive<ParticipantFormData>({
  name: props.initial?.name ?? '',
  dateOfBirth: props.initial?.dateOfBirth ?? '',
  email: props.initial?.email ?? '',
  phone: props.initial?.phone ?? '',
})
const errors = ref<FormErrors>({})
const submitted = ref(false)
const isEditing = computed(() => props.initial !== undefined)

function validate(): boolean {
  const nextErrors: FormErrors = {}
  const name = form.name.trim()
  const email = form.email.trim()
  const phone = form.phone.trim()

  if (!name) {
    nextErrors.name = "Введіть ім'я учасника."
  }

  if (!form.dateOfBirth) {
    nextErrors.dateOfBirth = 'Вкажіть дату народження.'
  } else if (form.dateOfBirth > maxDate) {
    nextErrors.dateOfBirth = 'Дата народження не може бути в майбутньому.'
  }

  if (!email) {
    nextErrors.email = 'Введіть електронну пошту.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    nextErrors.email = 'Введіть коректну електронну пошту.'
  } else if (props.isEmailTaken(email)) {
    nextErrors.email = 'Учасник з такою електронною поштою вже існує.'
  }

  if (!phone) {
    nextErrors.phone = 'Введіть номер телефону.'
  } else if (!/^\+380\d{9}$/.test(phone)) {
    nextErrors.phone = 'Формат телефону: +380XXXXXXXXX (9 цифр після коду країни).'
  }

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

watch(
  form,
  () => {
    if (submitted.value) {
      validate()
    }
  },
  { deep: true },
)

function handleSubmit(): void {
  submitted.value = true
  if (!validate()) {
    return
  }

  emit('submit', {
    name: form.name.trim(),
    dateOfBirth: form.dateOfBirth,
    email: form.email.trim(),
    phone: form.phone.trim(),
  })

  if (!isEditing.value) {
    form.name = ''
    form.dateOfBirth = ''
    form.email = ''
    form.phone = ''
    errors.value = {}
    submitted.value = false
  }
}
</script>

<template>
  <form class="registration-form" novalidate @submit.prevent="handleSubmit">
    <FormField
      id="participant-name"
      v-model="form.name"
      label="Ім'я"
      placeholder="Наприклад, Олександр"
      autocomplete="name"
      :error="errors.name"
    />
    <FormField
      id="participant-date-of-birth"
      v-model="form.dateOfBirth"
      label="Дата народження"
      type="date"
      :max="maxDate"
      :error="errors.dateOfBirth"
    />
    <FormField
      id="participant-email"
      v-model="form.email"
      label="Електронна пошта"
      type="email"
      placeholder="name@example.com"
      autocomplete="email"
      :error="errors.email"
    />
    <FormField
      id="participant-phone"
      v-model="form.phone"
      label="Номер телефону"
      type="tel"
      placeholder="+380XXXXXXXXX"
      autocomplete="tel"
      :error="errors.phone"
    />
    <div class="registration-form__actions">
      <AppButton v-if="isEditing" type="button" @click="emit('cancel')">Скасувати</AppButton>
      <AppButton type="submit" variant="primary">{{ submitLabel }}</AppButton>
    </div>
  </form>
</template>
