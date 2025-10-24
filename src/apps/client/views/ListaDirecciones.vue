<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>{{ t('menuClientes.listaDirecciones') }}</ion-title>
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
    <ion-content :fullscreen="true" class="ion-padding" ref="contentElement">
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
          :buttons="alertButtons"></ion-alert>
        <ion-grid>
          <ion-row>
            <ion-col>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <!-- LISTA DE DIRECCIONES -->
      <ion-item-sliding v-for="item in lstDirecciones" :key="item.id">
        <ion-item @click="selecDir(item.id)">
          <ion-label>
            <h2>{{ item.nombreUbicacion }}</h2>
            <p>{{ item.direccion }}</p>
          </ion-label>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option color="danger">Eliminar</ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-content>

    <!-- BOTON REGRESAR -->
    <ion-button fill="solid" color="primary" class="go-back"
      @click="regresar">
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <ion-icon slot="start" :icon="chevronBackOutline"></ion-icon>
      {{ t('global.regresar') }}
    </ion-button>

    <!-- BOTON SCROLL ARRIBA -->
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <ion-fab slot="fixed" vertical="bottom" horizontal="left" class="back-to-top">
      <ion-fab-button @click="scrollToTop">
        <ion-icon :icon="chevronUpOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- OVERLAY CON SPINNER ------------------------------------------------ -->
    <div v-if="mostrarOverlaySpinner" class="overlay">
      <div class="overlay-content">
        <ion-spinner color="secondary" name="lines"
          style="width: 3rem; height: 3rem;"></ion-spinner>
        <p class="mt-3">{{ txtOverlaySpinner }}</p>
      </div>
    </div>

  </ion-page>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, 
    IonButton, IonMenuButton, IonButtons, IonImg, IonAvatar, IonAlert, IonIcon,
    IonFabButton, IonFab, IonLabel, IonNote, IonItem, IonItemOption, IonItemOptions,
    IonItemSliding, IonSpinner
  } from '@ionic/vue'
  import { chevronBackOutline, chevronUpOutline  } from 'ionicons/icons'
  import { getCurrentInstance } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  const { t /*, locale*/ } = useI18n()

  // VARIABLES ------------------------------
  // ***********************
  const app = getCurrentInstance();
  const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  const $api = app?.appContext.config.globalProperties.$api as string
  const router = useRouter()
  // ***************************************************************************
  // ***************************************************************************
  const contentElement = ref<any>(null)
  const avatarSrc = ref('/img/avatar.png')
  const idCliente = ref('')
  const status = ref('otraCuenta')
  const alertButtons = ref([
  {
    text: t('global.aceptar'), // O el texto que necesites
    role: 'cancel',
    handler: () => {
      console.log('Alerta cerrada')
    },
  }
  ])
  const lstDirecciones = ref([])
  const mostrarOverlaySpinner = ref(false)
  const txtOverlaySpinner = ref('')
  // -----------------------------------------
  // FUNCIONES LOCALES
  // Lógica de mounted()
  onMounted(() => {
    avatarSrc.value = localStorage.getItem('urlImg')
    idCliente.value = localStorage.getItem('idCliente')
    mostrarOverlaySpinner.value = true
    txtOverlaySpinner.value = t('direcciones.cargandoDirecciones')
    listaDirecciones()
  })
  const verMiPerfil = () => {
    router.push('/client/MiPerfil')
  }
  const nuevaDireccion = () => {
    localStorage.setItem('idDireccion', '0')
    router.push('/client/direcciones/')
  }
  const regresar = () => {
    window.history.back()
  }
  const scrollToTop = () => {
    if (contentElement.value && $globalFunc) {
      $globalFunc.scrollToTop(contentElement.value)
    } else {
      console.error("No se pudo llamar a scrollToTop. contentElement o $globalFunc es nulo.")
    }
  }
  const listaDirecciones = () => {
    axios.get($api + '/ClienteDirecciones/direccionesPorCliente?idCliente=' + idCliente.value)
      .then(function (response) {
        console.log('Lista Direcciones ---')
        console.log(response.data)
        lstDirecciones.value = response.data
        mostrarOverlaySpinner.value = false
      })
      .catch(function (error) {
        console.log(error)
        mostrarOverlaySpinner.value = false
      })
  }
  const selecDir = (id) => {
    localStorage.setItem('idDireccion', id)
    console.log('localStorage.getItem(idDireccion): ', localStorage.getItem('idDireccion'))
    router.push('/client/direcciones/')
  }
</script>
