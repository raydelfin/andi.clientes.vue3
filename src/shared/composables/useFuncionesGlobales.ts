import { toastController } from '@ionic/vue'

const funcionesGlobales = {
  // Tu función para mostrar el toast con la lógica de Ionic
  mostrarToast: async (mensaje: string, titulo: string, autoHideDelay: number, color: string = 'warning') => {
    const toast = await toastController.create({
      message: `${titulo}: ${mensaje}`,
      duration: autoHideDelay,
      position: 'top',
      color: color, // Usa un color de Ionic como 'warning', 'danger', 'success'
      // cssClass: `bg-${color}` // Si quieres usar clases de Bootstrap/custom
    });
    await toast.present();
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
  }
  
  // ... otras funciones ...
};

export default funcionesGlobales