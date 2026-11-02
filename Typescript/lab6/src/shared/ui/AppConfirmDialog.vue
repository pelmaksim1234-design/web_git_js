<script setup lang="ts">
import Dialog from 'primevue/dialog'
import AppButton from './AppButton.vue'

defineProps<{
  visible: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <Dialog
    :visible="visible"
    :header="title"
    modal
    :style="{ width: 'min(28rem, calc(100vw - 2rem))' }"
    @update:visible="emit('update:visible', $event)"
  >
    <p>{{ message }}</p>
    <template #footer>
      <AppButton label="Скасувати" severity="secondary" outlined @click="emit('update:visible', false)" />
      <AppButton label="Видалити" severity="danger" @click="emit('confirm')" />
    </template>
  </Dialog>
</template>
