<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-menu-button></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ t('global.andiClientes') }}</ion-title>

      <ion-buttons>
        <ion-button @click="toggleTheme">
          <ion-icon :icon="themeIcon" :title="themeTitle"></ion-icon>
        </ion-button>

        <ion-button id="open-lang-popover">
          <ion-icon :icon="languageOutline" title="Cambiar Idioma"></ion-icon>
        </ion-button>
        
        <ion-popover trigger="open-lang-popover" trigger-action="click" :show-arrow="false">
          <ion-content class="ion-padding">
            <ion-list>
              <ion-item button lines="none" @click="changeLanguage('es')">Español</ion-item>
              <ion-item button lines="none" @click="changeLanguage('en')">English</ion-item>
            </ion-list>
          </ion-content>
        </ion-popover>

        <ion-button @click="logout">
          <ion-icon :icon="logOutOutline" title="Cerrar Sesión"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>
  import { 
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, 
    IonMenuButton, IonPopover, IonContent, IonList, IonItem 
  } from '@ionic/vue'
  import { defineProps, ref, computed } from 'vue'
  import { 
    moonOutline, sunnyOutline, languageOutline, logOutOutline 
  } from 'ionicons/icons'
 import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()

// ----------------------------------------------------
// PROPS (Propiedades que recibirá el componente)
// ----------------------------------------------------
const props = defineProps({
  title: {
    type: String,
    default: 'ANDI CLIENTES'
  }
})

// ----------------------------------------------------
// LÓGICA DE TEMAS (Dark/Light)
// ----------------------------------------------------
const isDark = ref(document.body.classList.contains('dark'))
const themeIcon = computed(() => isDark.value ? sunnyOutline : moonOutline)
const themeTitle = computed(() => isDark.value ? 'Modo Claro' : 'Modo Oscuro')
const toggleTheme = () => {
  document.body.classList.toggle('dark')
  isDark.value = document.body.classList.contains('dark')
  // Aquí podrías guardar la preferencia en localStorage
}
// ----------------------------------------------------
// FUNCIONES DE ACCIÓN
// ----------------------------------------------------
const changeLanguage = (lang) => {
  locale.value = lang
  // console.log(`Cambiando idioma a: ${lang}`)
}
const logout = () => {
  // Lógica para cerrar sesión (limpiar tokens, redirigir, etc.)
  console.log('Cerrando sesión...')
  // router.push('/login');
}
</script>