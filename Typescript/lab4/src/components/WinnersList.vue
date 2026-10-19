<script setup lang="ts">
import type { Participant } from '../types'
import WinnerChip from './WinnerChip.vue'

defineProps<{
  winners: Participant[]
}>()

defineEmits<{
  remove: [id: string]
}>()
</script>

<template>
  <div class="winner-list" aria-live="polite" aria-label="Список переможців">
    <p v-if="winners.length === 0" class="winner-empty">Переможців поки не обрано</p>
    <WinnerChip
      v-for="winner in winners"
      :key="winner.id"
      :name="winner.name"
      @remove="$emit('remove', winner.id)"
    />
  </div>
</template>
