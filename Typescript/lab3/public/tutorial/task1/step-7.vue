<script setup>
import { ref } from 'vue'

// надай кожному завданню унікальний id
let id = 0

const newTodo = ref('')
const todos = ref([
  { id: id++, text: 'Вивчити HTML' },
  { id: id++, text: 'Вивчити JavaScript' },
  { id: id++, text: 'Вивчити Vue' }
])

function addTodo() {
  // ...
  newTodo.value = ''
}

function removeTodo(todo) {
  // ...
}
</script>

<template>
  <form @submit.prevent="addTodo">
    <input v-model="newTodo">
    <button>Додати завдання</button>
  </form>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
</template>
