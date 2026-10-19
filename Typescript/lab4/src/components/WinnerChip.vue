<script setup lang="ts">
import AppButton from './AppButton.vue'

defineProps<{
  name: string
}>()

defineEmits<{
  remove: []
}>()
</script>

<template>
  <span class="winner-chip">
    {{ name }}
    <AppButton
      class="winner-chip__remove"
      variant="quiet"
      :aria-label="`Видалити переможця ${name}`"
      @click="$emit('remove')"
    >
      ×
    </AppButton>
  </span>
</template>
