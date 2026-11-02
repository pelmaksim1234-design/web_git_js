import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const theme = ref<Theme>('light')

    watch(
      theme,
      (value) => {
        document.documentElement.dataset.theme = value
      },
      { immediate: true },
    )

    function toggleTheme(): void {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    return { theme, toggleTheme }
  },
  { persist: true },
)
