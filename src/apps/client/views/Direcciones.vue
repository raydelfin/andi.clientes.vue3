<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>{{ t('menuClientes.direccion') }}</ion-title>
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
      <div>
        <!-- BOTONES CATALOGO -->
        <template v-if="estatus === 'INICIO'">
          <ion-button color="primary" @click="nuevo()">{{ $t('global.nuevo') }}</ion-button>
        </template>
        <template v-if="estatus === 'CREAR' || estatus === 'EDITAR'">
          <ion-button color="success" @click="validarForm()">
            <i class="fas fa-save big-icon"></i>
            {{ $t('global.guardar') }}</ion-button>
          <ion-button color="secondary" @click="descartar()">
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
        <!-- CAMPOS DE LA DIRECCION -->
        <!-- NOMBRE UBICACION -->
        <ion-input :label="t('direcciones.nomUbicacion')" label-placement="stacked"
          v-model.trim="nomUbicacion" :clear-on-edit="false" fill="outline" mode="md"
          :disabled=esConsulta :maxlength="100"></ion-input>
        <!-- NOMBRE DE CONTACTO -->
        <ion-input :label="t('direcciones.nombreContacto')" label-placement="stacked"
          v-model.trim="nombre" :clear-on-edit="false" fill="outline" mode="md"
          :disabled=esConsulta :maxlength="100"></ion-input>
        <!-- TELÉFONO -->
        <ion-input :label="t('direcciones.telefono')" label-placement="stacked"
          v-model="telefono" :clear-on-edit="false" fill="outline" mode="md"
          type="tel" :disabled=esConsulta placeholder="999-999-999"></ion-input>
        <br>
        <!-- Dirección seleccionada -->
        <ion-textarea :label="t('direcciones.dirSelec')" labelPlacement="stacked"
          v-model="direccion" :clear-on-edit="false" fill="outline" mode="md"
          disabled :maxlength="300"></ion-textarea>
        <!-- NUMERO EXTERIOR -->
        <ion-input :label="t('direcciones.numeroExterior')" label-placement="stacked"
          v-model="numeroExterior" :clear-on-edit="false" fill="outline" mode="md"
          type="text" inputmode="numeric" :disabled=esConsulta :maxlength="6"
          @input="handNumExterior"></ion-input>
        <!-- NUMERO INTERIOR -->
        <ion-input :label="t('direcciones.numeroInterior')" label-placement="stacked"
          v-model="numeroInterior" :clear-on-edit="false" fill="outline" mode="md"
          type="text" inputmode="numeric" :disabled=esConsulta :maxlength="6"
          @input="handNumInterior"></ion-input>
        <!-- ENTRE CALLE 1 -->
        <ion-input :label="t('direcciones.entreCalle1')" label-placement="stacked"
          v-model.trim="entreCalle1" :clear-on-edit="false" fill="outline" mode="md"
          :disabled=esConsulta :maxlength="100"></ion-input>
        <!-- ENTRE CALLE 2 -->
        <ion-input :label="t('direcciones.entreCalle2')" label-placement="stacked"
          v-model.trim="entreCalle2" :clear-on-edit="false" fill="outline" mode="md"
          :disabled=esConsulta :maxlength="100"></ion-input>
        <br>
        <!-- NOTAS -->
        <ion-textarea :label="t('direcciones.indicaciones')" labelPlacement="stacked"
          v-model="indicaciones" :clear-on-edit="false" fill="outline" mode="md"
          :disabled=esConsulta :maxlength="300"
          :placeholder="$t('direcciones.notaIndicaciones')"></ion-textarea>
      </div>
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

  <!-- MODAL CERRAR SESIÓN ------------------------------------------- -->
  <ion-modal ref="modal" :is-open="esModalEliminar">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('direcciones.eliminarDir') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>{{ $t('direcciones.preguntaEliminarDir') }}</p>
      <ion-toggle v-model="toggleButton" label-placement="end" >
        {{ $t('global.siQuieroEliminar') }}
      </ion-toggle>
      <ion-grid class="ion-margin-top">
        <ion-row class="ion-justify-content-end">
          <ion-col size="auto">
            <ion-button color="danger" @click="cerrarModalEliminar">
              {{ $t('global.no') }}
            </ion-button>
          </ion-col>
          <ion-col size="auto">
            <ion-button @click="eliminarDir" color="primary" :disabled='!toggleButton'>
              {{ $t('global.si') }}
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>

