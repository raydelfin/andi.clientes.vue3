import { IonicVue } from '@ionic/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import './style.scss'
import funcionesGlobales from './composables/useFuncionesGlobales'
import AppHeader from './components/AppHeader.vue'
import App from './App.vue'
import router from './router'

import '@ionic/vue/css/core.css'
/* Opcional: CSS utilitario, de tipografía, y específicos de componentes */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
/* Estilos Temáticos */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

import messagesEs from './idiomas/esp.json'
import messagesEn from './idiomas/ing.json'

const messages = {
  es: messagesEs,
  en: messagesEn
}

const i18n = createI18n({
  locale: 'es', // Establece el idioma predeterminado
  fallbackLocale: 'en',
  messages,
  legacy: false, // ¡IMPORTANTE! Desactiva el modo legacy (Vue 2 / Options API)
  globalInjection: true, // Opcional: para que $t, $i18n funcionen en Options API.
})

const app = createApp(App)

app.use(IonicVue)
app.use(createPinia())
app.use(router)
app.use(i18n)

app.component('AppHeader', AppHeader)

// 🚨 INYECCIÓN GLOBAL: Aquí se hace la inyección.
app.config.globalProperties.$globalFunc = funcionesGlobales
//app.config.globalProperties.$api = 'https://localhost:44314/api' // develop
app.config.globalProperties.$api = 'https://api.andi.services/api' // Producción

router.isReady().then(() => {
  app.mount('#app');
})
