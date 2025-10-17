<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-menu-button></ion-menu-button>
          <ion-title>{{ t('menuClientes.miPerfil') }}</ion-title>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- AVATAR Y DATOS CLIENTE -->
      <ion-grid>
        <ion-row>
          <ion-col style="max-width: 135px;">
            <div class="centrar">
              <div @click="solicitarImg">
                <ion-avatar>
                  <ion-img :src="avatarSrc" size="100px" />
                </ion-avatar>
              </div>
              <input type="file"
                ref="fileInput"
                @change="cambioImgPerfil"
                accept="image/*"
                style="display: none;" />
              <ion-badge variant="primary"
                style="position: absolute; right: 27px;
                  border-radius: 21px; top: 45px;
                  width: 28px; height: 28px; font-size: 90%;">
                <i class="fas fa-pencil-alt big-icon"
                  style="top: 8px; position: absolute; right: 6px;" />
              </ion-badge>
            </div>
          </ion-col>
          <ion-col>
            <div class="centrar">
              {{ usuario }}
              <br>
              {{ nomCliente }}
              <br>
              <i class="far fa-envelope big-icon"></i>
              {{ correo }}
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
      <hr>
      <!-- BOTONES CATALOGO -->
      <template v-if="estatus === 'EDITAR'">
        <ion-button color="success" @click="validarPreferencias()">
          <i class="fas fa-save big-icon"></i> &nbsp;
          {{ t('global.guardar') }} </ion-button>
        <ion-button color="secondary" @click="descartar()">
          <i class="fas fa-ban big-icon"></i> &nbsp;
          {{ t('global.descartar') }} </ion-button>
      </template>
      <template v-if="estatus === 'CONSULTA'">
        <ion-button color="primary" @click="editar()">
          <i class="fas fa-edit big-icon"></i> &nbsp;
          {{ t('global.editar') }} </ion-button>
      </template>
      <ion-list>
        <!-- FORMATO FECHA -->
        <ion-item>
          <ion-select
            :label="t('miPerfil.formatoFecha')"
            label-placement="stacked"
            v-model="formatoFechaSelec"
            :disabled=esConsulta
            fill="outline" >
            <ion-select-option v-for="formato in lstFormatoFecha"
              :key="formato.nombre" :value="formato">
              {{ formato.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <!-- FORMATO HORA -->
        <ion-item>
          <ion-select
            :label="t('miPerfil.formatoHora')"
            label-placement="stacked"
            v-model="formatoHoraSelec"
            :disabled=esConsulta
            fill="outline" >
            <ion-select-option v-for="formato in lstFormatoHora"
              :key="formato.nombre" :value="formato">
              {{ formato.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <!-- ZONA HORARIA -->
        <ion-item>
          <ion-select
            :label="t('miPerfil.zonaHoraria')"
            label-placement="stacked"
            v-model="zonaHorariaSelec"
            :disabled=esConsulta
            fill="outline" >
            <ion-select-option v-for="zona in lstZonaHoraria"
              :key="zona.zonaHoraria" :value="zona">
              {{ zona.zonaHoraria }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <!-- MÉTODOS DE PAGO -->
        <ion-item>
          <ion-select
            :label="t('miPerfil.metodosPago')"
            label-placement="stacked"
            v-model="metodosPagoSelec"
            :disabled=esConsulta
            fill="outline" >
            <ion-select-option v-for="pago in lstMetodosPago"
              :key="pago.nombre" :value="pago">
              {{ pago.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <!-- DIVISAS ACEPTADAS -->
        <ion-item>
          <ion-select
            :label="t('miPerfil.divisasAceptadas')"
            label-placement="stacked"
            v-model="divisaSelec"
            :disabled=esConsulta
            fill="outline" >
            <ion-select-option v-for="divisas in lstDivisas"
              :key="divisas.nombreLargo" :value="divisas">
              {{ divisas.nombreLargo }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <!-- DISTANCIA EN -->
        <ion-item>
            <ion-select
              :label="t('miPerfil.distanciaEn')"
              label-placement="stacked"
              v-model="distanciaEnSelec"
              :disabled=esConsulta
              @ionChange="cambioDistancia()"
              fill="outline" >
              <ion-select-option v-for="distancia in lstDistanciaEn"
                :key="distancia.nombre" :value="distancia">
                {{ distancia.nombre }}
              </ion-select-option>
            </ion-select>
        </ion-item>
      </ion-list>
      <!--
      <ion-row>
        <! -- DISTANCIA -- >
        <ion-col>
          <ion-list>
            <div v-if="distanciaEnSelec.medida === 'km'">
              <ion-label :disabled="esConsulta">
                {{ t('global.kilometros') }} = {{ cantidadDistancia }}
              </ion-label>
              <ion-item>
                <ion-range
                  :min="distanciaKmMin"
                  :max="distanciaKmMax"
                  :step="1"
                  :value="cantidadDistancia"
                  @ionChange="e => cantidadDistancia = e.detail.value"
                  :disabled="esConsulta"
                  pin="true" >
                  <ion-label slot="start">{{ distanciaKmMin }}</ion-label>
                  <ion-label slot="end">{{ distanciaKmMax }}</ion-label>
                </ion-range>
              </ion-item>
            </div>
            <div v-if="distanciaEnSelec.medida === 'mi'">
              <ion-label :disabled="esConsulta">
                {{ t('global.millas') }} = {{ cantidadDistancia }}
              </ion-label>
              <ion-item>
                <ion-range
                  :min="distanciaMiMin"
                  :max="distanciaMiMax"
                  :step="1"
                  :value="cantidadDistancia"
                  @ionChange="e => cantidadDistancia = e.detail.value"
                  :disabled="esConsulta"
                  pin="true" >
                  <ion-label slot="start">{{ distanciaMiMin }}</ion-label>
                  <ion-label slot="end">{{ distanciaMiMax }}</ion-label>
                </ion-range>
              </ion-item>
            </div>
          </ion-list>
        </ion-col>
      </ion-row>
      -->
      <hr>
      <ion-button variant="danger" @click="BorrarCuenta()"
        :disabled="!esConsulta" style="width: 100%;">
        <i class="fas fa-edit big-icon"></i> &nbsp;
        {{ t('miPerfil.eliminarCuenta') }} </ion-button>
    </ion-content>
  </ion-page>

  <!-- MODAL CONTINUAR ELIMINAR CUENTA --------------------------------------- -->
  <ion-modal ref="modalContinuar" :is-open="esModalContinuarEliminar">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('miPerfil.eliminarCuenta') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>{{ t('miPerfil.preguntaEliminarCuenta') }}</p>
      <br>
      <div class="centrar">
        <p>
          <ion-avatar>
            <ion-img :src="avatarSrc" size="100px" />
          </ion-avatar>
          {{ usuario }}
        </p>
      </div>
      <!-- TEXTO SOLICITADO PARA ELIMINACIÓN -->
      <ion-text>
        {{ t('miPerfil.ingresatxt') }} [ {{ t('miPerfil.txtEliminarCuentaANDI') }} ] {{ t('miPerfil.paraProcederElim') }}
      </ion-text>
      <!-- Usuario ANDI -->
      <ion-item>
        <ion-input
          :label="t('miPerfil.escribeFrase')"
          v-model.trim="txtEliminar"
          @keyup.enter="valContinuarEliminar()"
          label-placement="stacked"
          :clear-on-edit="true"
          :maxlength="50"
          :placeholder="t('miPerfil.txtEliminarCuentaANDI')"
          @input="txtEliminar = txtEliminar.toUpperCase()"
          fill="outline" >
        </ion-input>
      </ion-item>
      <ion-item>
        <ion-toggle v-model="toggleButton" label-placement="end" >
        {{ t('miPerfil.siQuieroEliminarCuenta') }} </ion-toggle>
      </ion-item>
      <br>
      <hr>
      <ion-button color="secondary" @click="cerrarModalContinuarEliminar()">
        {{ t('global.no') }}</ion-button>
      <ion-button color="danger"
        :disabled='!toggleButton'
        @click="valContinuarEliminar()">{{ t('miPerfil.continuarEliminacion') }}</ion-button>
    </ion-content>
  </ion-modal>

  <!-- MODAL ELIMINAR CUENTA ------------------------------------------------- -->
  <ion-modal ref="modalEliminar" :is-open="esModalEliminar">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('miPerfil.eliminarCuenta') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="centrar">
        <i class="far fa-envelope big-icon"></i>
        {{ correo }}
        <br>
        <!-- CODIGO PARA VALIDAR CORREO -->
        <!-- <ctrlCodigoSMS @codigo-completo="recibirCodigoCorreo" /> -->
        <ion-input-otp :length="6" shape="round" fill="outline"
          v-model="codigoCorreo">
          {{ t('miPerfil.ingresarCodigoCorreo') }} </ion-input-otp>
      </div>
      <br>
      <hr>
      <ion-button color="secondary" @click="cerrarModalEliminar()">
        {{ $t('global.no') }}</ion-button>
      <ion-button color="danger" @click="valEliminarCuenta()">
        {{ $t('miPerfil.eliminarMiCuenta') }}</ion-button>
    </ion-content>
  </ion-modal>

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
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, 
    IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonSpinner, 
    IonModal, IonToggle, IonButtons, IonMenuButton, IonList, IonText, IonAvatar,
    IonImg, IonInputOtp, IonBackdrop, IonBadge
  } from '@ionic/vue'
  import { getCurrentInstance } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { useRouter } from 'vue-router'

  const { t/*, locale*/ } = useI18n()

  // VARIABLES ------------------------------
  // ***********************
  const app = getCurrentInstance();
  const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  const $api = app?.appContext.config.globalProperties.$api as string
  const router = useRouter()
  // // ***********************
  const avatarSrc = ref('/img/avatar.png')
  const secPerfil = ref('')
  const estatus = ref('')
  const esConsulta = ref(true)
  const usuario = ref('')
  const idCliente = ref('')
  const nomCliente = ref('')
  const correo = ref('')
  const idiomaSelec = ref({})
  const lstTiempoAgendar = ref([
    { id: 0, nombre: 'Minutos' },
    { id: 1, nombre: 'Horas' },
    { id: 2, nombre: 'Días' }
  ])
  const zonaHorariaSelec = ref({ id: 0, zonaHoraria: '' })
  const lstZonaHoraria = ref([])
  const metodosPagoSelec = ref({ id: 0, nombre: '', esActivo: true })
  const lstMetodosPago = ref([])
  const divisaSelec = ref({ id: 0, precioDolar: 0, pais: '', nombreCorto: '',
                            nombreLargo: '', simbolo: '', codigoISO: '' })
  const lstDivisas = ref([])
  const formatoFechaSelec = ref({ id: 0, nombre: '', formato: '' })
  const lstFormatoFecha = ref([
    { id: 0, nombre: '24/Dic/2024', formato: 'dd/MMM/yyyy' },
    { id: 1, nombre: 'Dic/24/2024', formato: 'MMM/dd/yyyy' }
  ])
  const formatoHoraSelec = ref({ id: 0, nombre: '', formato: ''})
  const lstFormatoHora = ref([
    { id: 0, nombre: '20:00', formato: 'HH:mm' },
    { id: 1, nombre: '08:00 PM', formato: 'hh:mm A' }
  ])
  const distanciaEnSelec = ref({ nombre: 'Kilometros', medida: 'km' })
  const lstDistanciaEn = ref([
    { nombre: 'Kilometros', medida: 'km' },
    { nombre: 'Millas', medida: 'mi' }
  ])
  const toggleButton = ref(false)
  const cantidadDistancia = ref(1)
  /*
  const distanciaKmMin = ref(1)
  const distanciaKmMax = ref(50)
  const distanciaMiMin = ref(1)
  const distanciaMiMax = ref(30)
  */
  const txtEliminar = ref('')
  const esModalContinuarEliminar = ref(false)
  const esModalEliminar = ref(false)
  const fileInput = ref(null)
  const mostrarOverlaySpinner = ref(false)
  const txtOverlaySpinner = ref('')
  const codigoCorreo = ref('')


  // -----------------------------------------
  // FUNCIONES LOCALES
  // Lógica de mounted()
  onMounted(() => {
    localStorage.setItem('interfaz', 'MiPerfil')
    secPerfil.value = 'MENU'
    estatus.value = 'CONSULTA'
    esConsulta.value = true
    usuario.value = localStorage.getItem('usuario')
    idCliente.value = localStorage.getItem('idCliente')
    nomCliente.value = localStorage.getItem('nombre')
    correo.value = localStorage.getItem('correoElectronico')
    idiomaSelec.value = localStorage.getItem('idiomaSelec')
    traduccion()
    listaZonaHoraria()
    avatarSrc.value = localStorage.getItem('urlImg')
    esModalContinuarEliminar.value = false
    esModalEliminar.value = false
  })
  const traduccion = () => {
    for (const x in lstTiempoAgendar.value) {
      if (lstTiempoAgendar.value[x].id === 0) { // id: 0, nombre: 'Minutos'
        lstTiempoAgendar.value[x].nombre = t('global.minutos')
      }
      if (lstTiempoAgendar.value[x].id === 1) { // id: 1, nombre: 'Horas'
        lstTiempoAgendar.value[x].nombre = t('global.horas')
      }
      if (lstTiempoAgendar.value[x].id === 2) { // id: 2, nombre: 'Días'
        lstTiempoAgendar.value[x].nombre = t('global.dias')
      }
    }
  }
  const listaZonaHoraria = () => {
    axios.get($api + '/ZonasHorarias')
      .then(function (response) {
        lstZonaHoraria.value = response.data
        // console.log('lstZonaHoraria---')
        // console.log(lstZonaHoraria)
        listaMetodosPago()
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  const listaMetodosPago = () => {
    axios.get($api + '/MetodosPago')
      .then(function (response) {
        lstMetodosPago.value = response.data
        // console.log('lstMetodosPago---')
        // console.log(lstMetodosPago)
        traducirMetodosPago()
        listaDivisas()
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  const traducirMetodosPago = () => {
    for (const x in lstMetodosPago.value) {
      if (lstMetodosPago.value[x].id === 1) { // id: 1 'Efectivo'
        lstMetodosPago.value[x].nombre = t('global.efectivo')
      }
      if (lstMetodosPago.value[x].id === 2) { // id: 2 'Tarjeta de Crédito'
        lstMetodosPago.value[x].nombre = t('global.tarjetaCredito')
      }
      if (lstMetodosPago.value[x].id === 3) { // id: 3 'Tarjeta de Débito'
        lstMetodosPago.value[x].nombre = t('global.tarjetaDebito')
      }
      if (lstMetodosPago.value[x].id === 4) { // id: 4 'Transferencia Bancaria'
        lstMetodosPago.value[x].nombre = t('global.transferencia')
      }
      if (lstMetodosPago.value[x].id === 5) { // id: 5 'PayPal'
        lstMetodosPago.value[x].nombre = t('global.paypal')
      }
      if (lstMetodosPago.value[x].id === 6) { // id: 6 'Mercado Pago'
        lstMetodosPago.value[x].nombre = t('global.mercadoPago')
      }
      if (lstMetodosPago.value[x].id === 7) { // id: 7 'OXXO'
        lstMetodosPago.value[x].nombre = t('global.oxxo')
      }
      if (lstMetodosPago.value[x].id === 8) { // id: 8 'Depósito bancario'
        lstMetodosPago.value[x].nombre = t('global.deposito')
      }
    }
    metodosPagoSelec.value = lstMetodosPago.value.find(q => q.id === parseInt(localStorage.getItem('idMetodoPago')))
  }
  const listaDivisas = () => {
    axios.get($api + '/Moneda/listaMonedasActivas')
      .then(function (response) {
        lstDivisas.value = response.data
        // console.log('lstDivisas---')
        // console.log(lstDivisas)
        cargarConfiguracion()
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  const cargarConfiguracion = () => {
    formatoFechaSelec.value = lstFormatoFecha.value.find(q => q.formato === localStorage.getItem('formatoFecha'))
    formatoHoraSelec.value = lstFormatoHora.value.find(q => q.formato === localStorage.getItem('formatoHora'))
    zonaHorariaSelec.value = lstZonaHoraria.value.find(q => q.id === parseInt(localStorage.getItem('idZonaHoraria')))
    metodosPagoSelec.value = lstMetodosPago.value.find(q => q.id === parseInt(localStorage.getItem('idMetodoPago')))
    distanciaEnSelec.value = lstDistanciaEn.value.find(q => q.medida === localStorage.getItem('distanciaEn'))
    cantidadDistancia.value = parseInt(localStorage.getItem('cantidadDistancia'))
    const temp = lstDivisas.value.find(q => q.id === parseInt(localStorage.getItem('idMoneda')))
    divisaSelec.value = temp
    for (const x in lstDivisas.value) {
      if (lstDivisas.value[x].id === 1) { // id: 1, nombre: "MXN - Peso Mexicano"
        lstDivisas.value[x].nombreLargo = t('global.pesoMexicano')
      }
      if (lstDivisas.value[x].id === 2) { // id: 2, nombre: "USD - Dólar Estadounidense"
        lstDivisas.value[x].nombreLargo = t('global.dolarUsa')
      }
      if (lstDivisas.value[x].id === 14) { // id: 14, nombre: "GTQ - Quetzal guatemalteco"
        lstDivisas.value[x].nombreLargo = t('global.quetzalGuatemala')
      }
    }
  }
  const editar = () => {
    esConsulta.value = false
    estatus.value = 'EDITAR'
  }
  const descartar = () => {
    esConsulta.value = true
    cargarConfiguracion()
    estatus.value = 'CONSULTA'
  }
  const cambioDistancia = () => {
    if (distanciaEnSelec.value.medida === 'km') {
      if (cantidadDistancia.value > 30) {
        cantidadDistancia.value = 30
      }
    }
    if (distanciaEnSelec.value.medida === 'mi') {
      cantidadDistancia.value = 30
    }
  }
  /*
  const modalContinuarEliminar = () => {
    toggleButton.value = false
    txtEliminar.value = ''
    esModalContinuarEliminar.value = true
  }
  */
  const cerrarModalContinuarEliminar = () => {
    esModalContinuarEliminar.value = false
  }
  const cerrarModalEliminar = () => {
    esModalEliminar.value = false
  }
  /*
  const txtEliminarMayusculas = (event) => {
    txtEliminar.value = event.toUpperCase()
  }
  */
  const validarPreferencias = async () => {
    // MÉTODOS DE PAGO
    if (metodosPagoSelec.value.id === 0) {
      await $globalFunc.mostrarToast(
        t('miPerfil.valMetodosPago'),
        t('global.validacion'),
        5000,
        'warning')
      return
    }
    // DIVISAS ACEPTADAS
    if (divisaSelec.value.id === 0) {
      await $globalFunc.mostrarToast(
        t('miPerfil.valdivisasAceptadas'),
        t('global.validacion'),
        5000,
        'warning')
      return
    }
    // SIN ERRORES ========================
    jsonPreferencias()
  }
  const jsonPreferencias = () => {
    const data = {
      idCliente: localStorage.getItem('idCliente'),
      FormatoFecha: formatoFechaSelec.value.formato,
      FormatoHora: formatoHoraSelec.value.formato,
      idZonaHoraria: zonaHorariaSelec.value.id,
      distanciaEn: distanciaEnSelec.value.medida,
      cantidadDistancia: cantidadDistancia.value,
      idMetodoPago: metodosPagoSelec.value.id,
      idMoneda: divisaSelec.value.id,
      colorTema: localStorage.getItem('colorTema'),
      idioma: localStorage.getItem('idiomaSelec')
    }
    actualizarPreferencias(data)
  }
  const actualizarPreferencias = (data) => {
    axios.post($api + '/Cliente/guardarConfigCliente/', data)
      .then(function (response) {
        console.log('Cliente/guardarConfigCliente ---')
        console.log(response.data)
        actualizacionPerfilExitosa()
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  const actualizacionPerfilExitosa = async () => {
    await $globalFunc.mostrarToast(
      t('global.edicionExitosa'),
      t('miPerfil.miPerfil'),
      5000,
      'success')
    localStorage.setItem('formatoFecha', formatoFechaSelec.value.formato)
    localStorage.setItem('formatoHora', formatoHoraSelec.value.formato)
    localStorage.setItem('idZonaHoraria', zonaHorariaSelec.value.id.toString())
    localStorage.setItem('idMetodoPago', metodosPagoSelec.value.id.toString())
    localStorage.setItem('idMoneda', divisaSelec.value.id.toString())
    localStorage.setItem('distanciaEn', distanciaEnSelec.value.medida)
    localStorage.setItem('cantidadDistancia', cantidadDistancia.value.toString())
    estatus.value = 'CONSULTA'
    esConsulta.value = true
  }
  const solicitarImg = () => {
    console.log('solicitarImg() ---')
    fileInput.value.click()
  }
  const cambioImgPerfil = (event) => {
    const file = event.target.files[0]
    if (file) {
      // 1. Previsualización: Crea una URL temporal para el ion-avatar.
      avatarSrc.value = URL.createObjectURL(file)
      // 2. Preparación para subir: Crea un objeto FormData.
      const formData = new FormData()
      // El nombre 'imagen' es un ejemplo. Debe coincidir con cómo espera el archivo tu backend (API).
      formData.append('file', file)
      console.log('--- formData')
      console.log(formData)
      console.log('--- localStorage idCliente')
      console.log(localStorage.getItem('idCliente'))
      // La URL ya tiene el 'idCliente' en el query string, lo cual está bien.
      const uploadUrl = $api + '/Cliente/SubirImagenPerfil?idCliente=' + encodeURIComponent(idCliente.value)
      try {
        axios.post(uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          const resp = response.data
          console.log('--- resp SubirImagenPerfil')
          console.log(resp)
          localStorage.setItem('urlImg', resp.url)
          avatarSrc.value = localStorage.getItem('urlImg')
          location.reload()
        })
          .catch(function (error) {
            console.log(error)
          })
      } catch (error) {
        console.log(error)
      }
      console.log('Archivo seleccionado:', file.name)
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
    console.log(encodeURIComponent(correo.value))
    axios.put($api + '/Cliente/clienteCodigoCorreo?correo=' + encodeURIComponent(correo.value))
      .then(async function (response) {
        const resp = response.data
        console.log('resp ---')
        console.log(resp)
        esModalContinuarEliminar.value = false
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
          modalEliminarCuenta()
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
  const modalEliminarCuenta = () => {
    esModalEliminar.value = true
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
    await $globalFunc.mostrarToast(
      'AQUI SE ELIMINARA LA CUENTA',
      t('global.validacion'),
      5000,
      'warning')
    console.log('encodeURIComponent(correo.value) ---')
    console.log(encodeURIComponent(correo.value))
    console.log('codigo ---')
    console.log(codigo)
    mostrarOverlaySpinner.value = false
    // SIN ERRORES ========================
    /*
    axios.post($api + '/Cliente/borrarCuentaANDI?correo=' + encodeURIComponent(correo.value) + '&codigo=' + codigo)
      .then(async function (response) {
        let cliente = response.data
        if (cliente.correoElectronico === null) {
          mostrarOverlaySpinner.value = false
          await $globalFunc.mostrarToast(
            t('miPerfil.codigoCorreoIncorrecto'),
            t('registroCliente.correo'),
            5000,
            'warning')
        } else {
          let num = 1
          localStorage.setItem('cuentaANDIEliminada', num.toString())
          localStorage.setItem('busqueda', null)
          router.replace('/app/Login')
          location.reload()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    */
  }
  const BorrarCuenta = () => {
    router.push('/app/BorrarCuenta')
  }
</script>
