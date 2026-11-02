<script setup lang="ts">
import InputText from 'primevue/inputtext'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    modelValue?: string | number | null
    type?: string
    invalid?: boolean
  }>(),
  { type: 'text', invalid: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()
</script>

<template>
  <InputText
    v-bind="$attrs"
    :model-value="String(modelValue ?? '')"
    :type="type"
    :invalid="invalid"
    :aria-invalid="invalid"
    class="app-input"
    @update:model-value="
      emit(
        'update:modelValue',
        type === 'number' && String($event ?? '') !== '' ? Number($event) : String($event ?? ''),
      )
    "
  />
</template>
