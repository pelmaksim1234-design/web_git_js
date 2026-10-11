<script setup>
import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

const greeting = ref('Привіт від батьківського компонента!')
</script>

<template>
  <ChildComp />
</template>