</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, 
    IonCol, IonButton, IonMenuButton, IonButtons, IonImg, IonAvatar, IonInput,
    IonIcon, IonTextarea, IonFabButton, IonFab, IonSpinner, IonToggle, IonModal
  } from '@ionic/vue'
   import { chevronBackOutline, chevronUpOutline  } from 'ionicons/icons'
  import { getCurrentInstance } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { useRouter } from 'vue-router'

  const { t /*, locale*/ } = useI18n()

  // VARIABLES ------------------------------
  // ***********************
  const contentElement = ref<any>(null)
  const app = getCurrentInstance();
  const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  const $api = app?.appContext.config.globalProperties.$api as string
  const router = useRouter()
  // ***************************************************************************
  // ***************************************************************************
  const mostrarOverlaySpinner = ref(false)
  const txtOverlaySpinner = ref('')
  const idCliente = ref()
  const idDireccion = ref()
  const avatarSrc = ref('/img/avatar.png')
  const estatus = ref('')
  const nomUbicacion = ref('')
  const nombre = ref('')
  const telefono = ref('')
  const direccion = ref('')
  const codigoPostal = ref('')
  const colonia = ref('')
  const estado = ref('')
  const pais = ref('')
  const ciudad = ref('')
  const calle = ref('')
  const numeroInterior = ref('')
  const numeroExterior = ref()
  const lat = ref('')
  const lon = ref('')
  const entreCalle1 = ref('')
  const entreCalle2 = ref('')
  const esConsulta = ref(false)
  const indicaciones = ref('')
  const dir = ref()
  const id = ref()
  const marcadorMapa = ref()
  const centroMapa = ref()
  const esModalEliminar = ref(false)
  const toggleButton = ref(false)
  // -----------------------------------------
  // FUNCIONES LOCALES
  // Lógica de mounted()
  onMounted(() => {
    avatarSrc.value = localStorage.getItem('urlImg')
    idCliente.value = parseInt(localStorage.getItem('idCliente'))
    idDireccion.value = parseInt(localStorage.getItem('idDireccion'))
    if (idDireccion.value > 0) {
      estatus.value = 'EDITAR'
      esConsulta.value = true
      cargarDireccion()
    } else {
      estatus.value = 'CREAR'
      esConsulta.value = false
    }
  })
  const verMiPerfil = () => {
    router.push('/client/MiPerfil')
  }
  const cargarDireccion = () => {
    try {
      axios.get($api + '/ClienteDirecciones/' + idDireccion.value)
        .then(function (response) {
          dir.value = response.data
          console.log('dir ---')
          console.log(dir)
          id.value = dir.value.id
          nomUbicacion.value = dir.value.nombreUbicacion
          nombre.value = dir.value.nombreContacto
          telefono.value = dir.value.telefono
          lat.value = dir.value.latitud
          lon.value = dir.value.longitud
          marcadorMapa.value = {
            lat: lat.value,
            lng: lon.value
          }
          centroMapa.value = marcadorMapa
          pais.value = dir.value.pais
          estado.value = dir.value.estado
          ciudad.value = dir.value.ciudad
          colonia.value = dir.value.colonia
          codigoPostal.value = dir.value.codigoPostal.toString()
          calle.value = dir.value.calle
          numeroExterior.value = dir.value.numeroExterior
          numeroInterior.value = dir.value.numeroInterior
          entreCalle1.value = dir.value.entreCalle1
          entreCalle2.value = dir.value.entreCalle2
          estatus.value = 'CONSULTA'
          esConsulta.value = true
          indicaciones.value = dir.value.indicaciones
          if (calle.value !== '') {
            direccion.value = calle.value
          } else {
            direccion.value = ''
          }
          if (numeroExterior.value !== '') {
            direccion.value = direccion.value + ' Num. Ext.' + numeroExterior.value
          }
          if (numeroInterior.value !== '') {
            direccion.value = direccion.value + ', Num. Int.' + numeroInterior.value
          }
          if (colonia.value !== '') {
            direccion.value = direccion.value + ', ' + colonia.value
          }
          if (codigoPostal.value !== '') {
            direccion.value = direccion.value + ', ' + codigoPostal.value
          }
          if (ciudad.value !== '') {
            direccion.value = direccion.value + ' ' + ciudad.value
          }
          if (estado.value !== '') {
            direccion.value = direccion.value + ', ' + estado.value
          }
          if (pais.value !== '') {
            direccion.value = direccion.value + ', ' + pais.value
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
    }
  }
  const nuevo = () => {
    nomUbicacion.value = ''
    nombre.value = ''
    telefono.value = ''
    direccion.value = ''
    codigoPostal.value = ''
    colonia.value = ''
    pais.value = ''
    estado.value = ''
    ciudad.value = ''
    calle.value = ''
    numeroInterior.value = ''
    numeroExterior.value = ''
    lat.value = ''
    lon.value = ''
    entreCalle1.value = ''
    entreCalle2.value = ''
    esConsulta.value = false
    indicaciones.value = ''
    estatus.value = 'CREAR'
    direccion.value = ''
  }
  const validarForm = async ()  => {
    let error = 0
    // NOMBRE UBICACION
    if (nomUbicacion.value === '') {
      await $globalFunc.mostrarToast(
        t('direcciones.ingresarNomUbicacion'),
        t('global.validacion'),
        5000, 'warning')
      return
    }
    // NOMBRE DE CONTACTO
    if (nombre.value === '') {
      await $globalFunc.mostrarToast(
        t('direcciones.ingresarNombre'),
        t('global.validacion'),
        5000, 'warning')
      return
    }
    // TELÉFONO
    // Validar Numero de Telefono
    var tel = telefono === null ? '' : telefono
    tel = telefono.value.replace(/\D/g, '')
    if (tel.trim() === '') {
      await $globalFunc.mostrarToast(
        t('direcciones.ingresarTelefono'),
        t('global.validacion'),
        5000, 'warning')
      return
    }
    if (tel.length < 10) {
      await $globalFunc.mostrarToast(
        t('direcciones.ingresa10DigitosTel'),
        t('global.validacion'),
        5000, 'warning')
      return
    }
    // BUSQUEDA EN GOOGLE POR DIRECCIóN ESCRITA
    /*
    if (marcadorMapa.value === null) {
      await $globalFunc.mostrarToast(
        t('direcciones.selecUbicacionMapa'),
        t('global.validacion'),
        5000, 'warning')
      return
    }
    */
    // SIN ERRORES ========================
    if (error === 0) {
      jsonDireccion()
    }
  }
  const jsonDireccion = () => {
    var tel = telefono.value.replace(/\D/g, '')
    // Se llena la Dirección Completa
    if (calle.value !== '') {
      direccion.value = calle.value
    } else {
      direccion.value = ''
    }
    if (numeroExterior.value !== '') {
      direccion.value = direccion.value + ' Num. Ext.' + numeroExterior.value
    }
    if (numeroInterior.value !== '') {
      direccion.value = direccion.value + ', Num. Int.' + numeroInterior.value
    }
    if (colonia.value !== '') {
      direccion.value = direccion.value + ', ' + colonia.value
    }
    if (codigoPostal.value !== '') {
      direccion.value = direccion.value + ', ' + codigoPostal.value
    }
    if (ciudad.value !== '') {
      direccion.value = direccion.value + ' ' + ciudad.value
    }
    if (estado.value !== '') {
      direccion.value = direccion.value + ', ' + estado.value
    }
    if (pais.value !== '') {
      direccion.value = direccion.value + ', ' + pais.value
    }
    var data = {
      id: 0,
      nombreUbicacion: nomUbicacion.value,
      nombreContacto: nombre.value,
      direccion: direccion.value,
      telefono: tel,
      codigoPostal: codigoPostal.value,
      colonia: colonia.value,
      pais: pais.value,
      estado: estado.value,
      ciudad: ciudad.value,
      calle: calle.value,
      numeroInterior: numeroInterior.value,
      numeroExterior: numeroExterior.value,
      latitud: lat.value,
      longitud: lon.value,
      idCliente: 0,
      entreCalle1: entreCalle1.value,
      entreCalle2: entreCalle2.value,
      esActivo: 1,
      indicaciones: indicaciones.value
    }
    if (estatus.value === 'CREAR') {
      crearDireccion(data)
    }
    if (estatus.value === 'EDITAR') {
      actualizarDireccion(data)
    }
  }
  const crearDireccion = (data) => {
    console.log('crearDireccion(data)---')
    console.log(data)
    axios.post($api + '/ClienteDirecciones/nuevaClienteDirecciones?idCliente=' + encodeURIComponent(idCliente.value), data)
      .then(async function (response) {
        await $globalFunc.mostrarToast(
          t('global.registroExitoso'),
          t('direcciones.direcciones'),
          5000, 'success')
        // console.log('guardarServicio response.data---')
        // console.log(response.data)
        idDireccion.value = response.data
        estatus.value = 'CONSULTA'
        esConsulta.value = true
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  const actualizarDireccion = (data) => {
    /*
    data.esActivo = esActivo.value
    data.id = id
    // console.log('actualizarDireccion data---')
    // console.log(data)
    axios.put($api + '/ClienteDirecciones/PutClienteDirecciones?id=' + data.id + '&idCliente=' + idCliente, data)
      .then(function (response) {
        $bvToast.toast($t('global.edicionExitosa'), {
          title: `${$t('direcciones.direcciones')}`,
          autoHideDelay: 5000,
          appendToast: true,
          toastClass: `bs4-toast bg-${'success'}`
        })
        estatus = 'CONSULTA'
        esConsulta = true
      })
      .catch(function (error) {
        console.log(error)
      })
    */
  }
  const descartar = () => {
    if (estatus.value === 'CREAR') {
      regresar()
    }
    if (estatus.value === 'EDITAR') {
      esConsulta.value = true
      cargarDireccion()
      estatus.value = 'CONSULTA'
    }
  }
  const regresar = () => {
    router.push('/client/ListaDirecciones/')
  }
  const scrollToTop = () => {
    if (contentElement.value && $globalFunc) {
      $globalFunc.scrollToTop(contentElement.value)
    } else {
      console.error("No se pudo llamar a scrollToTop. contentElement o $globalFunc es nulo.")
    }
  }
  const editar = () => {
    esConsulta.value = false
    estatus.value = 'EDITAR'
  }
  const modalEliminarDir = () => {
    toggleButton.value = false
    esModalEliminar.value = true
  }
  const handNumExterior = () => {
    const valorLimpio = $globalFunc.limitarLongitudNumerica(
      numeroExterior.value, 6)
    numeroExterior.value = valorLimpio;
  }
  const handNumInterior = () => {
    const valorLimpio = $globalFunc.limitarLongitudNumerica(
      numeroInterior.value, 6)
    numeroInterior.value = valorLimpio;
  }
  const cerrarModalEliminar = () => {
    esModalEliminar.value = false
  }
  const eliminarDir = () => {
    axios.delete($api + '/ClienteDirecciones/borrarClienteDirecciones?id=' + idDireccion.value)
      .then(async function (response) {
        var resp = response.data
        if (resp.estatus) {
          await $globalFunc.mostrarToast(
            t('direcciones.dirEliminada'),
            t('direcciones.direcciones'),
            5000, 'success')
          estatus.value = 'INICIO'
          esConsulta.value = true
          esModalEliminar.value = false
          regresar()
        } else {
          await $globalFunc.mostrarToast(
            t('direcciones.errorEliminada'),
            t('direcciones.direcciones'),
            5000, 'warning')
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
</script>
