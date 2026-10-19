<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close(): void {
  emit('update:modelValue', false)
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
  { immediate: true },
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="modal-backdrop"
      role="presentation"
      @click.self="close"
    >
      <section
        class="modal-card"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @keydown.esc.stop="close"
      >
        <header class="modal-card__header">
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
          <button class="modal-close" type="button" aria-label="Закрити" @click="close">×</button>
        </header>
        <div class="modal-card__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="modal-card__footer">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Transition>
</template>
