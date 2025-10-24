
import { toastController, IonContent } from '@ionic/vue'
const funcionesGlobales = {
  // Tu función para mostrar el toast con la lógica de Ionic
  mostrarToast: async (mensaje: string, titulo: string, autoHideDelay: number, color: string = 'warning') => {
    const toast = await toastController.create({
      message: `${titulo}: ${mensaje}`,
      duration: autoHideDelay,
      position: 'top',
      color: color, // Usa un color de Ionic como 'warning', 'danger', 'success'
      // cssClass: `bg-${color}` // Si quieres usar clases de Bootstrap/custom
    })
    await toast.present()
  },
  scrollToTop: (contentRef: any) => {
    let contentInstance = contentRef
    // Si la referencia tiene una propiedad $el (lo que Vue usa para el DOM)
    // usamos $el, que a menudo expone los métodos de la API de Stencil/Ionic.
    if (contentRef && contentRef.$el) {
      contentInstance = contentRef.$el
    }
    // Paso 2: Ejecutar la verificación con la instancia real o la nativa
    if (contentInstance && typeof contentInstance.scrollToTop === 'function') {
      contentInstance.scrollToTop(0)
    } else {
      console.warn('Error: No se pudo acceder a la instancia de <ion-content> o al método scrollToTop.')
      // Puedes agregar un console.log para ver qué objeto se está pasando:
      // console.log('Objeto de referencia recibido:', contentRef);
    }
  },
  verificarConexionInternetReal: async () => {
    try {
      const response = await fetch('/api/get', {
        method: 'GET',
        cache: 'no-cache',
        mode: 'cors' // Aunque el modo cors no es tan crítico con un proxy, es buena práctica mantenerlo
      })
      if (response.ok) {
        console.log('✅ Conexión real a Internet disponible')
        return true
      } else {
        console.warn('⚠️ Respuesta recibida pero no válida')
        return false
      }
    } catch (error) {
      console.error('❌ Sin conexión real a Internet', error)
      return false
    }
  },
  limitarLongitudNumerica: (valor: string | number | null | undefined, limite: number): string => {
    let cleanedValue = (valor || '').toString().replace(/[^0-9]/g, '')
    if (cleanedValue.length > limite) {
      cleanedValue = cleanedValue.substring(0, limite)
    }
    return cleanedValue
  }
}

export default funcionesGlobales