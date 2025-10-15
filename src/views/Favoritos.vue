<template>
  <ion-page>
    <AppHeader :title="t('menuClientes.favoritos')" />
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
  </ion-page>

</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, 
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonSpinner, 
    IonModal, IonToggle, IonFab, IonFabButton, IonIcon, IonButtons, IonCheckbox, 
    IonMenu, IonMenuButton, IonSplitPane
  } from '@ionic/vue'
  import { getCurrentInstance } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { useRouter } from 'vue-router'

  const { t, locale } = useI18n()

  // VARIABLES ------------------------------
  // ***********************
  const app = getCurrentInstance();
  const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  const $api = app?.appContext.config.globalProperties.$api as string
  const router = useRouter()
  // // ***********************
  
  // -----------------------------------------
  // FUNCIONES LOCALES
  // Lógica de mounted()
  onMounted(() => {
    localStorage.setItem('interfaz', 'Buscar')
    console.log('Buscar.vue ---')
  })
</script>
