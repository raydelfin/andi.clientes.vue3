<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons class="toolbar-content">
        <ion-menu-button></ion-menu-button>
        <ion-title>{{ t('menuClientes.buscar') }}</ion-title>
        <div @click="verMiPerfil">
          <ion-avatar class="avatar-right">
            <ion-img :src="avatarSrc" size="60px" />
          </ion-avatar>
        </div>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content :fullscreen="true" class="ion-padding">
    <ion-grid>
      <ion-row>
        <ion-col>
          <!-- BUSQUEDA ANDI -->
          <ion-input
            type="search"
            v-model.trim="busqueda"
            :label="t('buscar.buscarProveedorANDI')"
            label-placement="stacked"
            :clear-on-edit="false"
            :maxlength="50"
            @keyup.enter="buscarServicios()"
            fill="outline"
            mode="md" >
          </ion-input>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { 
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, 
    IonButtons, IonMenuButton, IonImg, IonAvatar, IonInput
  } from '@ionic/vue'
  import { getCurrentInstance } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()

  // VARIABLES ------------------------------
  // ***********************
  const app = getCurrentInstance();
  const $globalFunc = app?.appContext.config.globalProperties.$globalFunc
  const $api = app?.appContext.config.globalProperties.$api as string
  const router = useRouter()
  // // ********************
  const busqueda = ref('')
  const mostrarOverlaySpinner = ref(false)
  const txtOverlaySpinner = ref('')
  const ubicacion = ref<{lat: string; lon: string;}>()
  const esConsulta = ref(false)
  const ubicacionesSelec = ref<{ id: number; latitud: number; longitud: number; } | null>(null)
  const lat = ref(0)
  const lon = ref(0)
  const centroMapa = ref<{ lat: number, lon: number }>()
  const metodosPagoSelec = ref()
  const lstAtencionSelec = ref()
  const distanciaAtencion = ref()
  const distanciaEn = ref()
  const listaCoordenadas = ref()
  const zoomMapa = ref()
  const lstBusquedaProveedores = ref()
  const sugerencias = ref(false)
  const avatarSrc = ref('/img/avatar.png')
  // ***************************************************************************
  // ***************************************************************************
  // FUNCIONES LOCALES
  // Lógica de mounted()
  onMounted(() => {
    avatarSrc.value = localStorage.getItem('urlImg')
  })
  const buscarServicios = async () => {
    mostrarOverlaySpinner.value = true
    txtOverlaySpinner.value = t('buscar.buscandoEnANDI')
    if (busqueda.value === '') {
      await $globalFunc.mostrarToast(
        t('buscar.ingresaBusqueda'),
        t('global.validacion'),
        5000, 'warning')
      mostrarOverlaySpinner.value = false
      return
    }
    // console.log('ubicacion: ' + ubicacion)
    if (ubicacion.value === null) {
      await $globalFunc.mostrarToast(
        t('buscar.ubicacionInvalida'),
        t('global.validacion'),
        5000, 'warning')
      mostrarOverlaySpinner.value = false
      return
    }
    // console.log('ubicacionesSelec ---')
    // console.log(ubicacionesSelec)
    esConsulta.value = true
    // Ubicación diferente a la Actual -----------------------------------------------------
    if (ubicacionesSelec.value.id === 0) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            lat.value = position.coords.latitude
            lon.value = position.coords.longitude
            centroMapa.value = { lat: lat.value, lon: lon.value }



            //--// iniciarMapa()



            SucursalBuscarEmpresas()
          },
          (error) => {
            mostrarOverlaySpinner.value = false
            ubicacion.value = null
            console.log('Error al obtener ubicación: ', error)
          },
          { enableHighAccuracy: true } // Opcional, para mejor precisión
        )
      } else {
        mostrarOverlaySpinner.value = false
        console.log('Error gelocalización: ')
      }
    } else {
      console.log('Cliente Dirección ---')
      lat.value = ubicacionesSelec.value.latitud
      lon.value = ubicacionesSelec.value.longitud
      centroMapa.value = { lat: lat.value, lon: lon.value }
      guardarBusqueda()


      //--// iniciarMapa()


      SucursalBuscarEmpresas()
    }
  }
  /*
  const iniciarMapa = async () => {
    if (isValidLatLng()) {
      // console.log('centroMapa OK')
    } else {
      console.log("El centro del mapa no tiene coordenadas válidas:", centroMapa)
      console.log(centroMapa)
      return
    }
    try {
      await loadGoogleMaps()
      map = new window.google.maps.Map(document.getElementById("map"), {
        center: centroMapa,
        zoom: zoomMapa,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: true,
        zoomControl: true
        // disableDefaultUI: true // si funciona, quita todos los controles del mapa
      })
      var svgMarker = {
        path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "green",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 3,
        anchor: new google.maps.Point(0, 20),
      }
      // Crear un marcador
      new window.google.maps.Marker({
        position: centroMapa, // Posición del marcador
        map: map, // Asocia el marcador al mapa
        title: t('buscar.tuUbicacion'),
        icon: svgMarker, // "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png", // URL del ícono
      })
      // Crea un círculo
      var distancia = 0
      if (distanciaEn.value === 'km') {
        distancia = distanciaAtencion.value * 1000
      } else {
        distancia = distanciaAtencion.value * 1609.34
      }
      circle = new google.maps.Circle({
        strokeColor: "#006847",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#99CCFF",
        fillOpacity: 0.35,
        map: map,
        center: centroMapa,
        radius: distancia
      })
      // console.log('listaCoordenadas ---')
      // console.log(listaCoordenadas)
      if (listaCoordenadas !== undefined) {
        for (var x in listaCoordenadas) {
          agregarMarcador(listaCoordenadas[x])
        }
      } else {
        // console.log('iniciarMapa() sugerencias')
        if (lstBusquedaProveedores.length === 0) {
          sugerencias = false
          // SugerenciasSucursalesBuscar()
        }
      }
      cambioDistanciaAtencion()
    } catch (error) {
      console.error("Error al cargar Google Maps:", error)
    }
  }
  */
  const isValidLatLng = () => {
    let centro = centroMapa.value
    return (
      typeof centro.lat === "number" &&
      typeof centro.lon === "number" &&
      isFinite(centro.lat) &&
      isFinite(centro.lon)
    )
  }
  const guardarBusqueda = () => {
    localStorage.setItem('busqueda', JSON.stringify({
      busqueda: busqueda.value,
      metodosPagoSelec: metodosPagoSelec.value,
      lstAtencionSelec: lstAtencionSelec.value,
      distanciaAtencion: distanciaAtencion.value,
      distanciaEn: distanciaEn.value,
      listaCoordenadas: listaCoordenadas.value,
      latitud: lat.value,
      longitud: lon.value
    }))
  }
  const SucursalBuscarEmpresas = async () => {
    var distanciaKm = 0
    if (distanciaEn.value === 'km') {
      if (distanciaAtencion.value >= 1) zoomMapa.value = 15
      if (distanciaAtencion.value >= 1.5) zoomMapa.value = 14
      if (distanciaAtencion.value >= 2.5) zoomMapa.value = 13
      if (distanciaAtencion.value >= 4.5) zoomMapa.value = 12
      if (distanciaAtencion.value >= 8.5) zoomMapa.value = 11
      if (distanciaAtencion.value >= 16) zoomMapa.value = 10
      if (distanciaAtencion.value >= 32) zoomMapa.value = 9
      distanciaKm = distanciaAtencion.value
    } else {
      if (distanciaAtencion.value >= 1) zoomMapa.value = 14
      if (distanciaAtencion.value >= 1.5) zoomMapa.value = 13
      if (distanciaAtencion.value >= 2.5) zoomMapa.value = 12
      if (distanciaAtencion.value >= 5) zoomMapa.value = 11
      if (distanciaAtencion.value >= 9.5) zoomMapa.value = 10
      if (distanciaAtencion.value >= 18.5) zoomMapa.value = 9
      distanciaKm = distanciaAtencion.value * 1.6093
    }
    try {
      const response = await axios.post(
        $api + 'Sucursal/BuscarEmpresas?latitud=' + lat.value +
        '&longitud=' + lon.value + '&radio=' + distanciaKm +
        '&busqueda=' + busqueda, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        timeout: 10000 // 10 segundos timeout
      })
      esConsulta.value = false
      //--// limpiarMapa()
      lstBusquedaProveedores.value = response.data
      console.log('lstBusquedaProveedores *---')
      console.log(lstBusquedaProveedores)
      if (lstBusquedaProveedores.value.length === 0) {
        await $globalFunc.mostrarToast(
          t('buscar.busquedaVacia'),
          t('buscar.buscar'),
          5000, 'warning')
        limpiarMapa()
        console.log('SucursalBuscarEmpresas() NO sugerencias')
        sugerencias.value = false
        // SugerenciasSucursalesBuscar()
        mostrarOverlaySpinner.value = false
        return
      } else {
        sugerencias.value = false
      }
      // Llenar la listaCoordenadas con los datos obtenidos
      /*
      listaCoordenadas = lstBusquedaProveedores.map(function (sucursal) {
        return {
          idSucursal: sucursal.idSucursal,
          idEmpresa: sucursal.idEmpresa,
          lat: sucursal.latitud,
          lng: sucursal.longitud,
          distancia: sucursal.distancia,
          sucNombre: sucursal.sucursalNombre,
          empNombre: sucursal.empresaNombre,
          promedio: sucursal.promedio,
          promedioMensual: sucursal.promedioMensual,
          cantCalif: sucursal.cantCalif,
          vistas: sucursal.vistas,
          seguidores: sucursal.seguidores,
          urlEmpresa: sucursal.urlEmpresa,
          enRango: sucursal.enRango,
          coincidencias: sucursal.coincidencias,
          ordenConincidencias: sucursal.ordenConincidencias,
          imagenes: sucursal.imagenes,
          urlLogo: sucursal.urlLogo,
          numImagenes: sucursal.numImagenes
        }
      })
      */
      console.log('Lista de coordenadas ---', listaCoordenadas)
      for (var x in listaCoordenadas) {
        listaCoordenadas[x].divRef = '#car' + listaCoordenadas[x].idSucursal
        listaCoordenadas[x].divID = 'car' + listaCoordenadas[x].idSucursal
        if (distanciaEn.value === 'mi') {
          listaCoordenadas[x].distancia = listaCoordenadas[x].distancia * 0.6213
        }
        //--// agregarMarcador(listaCoordenadas[x])
      }
      guardarBusqueda()
      mostrarOverlaySpinner.value = false
    } catch (error) {
      mostrarOverlaySpinner.value = false
      esConsulta.value = false
      console.log('Error completo:', error)
    }
  }
  const limpiarMapa = () => {
    /*
    markers.forEach(({ marker, overlay }) => {
      // Eliminar el marcador del mapa
      marker.setMap(null)
      // Eliminar el overlay del mapa
      overlay.setMap(null)
    })
    // Vaciar la lista de marcadores
    markers = []
    listaCoordenadas = []
    localStorage.setItem('busqueda', JSON.stringify({
      busqueda: busqueda,
      metodosPagoSelec: metodosPagoSelec,
      lstAtencionSelec: lstAtencionSelec,
      distanciaAtencion: distanciaAtencion,
      distanciaEn: distanciaEn,
      listaCoordenadas: [],
      latitud: latitud,
      longitud: longitud
    }))
    */
  }
  const verMiPerfil = () => {
    router.push('/client/MiPerfil')
  }
</script>
