<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'

const emit = defineEmits<{
  'filter-by-name': [value: string]
}>()

const query = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(query, (value) => {
  if (debounceTimer !== undefined) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    emit('filter-by-name', value.trim())
  }, 300)
})

onUnmounted(() => {
  if (debounceTimer !== undefined) {
    clearTimeout(debounceTimer)
  }
})

function clearSearch(): void {
  if (debounceTimer !== undefined) {
    clearTimeout(debounceTimer)
  }

  query.value = ''
  emit('filter-by-name', '')
}
</script>

<template>
  <div class="search-bar">
    <input
      v-model="query"
      type="search"
      aria-label="Пошук учасника за ім'ям"
      placeholder="Знайти учасника за ім'ям..."
    />
    <button
      v-if="query"
      class="search-bar__clear"
      type="button"
      aria-label="Очистити пошук"
      @click="clearSearch"
    >
      ×
    </button>
  </div>
</template>
