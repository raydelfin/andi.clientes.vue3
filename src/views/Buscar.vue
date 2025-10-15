<template>
  <ion-page>
    <AppHeader :title="t('menuClientes.buscar')" />
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
  const status = ref('otraCuenta')
  const lstTipoLogin = ref<Array<{ valor: number, nombre: string }>>([])
  const tipoLoginSelec = ref({ valor: 1, nombre: '' })
  const paisSelec = ref(null)
  const lstPaises = ref([
    { valor: 1, descripcion: '+52' },
    { valor: 2, descripcion: '+1' }
  ])
  const isModalEliminarCuentaOpen = ref(false)
  const credenciales = ref({
    usuario: '',
    correo: '',
    cel: '',
    password: ''
  })
  const mostrarOverlaySpinner = ref(false)
  const txtOverlaySpinner = ref('')
  const checkInternet = ref(false)
  const msgToast = ref('')
  const usuarioSelec = ref({ valor: 0, usuario: '' })
  const dismissCountDown = ref(0)
  const dismissSecs = ref(10)
  const ubicacion = ref({ latitude: 0, longitude: 0 })
  const isModalOpen = ref(false)
  const toggleButton = ref(false)
  // -----------------------------------------
  // FUNCIONES LOCALES
  // Lógica de mounted()
  onMounted(() => {
    localStorage.setItem('interfaz', 'Buscar')
    listaLogin()
    mostrarOverlaySpinner.value = false
    console.log('Buscar.vue ---')
  })
  const listaLogin = () => {
    // 💡 PARA ACTUALIZAR UN ref(), USA .value
    lstTipoLogin.value = [
      { valor: 1, nombre: t('login.loginUsuarioAndi') },
      { valor: 2, nombre: t('login.loginEmail') },
      { valor: 3, nombre: t('login.loginCel') }
    ]
    tipoLoginSelec.value = lstTipoLogin.value[0] // Asegúrate de usar .value aquí
  }
  const cambiarIdioma = (nuevoLocale) => {
    // Cuando usas 'locale' desde useI18n, es una referencia reactiva (ref), 
    // por lo que debes usar .value para cambiar su valor.
    locale.value = nuevoLocale
    console.log(`Idioma cambiado a: ${locale.value}`)
  }
  const cambioTipoLogin = () => {
    console.log('cambioTipoLogin() ---')
    console.log('tipoLoginSelec ---')
    console.log(tipoLoginSelec)
    if (tipoLoginSelec.value.valor === 3) {
      paisSelec.value = lstPaises.value.find(p => p.valor === 1)
      console.log('paisSelec ---')
      console.log(paisSelec)
    }
  }
  const scrollToTop = async () => {
    const content = document.querySelector('ion-content');
    if (content) {
      await content.scrollToTop(500);
    }
  }
  const modalQuitarCuenta = (u) => {
    // Asegúrate de definir 'usuarioSelec' si la usas
    // this.usuarioSelec = u; 
    isModalEliminarCuentaOpen.value = true
  }
  const validarLogin = async () => {
    let error = 0
    mostrarOverlaySpinner.value = true
    txtOverlaySpinner.value = t('login.valCredenciales')
    // Validar Internet
    /*
    checkInternet.value = await verificarConexionInternetReal()
    if (!checkInternet.value) {
      mostrarOverlaySpinner.value = false
      return
    }

    */
    checkInternet.value = false
    // Usuario ANDI
    if (tipoLoginSelec.value.valor === 1) {
      // Validar Usuario
      if (credenciales.value.usuario === '') {
        await $globalFunc.mostrarToast(
          t('login.ingresaUsuario'),
          t('global.validacion'),
          5000,
          'warning')
        /*
        $bvToast.toast($t('login.ingresaUsuario'), {
          title: `${$t('global.validacion')}`,
          autoHideDelay: 5000,
          appendToast: true,
          toastClass: `bs4-toast bg-${'warning'}`
        })
        */
        error = 1
      }
    }
    // CORREO ELECTRÓNICO
    if (tipoLoginSelec.value.valor === 2) {
      if (credenciales.value.correo.length === 0) {
        /*
        $bvToast.toast($t('login.ingresarCorreo'), {
          title: `${$t('global.validacion')}`,
          autoHideDelay: 5000,
          appendToast: true,
          toastClass: `bs4-toast bg-${'warning'}`
        })
        */
        error = 1
      }
      /*
      if (!correoValido(credenciales.correo)) {
        $bvToast.toast($t('login.emailInvalido'), {
          title: `${$t('global.validacion')}`,
          autoHideDelay: 5000,
          appendToast: true,
          toastClass: `bs4-toast bg-${'warning'}`
        })
        error = 1
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
        error = 1
      }
      if (tel.length < 10) {
        $bvToast.toast($t('login.ingresa10DigitosTel'), {
          title: `${$t('global.validacion')}`,
          autoHideDelay: 5000,
          appendToast: true,
          toastClass: `bs4-toast bg-${'warning'}`
        })
        error = 1
      }
    }
    */
    // Contraseña vacia
    if (credenciales.value.password === '') {
      await $globalFunc.mostrarToast(
        t('login.ingresaContraseña'),
        t('global.validacion'),
        5000,
        'warning')
      error = 1
    }
    if (error === 0) {
      checarLogin()
    } else {
      mostrarOverlaySpinner.value = false
    }
  }
  const checarLogin = async () => {
    const self = this
    let tipoLogin = ''
    ubicacion.value = null
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
    try {
      // 💡 Uso de async/await para una sintaxis más limpia
      const response = await axios.post(
        $api + '/Cliente/LoginCliente', obj)
      if (response.data.id === 0) {
        await $globalFunc.mostrarToast(
          t('login.passIncorrecto'),
          t('global.validacion'),
          5000,
          'warning')
        mostrarOverlaySpinner.value = false
      } else {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // console.log('position GPS ---')
              // console.log(position)
              ubicacion.value.latitude = position.coords.latitude
              ubicacion.value.longitude = position.coords.longitude
              console.log('ubicacion: ' + ubicacion.value)
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
              localStorage.setItem('latitud', ubicacion.value.latitude.toString())
              localStorage.setItem('longitud', ubicacion.value.longitude.toString())
              // localStorage.setItem('ubicacion', ubicacion)
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
              localStorage.setItem('tipoLogin', tipo)
              localStorage.setItem('valorLogin', valor)
              router.push('/views/buscar/')
            },
            (error) => {
              console.log('Error 1')
              ubicacion.value = null
              mostrarOverlaySpinner.value = false
              // error.value = 'Error al obtener ubicación: ' + error.message
            }
            // { enableHighAccuracy: true } // Opcional, para mejor precisión
          )
        } else {
          mostrarOverlaySpinner.value = false
          console.log('Error 2')
        }
        if (ubicacion.value === null) {
          // dismissCountDown.value = dismissSecs
        }
      }
    } catch (err) {
      // Lógica que estaba en .catch(function (error) { ...
      if (axios.isAxiosError(err) && err.response) {
        // Error de la respuesta (ej. 400, 500)
        err = err.response.data.message || 'Error de servidor';
      } else {
        // Otros errores (ej. de red)
        err = 'No se pudo conectar al servidor.';
      }
      console.error('Error durante el login:', err);
      
    } finally {
      // isLoading.value = false;
    }
  }
  const guardarUbicacion = () => {
    localStorage.setItem('busqueda', JSON.stringify({
      latitud: ubicacion.value.latitude,
      longitud: ubicacion.value.longitude
    }))
  }
  const modalCerrarSesion = () => {
    toggleButton.value = false
    isModalOpen.value = true
  }
  const cerrarModalCerrarSesion = () => {
    isModalOpen.value = false
  }
  const cerrarSesion = () => {
    isModalOpen.value = false
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
    router.push('/')
  }
</script>
