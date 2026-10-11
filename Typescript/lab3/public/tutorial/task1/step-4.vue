<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <!-- зроби цю кнопку робочою -->
  <button>Рахунок: {{ count }}</button>
</template>
