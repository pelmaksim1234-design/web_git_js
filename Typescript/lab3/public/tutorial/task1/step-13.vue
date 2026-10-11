<script setup>
import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

const childMsg = ref('Поки що немає повідомлення від дочірнього компонента')
</script>

<template>
  <ChildComp />
  <p>{{ childMsg }}</p>
</template>
