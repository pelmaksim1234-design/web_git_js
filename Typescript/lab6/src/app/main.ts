import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from '@/app/App.vue'
import { registerServices } from '@/app/providers/services'
import router from '@/app/router'
import '@/shared/styles/main.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
const pinia = createPinia()

registerServices(pinia)
pinia.use(createPersistedState())
app.use(pinia)
app.use(PrimeVue, {
  theme: { preset: Aura, options: { darkModeSelector: '[data-theme="dark"]' } },
})
app.use(router)
app.mount('#app')
