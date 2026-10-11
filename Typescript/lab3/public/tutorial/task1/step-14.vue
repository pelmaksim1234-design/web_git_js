<script setup>
import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

const msg = ref('з батьківського компонента')
</script>

<template>
  <ChildComp></ChildComp>
</template>
