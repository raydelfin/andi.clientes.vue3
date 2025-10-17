import { IonicVue } from '@ionic/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.scss'
import funcionesGlobales from './composables/useFuncionesGlobales'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

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

const app = createApp(App)

app.use(IonicVue)
app.use(createPinia())
app.use(router)
app.use(i18n)

// Configuración global SIN async
app.config.globalProperties.$t = i18n.global.t
app.config.globalProperties.$globalFunc = funcionesGlobales
app.config.globalProperties.$api = 'https://api.andi.services/api'
/*
console.log('🔍 Verificando i18n en main.ts:')
console.log('Locale:', i18n.global.locale.value)
console.log('Mensajes ES:', i18n.global.getLocaleMessage('es'))
console.log('Mensajes EN:', i18n.global.getLocaleMessage('en'))
*/
router.isReady().then(() => {
  app.mount('#app')
  console.log('✅ App montada con i18n funcionando')
})