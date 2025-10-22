<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-menu-button></ion-menu-button>
        <ion-title>{{ t('menuClientes.login') }}</ion-title>
      </ion-buttons>
    </ion-toolbar>
  </ion-header> 
  <ion-content :fullscreen="true" class="ion-padding">
    <div class="centrar-login">
      <br>
      <!-- Logo ANDI --> 
      <div class="centrar">
        <ion-img
          alt=""
          src="/img/Logo ANDI 500.png"
          style="width: 120px; height: 120px;"
        ></ion-img>
      </div>
      <!-- <i class="fas fa-search big-icon"></i> -->
      <br>
      <ion-list>
        <!-- Tipo Login --> 
        <ion-item>
          <ion-select
            :label="$t('login.loginPor')"
            v-model="tipoLoginSelec"
            @ionChange="cambioTipoLogin()"
            fill="outline"
            mode="md" >
            <ion-select-option v-for="login in lstTipoLogin"
              :key="login.nombre" :value="login">
              {{ login.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <!-- Usuario ANDI -->
        <ion-item>
          <ion-input
            v-model.trim="credenciales.usuario"
            :label="t('login.usuario')"
            label-placement="stacked"
            :clear-on-edit="true"
            :maxlength="30"
            :placeholder="$t('login.ingresaUsuario')"
            @input="credenciales.usuario = credenciales.usuario.toUpperCase()"
            fill="outline"
            mode="md" >
          </ion-input>
        </ion-item>
        <!-- Contraseña -->
        <ion-item>
          <ion-input
            type="password"
            v-model="credenciales.password"
            @keyup.enter="validarLogin()"
            :label="t('login.pass')"
            label-placement="stacked"
            :clear-on-edit="true"
            :maxlength="30"
            :placeholder="t('login.ingresaContraseña')"
            fill="outline"
            mode="md" >
              <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
              <ion-input-password-toggle slot="end"></ion-input-password-toggle>
          </ion-input>
        </ion-item>
      </ion-list>
      <br>
      <!-- Botón Ingresar -->
      <ion-button @click="validarLogin()" size="small" style="width: 100%;">
        {{ t('login.ingresar') }}
      </ion-button>
      <ion-grid>
        <ion-row>
          <ion-col>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </ion-content>

  <!-- OVERLAY CON SPINNER ------------------------------------------------ -->
  <div v-if="mostrarOverlaySpinner" class="overlay">
    <div class="overlay-content">
      <ion-spinner color="secondary" name="lines"
        style="width: 3rem; height: 3rem;"></ion-spinner>
      <p class="mt-3">{{ txtOverlaySpinner }}</p>
    </div>
  </div>
</template>
<!-- ************************************************************************************************************************************************************* -->
<!-- SCRIPT ****************************************************************************************************************************************************** -->
<!-- ************************************************************************************************************************************************************* -->
<script setup lang="ts">
  // import { i18n, t } from '../i18n'
  // import mensajesEs from '../idiomas/esp.json'
  import { useI18n } from 'vue-i18n'
  import { useTranslations } from '../../../shared/composables/useTranslations';
  import { ref, onMounted } from 'vue'
  import { 
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, 
    IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonSpinner, 
    IonButtons, IonMenuButton,
    IonImg, IonInputPasswordToggle, IonList
  } from '@ionic/vue'
  import { getCurrentInstance } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { /*isAuthenticatedRef,*/ updateAuthStatus } from '../../../shared/stores/authStore'
    
  // VARIABLES --------------------------------------------------------------------------------
  // **********************************************
  // const { t } = useI18n()
  const { t, locale } = useI18n()
  const app = getCurrentInstance()
  const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  const $api = app?.appContext.config.globalProperties.$api as string
  const router = useRouter()
  // // **********************************************
  const status = ref('otraCuenta')
  const lstTipoLogin = ref<Array<{ valor: number, nombre: string }>>([])
  const tipoLoginSelec = ref<{ valor: number; nombre: string } | null>(null)
  const paisSelec = ref(null)
  const lstPaises = ref([
    { valor: 1, nombre: '+52' },
    { valor: 2, nombre: '+1' }
  ])
  // const isModalEliminarCuentaOpen = ref(false)
  const credenciales = ref({
    usuario: '',
    correo: '',
    cel: '',
    password: ''
  })
  const mostrarOverlaySpinner = ref(false)
  const txtOverlaySpinner = ref('')
  const checkInternet = ref(false)
  // const msgToast = ref('')
  const usuarioSelec = ref({ valor: 0, usuario: '' })
  // const dismissCountDown = ref(0)
  // const dismissSecs = ref(10)
  const lat = ref(0)
  const lon = ref(0)
  const ubicacion = ref('')
  // FUNCIONES LOCALES --------------------------------------------------------------------------
  // Lógica de mounted()
  onMounted(() => {
    listaLogin()
  })
  const listaLogin = () => {
    // 💡 PARA ACTUALIZAR UN ref(), USA .value
    lstTipoLogin.value = [
      { valor: 1, nombre: t('login.loginUsuarioAndi') },
      { valor: 2, nombre: t('login.loginEmail') },
      { valor: 3, nombre: t('login.loginCel') }
    ]
    if (lstTipoLogin.value.length > 0) {
      tipoLoginSelec.value = lstTipoLogin.value[0]!
    }
  }
  const cambioTipoLogin = () => {
    console.log('cambioTipoLogin() ---')
    console.log('tipoLoginSelec ---')
    console.log(tipoLoginSelec)
    if (tipoLoginSelec.value) {
      if (tipoLoginSelec.value.valor === 3) {
        paisSelec.value = lstPaises.value.find(p => p.valor === 1) ?? ''
        console.log('paisSelec ---')
        console.log(paisSelec)
      }
    }
  }
  const validarLogin = async () => {
    console.log('validarLogin() ---')
    // console.log(localStorage.getItem('usuario'))
    mostrarOverlaySpinner.value = true
    txtOverlaySpinner.value = t('login.valCredenciales')
    // Validar Internet
    checkInternet.value = await $globalFunc.verificarConexionInternetReal()
    if (!checkInternet.value) {
      mostrarOverlaySpinner.value = false
      return
    }
    checkInternet.value = false
    // console.log('credenciales.value ---')
    // console.log(credenciales.value)
    // Usuario ANDI
    if (tipoLoginSelec.value.valor === 1) {
      // Validar Usuario
      if (credenciales.value.usuario === '') {
        await $globalFunc.mostrarToast(
          t('login.ingresaUsuario'),
          t('global.validacion'),
          5000, 'warning')
        mostrarOverlaySpinner.value = false
        return
      }
    }
    // CORREO ELECTRÓNICO
    if (tipoLoginSelec.value.valor === 2) {
      if (credenciales.value.correo.length === 0) {
        await $globalFunc.mostrarToast(
          t('login.ingresarCorreo'),
          t('global.validacion'),
          5000, 'warning')
        mostrarOverlaySpinner.value = false
        return
      }
      /*
      if (!correoValido(credenciales.correo)) {
        $bvToast.toast($t('login.emailInvalido'), {
          title: `${$t('global.validacion')}`,
          autoHideDelay: 5000,
          appendToast: true,
          toastClass: `bs4-toast bg-${'warning'}`
        })
        mostrarOverlaySpinner.value = false
        return
      }
      */
    }
    /*
    // TELEFONO CELULAR
    if (tipoLoginSelec.value.valor === 3) {
      var tel = credenciales.cel === null ? '' : credenciales.cel
      tel = credenciales.cel.replace(/\D/g, '')
      if (tel.trim() === '') {
        $bvToast.toast($t('login.ingresarTelefono'), {
          title: `${$t('global.validacion')}`,
          autoHideDelay: 5000,
          appendToast: true,
          toastClass: `bs4-toast bg-${'warning'}`
        })
        mostrarOverlaySpinner.value = false
        return
      }
      if (tel.length < 10) {
        $bvToast.toast($t('login.ingresa10DigitosTel'), {
          title: `${$t('global.validacion')}`,
          autoHideDelay: 5000,
          appendToast: true,
          toastClass: `bs4-toast bg-${'warning'}`
        })
        mostrarOverlaySpinner.value = false
        return
      }
    }
    */
    // Contraseña vacia
    if (credenciales.value.password === '') {
      await $globalFunc.mostrarToast(
        t('login.ingresaContraseña'),
        t('global.validacion'),
        5000, 'warning')
      mostrarOverlaySpinner.value = false
      return
    }
    checarLogin()
  }
  const checarLogin = async () => {
    console.log('checarLogin() ---')
    let tipoLogin = ''
    if (status.value === 'otraCuenta') {
      if (tipoLoginSelec.value.valor === 1) tipoLogin = credenciales.value.usuario
      if (tipoLoginSelec.value.valor === 2) tipoLogin = credenciales.value.correo
      if (tipoLoginSelec.value.valor === 3) tipoLogin = paisSelec.value.descripcion + credenciales.value.cel
    }
    if (status.value === 'pass') {
      if (tipoLoginSelec.value.valor === 1) tipoLogin = usuarioSelec.value.usuario
      if (tipoLoginSelec.value.valor === 2) tipoLogin = credenciales.value.correo
      if (tipoLoginSelec.value.valor === 3) tipoLogin = paisSelec.value.descripcion + credenciales.value.cel
    }
    const obj = {
      usuario: encodeURIComponent(tipoLogin),
      contraseña: encodeURIComponent(credenciales.value.password),
      tipoLogin: tipoLoginSelec.value.valor
    }
    console.log('obj ---')
    console.log(obj)
    console.log('$api ---')
    console.log($api)
    // 💡 Uso de async/await para una sintaxis más limpia
    try {
      const response = await axios.post($api + '/Cliente/LoginCliente', obj, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 segundos timeout
      })
      console.log('Response status:', response.status)
      console.log('Response data:', response.data)
      /*
      axios.post($api + '/Cliente/LoginCliente', obj)
        .then(async function (response) {
      */
      if (response.data.usuario === null) {
        await $globalFunc.mostrarToast(
          t('login.passIncorrecto'),
          t('global.validacion'),
          5000, 'warning')
        mostrarOverlaySpinner.value = false
      } else {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // console.log('position GPS ---')
              // console.log(position)
              const ubicacion = position.coords
              // console.log('self.ubicacion: ' + self.ubicacion)
              lat.value = position.coords.latitude
              lon.value = position.coords.longitude
              guardarUbicacion()
              // console.log('Login Cliente ---')
              // console.log(response.data)
              localStorage.setItem('idCliente', response.data.idCliente)
              localStorage.setItem('nombre', response.data.nombre)
              localStorage.setItem('formatoFecha', response.data.formatoFecha)
              localStorage.setItem('formatoHora', response.data.formatoHora)
              localStorage.setItem('idZonaHoraria', response.data.idZonaHoraria)
              localStorage.setItem('idMetodoPago', response.data.idMetodoPago)
              localStorage.setItem('idMoneda', response.data.idMoneda)
              localStorage.setItem('distanciaEn', response.data.distanciaEn)
              localStorage.setItem('cantidadDistancia', response.data.cantidadDistancia)
              localStorage.setItem('usuario', response.data.usuario)
              localStorage.setItem('correoElectronico', response.data.correoElectronico)
              localStorage.setItem('colorTema', response.data.colorTema)
              localStorage.setItem('idiomaSelec', response.data.idioma)
              localStorage.setItem('latitud', lat.value.toString())
              localStorage.setItem('longitud', lon.value.toString())
              localStorage.setItem('cel', response.data.telefono)
              localStorage.setItem('lada', response.data.lada)
              localStorage.setItem('firebaseUid', response.data.firebaseUid)
              localStorage.setItem('customToken', response.data.customToken)
              if (response.data.urlImg === '') {
                localStorage.setItem('urlImg', '/img/avatars/1.png')
              } else {
                localStorage.setItem('urlImg', response.data.urlImg)
              }
              let tipo = ''
              let valor = ''
              // ANDI Usuario
              if (tipoLoginSelec.value.valor === 1) {
                tipo = 'usuario'
                valor = response.data.usuario
              }
              if (tipoLoginSelec.value.valor === 2) {
                tipo = 'correo'
                valor = response.data.correoElectronico
              }
              if (tipoLoginSelec.value.valor === 3) {
                tipo = 'telefono'
                valor = response.data.telefono
              }
              localStorage.setItem('tipoLogin', tipo.toString())
              localStorage.setItem('valorLogin', valor)
              router.push('/client/Buscar')
            },
            (error) => {
              console.log('Error 1')
              mostrarOverlaySpinner.value = false
              console.log('Error al obtener ubicación: ' + error.message)
            }
            // { enableHighAccuracy: true } // Opcional, para mejor precisión
          )
        } else {
          mostrarOverlaySpinner.value = false
          console.log('Error 2')
        }
        /*
        if (ubicacion.value === null) {
          dismissCountDown = dismissSecs
        }
        */
      }
    } catch (error) {
      mostrarOverlaySpinner.value = false
      console.log('Error completo:', error)
    }
  }
  const guardarUbicacion = () => {
    localStorage.setItem('busqueda', JSON.stringify({
      latitud: lat.value,
      longitud: lon.value
    }))
  }
  // ===========================================================================
  // ===========================================================================
</script>
