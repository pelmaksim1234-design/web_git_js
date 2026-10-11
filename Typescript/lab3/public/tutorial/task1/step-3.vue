<script setup>
import { ref } from 'vue'

const titleClass = ref('title')
</script>

<template>
  <h1>Зробіть мене червоним</h1> <!-- додайте динамічний клас, прив'язавши його тут -->
</template>

<style>
.title {
  color: red;
}
</style>
