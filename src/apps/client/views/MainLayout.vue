<template>
  <ion-split-pane content-id="main-content" when="md">
    <ion-menu content-id="main-content" type="overlay">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ t('menuClientes.tituloMenu') }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list id="inbox-list">
          <template v-if="esAutenticado">
            <!-- BUSCAR -->
            <ion-menu-toggle :auto-hide="false">
              <ion-item @click="btnBuscar()" lines="none" button>
                <ion-icon :icon="search"></ion-icon>
                &nbsp; <ion-label>{{ t('menuClientes.buscar') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
            <!-- FAVORITOS -->
            <ion-menu-toggle :auto-hide="false">
              <ion-item @click="btnFavoritos()" lines="none" button>
                <ion-icon :icon="heart"></ion-icon>
                &nbsp; <ion-label>{{ $t('menuClientes.favoritos') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
            <!-- MI PERFIL -->
            <ion-menu-toggle :auto-hide="false">
              <ion-item @click="btnMiPerfil()" lines="none" button>
                <ion-icon :icon="personSharp"></ion-icon>
                &nbsp; <ion-label>{{ $t('menuClientes.miPerfil') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
            <!-- DIRECCIONES -->
            <ion-menu-toggle :auto-hide="false">
              <ion-item @click="btnDirecciones()" lines="none" button>
                <ion-icon :icon="location"></ion-icon>
                &nbsp; <ion-label>{{ $t('menuClientes.direcciones') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </template>
          <!-- TEMA DARK Y LIGHT -->
          <ion-item lines="none">
            <ion-icon :icon="colorPalette"></ion-icon>
            &nbsp;
            <ion-label>{{ t('menuClientes.themeDark') }}</ion-label>
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <ion-toggle :checked="isDark" slot="end"
              @ionChange="toggleDarkTheme(!isDark)" />
          </ion-item>
          <!-- IDIOMAS -->
          <ion-item lines="full">
            <ion-img :src="paisSelec.bandera" class="banderita" />
            <ion-select 
              :label="t('menuClientes.idioma')"
              interface="popover"
              :value="paisSelec.valor"
              @ionChange="cambioIdioma($event.detail.value)"
              class="language-select"
              aria-label="Seleccionar Idioma" >
              <ion-img
                :src="paisSelec.bandera"
                style="width: 20px; height: auto; margin-right: 10px; margin-top: 2px;"
              ></ion-img>
              <ion-select-option 
                v-for="idioma in lstPaises" 
                :key="idioma.valor" 
                :value="idioma.valor" >
                <ion-img :src="idioma.bandera" />
                <span>{{ idioma.nombre }}</span>
              </ion-select-option>
            </ion-select>
          </ion-item>
          <template v-if="esAutenticado">
            <!-- CERRAR SESIÓN -->
            <ion-menu-toggle :auto-hide="false">
              <ion-item @click="modalCerrarSesion()" lines="none" button>
                <ion-icon :icon="logOut"></ion-icon>
                &nbsp; <ion-label>{{ $t('menuClientes.cerrarSesion') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </template>
        </ion-list>
      </ion-content>
    </ion-menu>
    <!-- RUTEADOR -->
    <div id="main-content" class="ion-page">
      <router-view /> 
    </div>
  </ion-split-pane>

  <!-- MODAL CERRAR SESIÓN -->
  <ion-modal ref="modal" :is-open="isModalOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('menuClientes.cerrarSesion') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>{{ $t('menuClientes.preguntaCerrarSesion') }}</p>
      <ion-toggle
        v-model="toggleButton"
        label-placement="end" >
        {{ $t('menuClientes.siQuieroCerrarSesion') }}
      </ion-toggle>
      <ion-grid class="ion-margin-top">
        <ion-row class="ion-justify-content-end">
          <ion-col size="auto">
            <ion-button color="danger" @click="cerrarModalCerrarSesion">
              {{ $t('global.no') }}
            </ion-button>
          </ion-col>
          <ion-col size="auto">
            <ion-button
              color="primary"
              :disabled='!toggleButton'
              @click="cerrarSesion" >
              {{ $t('global.si') }}
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>

</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted, computed  } from 'vue'
import { getCurrentInstance } from 'vue'
import { 
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, 
    IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonModal, 
    IonToggle, IonIcon, IonMenu, IonMenuToggle, IonSplitPane, IonList, IonImg
} from '@ionic/vue'
import { search, heart, logOut, colorPalette, personSharp, location  } from 'ionicons/icons'
import { /*useRoute,*/ useRouter } from 'vue-router'
import { isAuthenticatedRef, updateAuthStatus } from '../../../shared/stores/authStore'
import { useI18n } from 'vue-i18n'

// VARIABLES --------------------------------------------------------------------------------
  // ***********************
  const app = getCurrentInstance()
  const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  const { t, locale } = useI18n()
  /*
  const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  */
  const $api = app?.appContext.config.globalProperties.$api as string
  // const route = useRoute()
  const router = useRouter()
  const esAutenticado = computed(() => {
    return isAuthenticatedRef.value
  })
  // // ***********************
  const avatarSrc = ref('/img/avatar.png')
  const isModalOpen = ref(false)
  const toggleButton = ref(false)
  // const idioma = ref('en')
  const paisSelec = ref({ valor: 'es', descripcion: 'Español', bandera: '/img/mexico.png' })
  const lstPaises = ref([
      { valor: 'es', nombre: 'Español', bandera: '/img/mexico.png' },
      { valor: 'en', nombre: 'English', bandera: '/img/usa.png' }
  ])
  const isDark  = ref(true)
  // -----------------------------------------
  // FUNCIONES LOCALES
  // Lógica de mounted()
  onMounted(() => {
    cambioIdioma('es')
    // Cargar preferencia guardada o usar la del sistema
    const storedTheme = localStorage.getItem('theme')
    let initialThemeIsDark = false
    if (storedTheme) {
      initialThemeIsDark = storedTheme === 'dark'
    } else {
      // Si no hay preferencia, usar la del sistema operativo
      initialThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    toggleDarkTheme(initialThemeIsDark)
    // Validacion cuando viene del index.ts
    let iniciada = localStorage.getItem('appIniciada')
    console.log('appIniciada: ', iniciada)
    if (iniciada === '1') {
      localStorage.setItem('appIniciada', '0')
      // Actualizar img del usuario
      cargarImgPerfil()
    }
  })
  const btnBuscar = () => {
    router.push('/client/Buscar')
  }
  const btnFavoritos = () => {
    router.push('/client/Favoritos')
  }
  const btnMiPerfil = () => {
    router.push('/client/MiPerfil')
  }
  const btnDirecciones = () => {
    router.push('/client/ListaDirecciones')
  }
  const toggleDarkTheme = (shouldAdd: boolean) => {
    // Aplicar o remover la clase 'dark' en el body
    document.body.classList.toggle('dark', shouldAdd)
    isDark.value = shouldAdd
    // Opcional: Persistir la preferencia del usuario en el localStorage
    localStorage.setItem('theme', shouldAdd ? 'dark' : 'light')
  }
  const cambioIdioma = (idioma) => {
    locale.value = idioma
    const nuevoPais = lstPaises.value.find(p => p.valor === idioma);
    if (nuevoPais) {
        paisSelec.value.valor = nuevoPais.valor;
        paisSelec.value.descripcion = nuevoPais.nombre;
        paisSelec.value.bandera = nuevoPais.bandera;
    }
  }
  const modalCerrarSesion = () => {
    toggleButton.value = false
    isModalOpen.value = true
  }
  const cerrarModalCerrarSesion = () => {
    isModalOpen.value = false
  }
  const cerrarSesion = () => {
    console.log('cerrarSesion() ---')
    localStorage.setItem('busqueda', '')
    localStorage.setItem('idCliente', '')
    localStorage.setItem('nombre', '')
    localStorage.setItem('formatoFecha', '')
    localStorage.setItem('formatoHora', '')
    localStorage.setItem('idZonaHoraria', '0')
    localStorage.setItem('idMetodoPago', '0')
    localStorage.setItem('idMoneda', '0')
    localStorage.setItem('distanciaEn', '5')
    localStorage.setItem('cantidadDistancia', '0')
    localStorage.setItem('usuario', '')
    localStorage.setItem('correoElectronico', '')
    localStorage.setItem('colorTema', '')
    localStorage.setItem('idiomaSelec', 'ing')
    localStorage.setItem('latitud', '0')
    localStorage.setItem('longitud', '0')
    localStorage.setItem('ubicacion', '')
    localStorage.setItem('cel', '')
    localStorage.setItem('lada', '')
    localStorage.setItem('firebaseUid', '')
    localStorage.setItem('customToken', '')
    localStorage.setItem('urlImg', '/img/avatars/1.png')
    localStorage.setItem('tipoLogin', '')
    localStorage.setItem('valorLogin', '')
    isModalOpen.value = false
    updateAuthStatus(false)
    router.replace('/client/Login')
  }
  const cargarImgPerfil = async () => {
    // console.log('cargarImgPerfil() ---')
    let idCliente = localStorage.getItem('idCliente')
    // console.log('idCliente: ', idCliente)
    const lstClientes = [ idCliente ]
    // console.log('lstClientes: ', lstClientes)
    try {
      const response = await axios.post($api + '/Cliente/ObtenerImagenPerfiles', lstClientes, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 segundos timeout
      })
      // console.log('Response status:', response.status)
      // console.log('Response data:', response.data)
      // console.log('urlImagen: ', response.data[0].urlImagen)
      if (response.data.urlImagen === '') {
        localStorage.setItem('urlImg', '/img/avatars/1.png')
      } else {
        localStorage.setItem('urlImg', response.data[0].urlImagen)
      }
    } catch (error) {
      console.log('Error completo:', error)
    }
  }
</script>