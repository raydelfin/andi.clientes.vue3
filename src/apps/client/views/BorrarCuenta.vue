<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('miPerfil.eliminarCuenta') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- CONTINUAR -------------------------------------------------------- -->
      <div v-if="status==='continuar'">
        <ion-grid>
          <!-- CODIGO PARA VALIDAR CORREO -->
          <ion-row>
            <ion-col>
              {{ t('miPerfil.ingresarCodigoCorreo') }}
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <p>{{ t('miPerfil.preguntaEliminarCuenta') }}</p>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <div class="centrar">
                <ion-avatar>
                  <ion-img :src="avatarSrc ?? '/img/avatar.png'" style="width: 85px; height: 85px; left: -12px; position: relative;" />
                </ion-avatar>
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="centrar" style="padding-top: 10px;">
              {{ usuario }}
            </ion-col>
          </ion-row>
          <!-- TEXTO SOLICITADO PARA ELIMINACIÓN -->
          <ion-row>
            <ion-col>
              {{ t('miPerfil.ingresatxt') }} [ {{ t('miPerfil.txtEliminarCuentaANDI') }} ] {{ t('miPerfil.paraProcederElim') }}
            </ion-col>
          </ion-row>
          <!-- Usuario ANDI -->
          <ion-row>
            <ion-col>
              <ion-input
                :label="t('miPerfil.escribeFrase')"
                v-model.trim="txtEliminar"
                @keyup.enter="valContinuarEliminar()"
                label-placement="stacked"
                :clear-on-edit="true"
                :maxlength="50"
                :placeholder="t('miPerfil.txtEliminarCuentaANDI')"
                @input="txtEliminar = txtEliminar.toUpperCase()"
                fill="outline"
                mode="md" >
              </ion-input>    
            </ion-col>
          </ion-row>
          <!-- Checkbox si quiero eliminar -->
          <ion-row>
            <ion-col>
              <ion-toggle v-model="toggleButton" label-placement="end" >
                {{ t('miPerfil.siQuieroEliminarCuenta') }} </ion-toggle>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-button color="secondary" @click="regresar()">
                {{ t('global.no') }}</ion-button>
              <ion-button color="danger"
                :disabled='!toggleButton'
                @click="valContinuarEliminar()">{{ t('miPerfil.continuarEliminacion') }}</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <!-- BORRAR ----------------------------------------------------------- -->
      <div v-if="status==='borrar'">
        <div class="centrar">
          <ion-grid>
            <!-- CORREO -->
            <ion-row>
              <ion-col class="centrar">
                <i class="far fa-envelope big-icon"></i>
                {{ correo }}
              </ion-col>
            </ion-row>
            <!-- CODIGO PARA VALIDAR CORREO -->
            <ion-row>
              <ion-col>
                <ion-input-otp :length="4" shape="round" size="small"
                v-model="codigoCorreo" />
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                {{ t('miPerfil.ingresarCodigoCorreo') }}
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <br>
        <hr>
        <ion-button color="secondary" @click="regresar()">
          {{ $t('global.no') }}</ion-button>
        <ion-button color="danger" @click="valEliminarCuenta()">
          {{ $t('miPerfil.eliminarMiCuenta') }}</ion-button>
      </div>
    </ion-content>
  </ion-page>

  <!-- OVERLAY CON SPINNER ------------------------------------------------ -->
  <div v-if="mostrarOverlaySpinner"> 
    <ion-backdrop :visible="true" class="custom-overlay-backdrop"></ion-backdrop>
    <div class="overlay-content-wrapper">
      <div class="overlay-content">
        <ion-spinner color="secondary" name="lines"
          style="width: 3rem; height: 3rem;"></ion-spinner>
        <p>{{ txtOverlaySpinner }}</p>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, 
    IonSpinner, IonToggle, IonText, IonAvatar, IonImg, IonInputOtp, IonBackdrop
  } from '@ionic/vue'
  import { getCurrentInstance } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { updateAuthStatus } from '../../../shared/stores/authStore'

  const { t } = useI18n()

  // VARIABLES ------------------------------
  // ***********************
  const app = getCurrentInstance();
  const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  const $api = app?.appContext.config.globalProperties.$api as string
  const router = useRouter()
  // // ***********************
  const status = ref('continuar')
  const avatarSrc = ref<string | null>(null)
  const usuario = ref<string | null>(null)
  const idCliente = ref<string | null>(null)
  const nomCliente = ref<string | null>(null)
  const correo = ref<string | null>(null)
  const idiomaSelec = ref<string | null>(null)
  const toggleButton = ref(false)
  const txtEliminar = ref('')
  const mostrarOverlaySpinner = ref(false)
  const txtOverlaySpinner = ref('')
  const codigoCorreo = ref('')

  // -----------------------------------------
  // FUNCIONES LOCALES
  // Lógica de mounted()
  onMounted(() => {
    usuario.value = localStorage.getItem('usuario')
    idCliente.value = localStorage.getItem('idCliente')
    nomCliente.value = localStorage.getItem('nombre')
    correo.value = localStorage.getItem('correoElectronico')
    idiomaSelec.value = localStorage.getItem('idiomaSelec')
    avatarSrc.value = localStorage.getItem('urlImg') === '' ? '/img/avatar.png' : avatarSrc.value = localStorage.getItem('urlImg')
  })
  const regresar = () => {
    if (status.value === 'continuar') {
      router.replace('/client/MiPerfil');
    } else {
      status.value = 'continuar'
    }
  }
  const valContinuarEliminar = async () => {
    if (!toggleButton.value) return
    // TEXTO SOLICITADO PARA ELIMINACIÓN
    if (txtEliminar.value.trim() !== t('miPerfil.txtEliminarCuentaANDI')) {
      await $globalFunc.mostrarToast(
        t('miPerfil.textosNoCoinciden'),
        t('global.validacion'),
        5000,
        'warning')
      return
    }
    mostrarOverlaySpinner.value = true
    txtOverlaySpinner.value = t('miPerfil.valSolicitud')
    console.log('encodeURIComponent(correo.value) ---')
    console.log(encodeURIComponent(correo.value ?? ''))
    axios.put($api + '/Cliente/clienteCodigoCorreo?correo=' + encodeURIComponent(correo.value ?? ''))
      .then(async function (response) {
        const resp = response.data
        console.log('resp ---')
        console.log(resp)
        status.value = 'borrar'
        if (resp.estatus) {
          await $globalFunc.mostrarToast(
            // Mensaje
            t('miPerfil.revisarCorreoCodigo2') +
            '\n ' + t('miPerfil.revisarCorreoCodigo3'),
            // titulo
            t('miPerfil.revisarCorreoCodigo1') +
            '"' + correo.value + '"',
            5000,
            'warning')
          mostrarOverlaySpinner.value = false
          status.value = 'borrar'
        } else {
          await $globalFunc.mostrarToast(
            t('miPerfil.codigoCorreoIncorrecto'),
            t('registroCliente.correo'),
            5000,
            'warning')
          mostrarOverlaySpinner.value = false
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  const valEliminarCuenta = async () => {
    let codigo = codigoCorreo.value === null ? '' : codigoCorreo.value
    mostrarOverlaySpinner.value = true
    txtOverlaySpinner.value = t('miPerfil.valEliminacion')
    codigo = codigo.replace(/\D/g, '')
    console.log('codigo: ' + codigo)
    console.log(codigo)
    if (codigo.length < 6) {
      await $globalFunc.mostrarToast(
        t('registroCliente.6DigitosCodigoCorreo'),
        t('global.validacion'),
        5000,
        'warning')
      return
    }
    console.log('encodeURIComponent(correo.value) ---')
    console.log(encodeURIComponent(correo.value ?? ''))
    console.log('codigo ---')
    console.log(codigo)
    // SIN ERRORES ========================
    axios.post($api + '/Cliente/borrarCuentaANDI?correo=' + encodeURIComponent(correo.value ?? '') + '&codigo=' + codigo)
      .then(async function (response) {
        const cliente = response.data
        if (cliente.correoElectronico === null) {
          mostrarOverlaySpinner.value = false
          await $globalFunc.mostrarToast(
            t('miPerfil.codigoCorreoIncorrecto'),
            t('registroCliente.correo'),
            5000,
            'warning')
        } else {
          await $globalFunc.mostrarToast(
            t('miPerfil.cuentaBorradaExitosamente'),
            t('miPerfil.miPerfil'),
            5000,
            'success')
          cerrarSesion()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
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
    updateAuthStatus(false)
    router.push('/client/Login')
  }
</script>
