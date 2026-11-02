<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/entities/settings'
import { AppButton } from '@/shared/ui'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
</script>

<template>
  <AppButton
    class="theme-toggle"
    severity="secondary"
    outlined
    :aria-label="theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему'"
    @click="themeStore.toggleTheme"
  >
    <i :class="['pi', theme === 'light' ? 'pi-moon' : 'pi-sun']" aria-hidden="true" />
    <span>{{ theme === 'light' ? 'Темна тема' : 'Світла тема' }}</span>
  </AppButton>
</template>
