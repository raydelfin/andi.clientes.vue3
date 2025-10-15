<template>
  <ion-page>
    <AppHeader :title="t('menuClientes.miPerfil')" />
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col style="max-width: 135px;">
            <center>
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
            </center>
          </ion-col>
          <ion-col>
            <center>
              {{ usuario }}
              <br>
              {{ nomCliente }}
              <br>
              <i class="far fa-envelope big-icon"></i>
              {{ correo }}
            </center>
          </ion-col>
        </ion-row>
      </ion-grid>
      <hr>
      <!-- BOTONES CATALOGO -->
      {{ $t('global.editar') }}
      <template v-if="estatus === 'EDITAR'">
        <ion-button color="success" @click="validarPreferencias()">
          <i class="fas fa-save big-icon"></i> &nbsp;
          {{ $t('global.guardar') }} </ion-button>
        <ion-button color="secondary" @click="descartar()">
          <i class="fas fa-ban big-icon"></i> &nbsp;
          {{ $t('global.descartar') }} </ion-button>
      </template>
      <template v-if="estatus === 'CONSULTA'">
        <ion-button color="primary" @click="editar()">
          <i class="fas fa-edit big-icon"></i> &nbsp;
          {{ $t('global.editar') }} </ion-button>
      </template>
      <ion-grid>
        <ion-row cols="1" cols-sm="2" cols-md="2" cols-lg="2">
          <!-- FORMATO FECHA -->
          <ion-col>
            <ion-list>
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
            </ion-list>
          </ion-col>
          <!-- FORMATO HORA -->
          <ion-col>
            <ion-list>
              <ion-item>
                <ion-select
                  :label="t('miPerfil.formatoHora')"
                  label-placement="stacked"
                  v-model="formatoHoraSelec"
                  @ionChange="cambioTipoLogin()"
                  :disabled=esConsulta
                  fill="outline" >
                  <ion-select-option v-for="formato in lstFormatoHora"
                    :key="formato.nombre" :value="formato">
                    {{ formato.nombre }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>
        <ion-row cols="1" cols-sm="2" cols-md="2" cols-lg="2">
          <!-- ZONA HORARIA -->
          <ion-col>
            <ion-list>
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
            </ion-list>
          </ion-col>
          <!-- MÉTODOS DE PAGO -->
          <ion-col>
            <ion-list>
              <ion-item>
                <ion-select
                  :label="t('miPerfil.metodosPago')"
                  label-placement="stacked"
                  v-model="metodosPagoSelec"
                  @ionChange="cambioTipoLogin()"
                  :disabled=esConsulta
                  fill="outline" >
                  <ion-select-option v-for="pago in lstMetodosPago"
                    :key="pago.nombre" :value="pago">
                    {{ pago.nombre }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>        
        <ion-row cols="1" cols-sm="2" cols-md="2" cols-lg="2">
          <!-- DIVISAS ACEPTADAS -->
          <ion-col>
            <ion-list>
              <ion-item>
                <ion-select
                  :label="t('miPerfil.divisasAceptadas')"
                  label-placement="stacked"
                  v-model="divisaSelec"
                  @ionChange="cambioTipoLogin()"
                  :disabled=esConsulta
                  fill="outline" >
                  <ion-select-option v-for="divisas in lstDivisas"
                    :key="divisas.nombreLargo" :value="divisas">
                    {{ divisas.nombreLargo }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
          </ion-col>
          <!-- DISTANCIA EN -->
          <ion-col>
            <ion-list>
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
          </ion-col>
        </ion-row>
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
      </ion-grid>
      <hr>
      <ion-button variant="danger" @click="modalContinuarEliminar()" style="width: 100%;">
        <i class="fas fa-edit big-icon"></i> &nbsp;
        {{ $t('miPerfil.eliminarCuenta') }} </ion-button>
      <br><br>
    </ion-content>
  </ion-page>

  <!-- MODAL CONTINUAR ELIMINAR CUENTA -->
  <ion-modal ref="modal" :is-open="esModalEliminar">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('miPerfil.eliminarCuenta') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>{{ $t('miPerfil.preguntaEliminarCuenta') }}</p>
      <br>
      <center>
        <p>
          <ion-avatar>
            <ion-img :src="avatarSrc" size="100px" />
          </ion-avatar>
          {{ usuario }}
        </p>
      </center>
      <!-- TEXTO SOLICITADO PARA ELIMINACIÓN -->
      <ion-grid>
        <ion-row>
          <ion-col>
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
                maxlength="50"
                :placeholder="t('txtEliminarCuentaANDI')"
                fill="outline" >
              </ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-toggle
        v-model="toggleButton"
        label-placement="end" >
        {{ $t('miPerfil.siQuieroEliminarCuenta') }}
      </ion-toggle>
      <br>
      <hr>
      <ion-button color="secondary" @click="cerrarModalEliminar">
        {{ $t('global.no') }}</ion-button>
      <ion-button color="danger"
        :disabled='!toggleButton'
        @click="valContinuarEliminar()">{{ $t('miPerfil.continuarEliminacion') }}</ion-button>
    </ion-content>
  </ion-modal>

</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, 
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonSpinner, 
    IonModal, IonToggle, IonFab, IonFabButton, IonIcon, IonButtons, IonCheckbox, 
    IonMenu, IonMenuButton, IonSplitPane, IonRange, IonList, IonText
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
  const zonaHorariaSelec = ref({})
  const lstZonaHoraria = ref([])
  const metodosPagoSelec = ref([])
  const lstMetodosPago = ref([])
  const divisaSelec = ref([])
  const lstDivisas = ref([])
  const formatoFechaSelec = ref({})
  const lstFormatoFecha = ref([
    { id: 0, nombre: '24/Dic/2024', formato: 'dd/MMM/yyyy' },
    { id: 1, nombre: 'Dic/24/2024', formato: 'MMM/dd/yyyy' }
  ])
  const formatoHoraSelec = ref({})
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
  const distanciaKmMin = ref(1)
  const distanciaKmMax = ref(50)
  const distanciaMiMin = ref(1)
  const distanciaMiMax = ref(30)
  const txtEliminar = ref('')
  const esModalEliminar = ref(false)

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
  })
  const traduccion = () => {
    for (var x in lstTiempoAgendar.value) {
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
    for (var x in lstMetodosPago.value) {
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
    var temp = lstDivisas.value.find(q => q.id === parseInt(localStorage.getItem('idMoneda')))
    divisaSelec.value = temp
    for (var x in lstDivisas.value) {
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
  const modalContinuarEliminar = () => {
    toggleButton.value = false
    txtEliminar.value = ''
    esModalEliminar.value = true
  }
  const cerrarModalEliminar = () => {
    esModalEliminar.value = false
  }
  const txtEliminarMayusculas = (event) => {
    txtEliminar.value = event.toUpperCase()
  }
</script>
