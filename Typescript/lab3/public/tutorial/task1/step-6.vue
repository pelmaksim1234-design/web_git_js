<script setup>
import { ref } from 'vue'

const awesome = ref(true)

function toggle() {
  // ...
}
</script>

<template>
  <button @click="toggle">Перемкнути</button>
  <h1>Vue - це круто!</h1>
  <h1>Ой, ні 😢</h1>
</template>
