<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-menu-button></ion-menu-button>
        <ion-title>{{ t('menuClientes.buscar') }}</ion-title>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content :fullscreen="true" class="ion-padding">
    <div class="centrar-login">
      <br>
      <!-- Botón Ingresar -->
      <ion-button size="small" style="width: 100%;">
        {{ t('menuClientes.cerrarSesion') }}
      </ion-button>
      <ion-grid>
        <ion-row>
          <ion-col>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
  import { /*ref,*/ onMounted } from 'vue'
  import { 
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, 
    IonButtons, IonMenuButton
  } from '@ionic/vue'
  // import { getCurrentInstance } from 'vue'
  import { useI18n } from 'vue-i18n'
  // import axios from 'axios'
  // import { useRouter } from 'vue-router'

  const { t } = useI18n()

  // VARIABLES ------------------------------
  // ***********************
  // const app = getCurrentInstance();
  // const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  // const $api = app?.appContext.config.globalProperties.$api as string
  // const router = useRouter()
  // // ***********************

  // -----------------------------------------
  // FUNCIONES LOCALES
  // Lógica de mounted()
  onMounted(() => {
    localStorage.setItem('interfaz', 'Buscar')
    console.log('Buscar.vue ---')
  })

</script>
