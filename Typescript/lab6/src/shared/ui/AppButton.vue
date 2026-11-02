<script setup lang="ts">
import Button from 'primevue/button'

withDefaults(
  defineProps<{
    label?: string
    type?: 'button' | 'submit' | 'reset'
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'
    loading?: boolean
    disabled?: boolean
    outlined?: boolean
    text?: boolean
  }>(),
  { type: 'button', severity: 'primary', loading: false, disabled: false, outlined: false, text: false },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <Button
    :label="label"
    :type="type"
    :severity="severity"
    :loading="loading"
    :disabled="disabled"
    :outlined="outlined"
    :text="text"
    class="app-button"
    @click="emit('click', $event)"
  >
    <slot>{{ label }}</slot>
  </Button>
</template>
