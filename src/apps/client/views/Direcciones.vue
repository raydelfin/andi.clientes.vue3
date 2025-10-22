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
        <template v-if="estatus === 'INICIO'">
          <ion-button color="primary" @click="nuevo()">{{ $t('global.nuevo') }}</ion-button>
        </template>
        <template v-if="estatus === 'CREAR' || estatus === 'EDITAR'">
          <ion-button color="success" @click="validarForm()">
            <i class="fas fa-save big-icon"></i>
            {{ $t('global.guardar') }}</ion-button>
          <ion-button variant="secondary" @click="descartar()">
            <i class="fas fa-ban big-icon"></i>
            {{ $t('global.descartar') }}</ion-button>
        </template>
        <template v-if="estatus === 'CONSULTA'">
          <ion-button color="primary" @click="nuevo()">
            <i class="fas fa-plus-circle big-icon"/>
            {{ $t('global.nuevo') }}</ion-button>
          <ion-button color="success" @click="editar()">
            <i class="fas fa-edit big-icon"></i>
            {{ $t('global.editar') }}</ion-button>
          <ion-button color="warning" @click="modalEliminarDir()">
            <i class="fas fa-trash big-icon"/>
            {{ $t('global.eliminar') }}</ion-button>
        </template>
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
    IonButton, IonMenuButton, IonButtons, IonImg, IonAvatar
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
