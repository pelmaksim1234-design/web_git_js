<script setup>
import { ref } from 'vue'

const todoId = ref(1)
const todoData = ref(null)

async function fetchData() {
  todoData.value = null
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  todoData.value = await res.json()
}

fetchData()
</script>

<template>
  <p>Завдання: {{ todoId }}</p>
  <button @click="todoId++" :disabled="!todoData">Отримати наступне завдання</button>
  <p v-if="!todoData">Завантажується...</p>
  <pre v-else>{{ todoData }}</pre>
</template>
