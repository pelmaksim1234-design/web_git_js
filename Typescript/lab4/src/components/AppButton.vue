<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'quiet'
    type?: 'button' | 'submit'
    disabled?: boolean
    ariaLabel?: string
  }>(),
  {
    variant: 'secondary',
    type: 'button',
    disabled: false,
  },
)
</script>

<template>
  <button
    class="btn app-button"
    :class="`app-button--${variant}`"
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <slot />
  </button>
</template>
