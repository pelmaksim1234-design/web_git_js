<script setup lang="ts">
defineProps<{
  id: string
  label: string
  modelValue: string
  type?: 'text' | 'email' | 'date' | 'tel'
  placeholder?: string
  error?: string
  max?: string
  autocomplete?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="registration-form__field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      class="form-control"
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :max="max"
      :autocomplete="autocomplete"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" :id="`${id}-error`" class="field-error" role="alert">{{ error }}</span>
  </div>
</template>
