<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>{{ t('menuClientes.direcciones') }}</ion-title>
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <ion-buttons>
            <div @click="verMiPerfil">
              <ion-avatar class="avatar-right">
                <ion-img :src="avatarSrc" size="60px" />
              </ion-avatar>
            </div>
          </ion-buttons>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="centrar-login">
        <!-- BOTONES CATALOGO -->
        <ion-button color="primary" @click="nuevaDireccion()">
          <i class="fas fa-plus-circle big-icon"/>
          &nbsp;
          {{ $t('direcciones.agregarDireccion') }}
        </ion-button>
        <!-- BOTÓN INFO -->
        <ion-button color="warning" id="info" style="widht: 100%;">
          {{ t('direcciones.info') }}
          <i class="fas fa-info-circle big-icon"></i>
        </ion-button>
        <ion-alert trigger="info" :header="t('direcciones.info')"
          :message="t('direcciones.infoDirecciones')"
          :buttons="alertButtons">></ion-alert>
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
    IonButton, IonMenuButton, IonButtons, IonImg, IonAvatar, IonAlert
  } from '@ionic/vue'
  // import { getCurrentInstance } from 'vue'
  import { useI18n } from 'vue-i18n'
  // import axios from 'axios'
  import { useRouter } from 'vue-router'

  const { t /*, locale*/ } = useI18n()

  // VARIABLES ------------------------------
  // ***********************
  /*
  const app = getCurrentInstance();
  const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  const $api = app?.appContext.config.globalProperties.$api as string
  */
  const router = useRouter()
  // ***************************************************************************
  // ***************************************************************************
  const avatarSrc = ref('/img/avatar.png')
  const status = ref('otraCuenta')
 const alertButtons = ref([
  {
    text: t('global.aceptar'), // O el texto que necesites
    role: 'cancel',
    handler: () => {
      console.log('Alerta cerrada')
    },
  },
])
  // -----------------------------------------
  // FUNCIONES LOCALES
  // Lógica de mounted()
  onMounted(() => {
    localStorage.setItem('interfaz', 'Buscar')
    console.log('Buscar.vue ---')
    avatarSrc.value = localStorage.getItem('urlImg')
  })
  const verMiPerfil = () => {
    router.push('/client/MiPerfil')
  }
</script>
