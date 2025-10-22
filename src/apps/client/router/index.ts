import { createRouter, createWebHistory } from 'vue-router'
// import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import MainLayout from '../views/MainLayout.vue' // El nuevo layout
import Login from '../views/Login.vue'
import Buscar from '../views/Buscar.vue'
import Favoritos from '../views/Favoritos.vue'
import MiPerfil from '../views/MiPerfil.vue'
import BorrarCuenta from '../views/BorrarCuenta.vue'
import ListaDirecciones from '../views/ListaDirecciones.vue'
import Direcciones from '../views/Direcciones.vue'

const routes: Array<RouteRecordRaw> = [
{
  path: '/',
  redirect: () => {
    const usuario = localStorage.getItem('usuario')
    const isAuthenticated = !(usuario === null || usuario === '' || usuario === 'null')
    return isAuthenticated ? '/client/Buscar' : '/client/Login'
  }
},
{
  path: '/client',
  component: MainLayout,
  children: [
    {
      path: 'Login', 
      component: Login // Debe usar import dinámico si las otras lo usan
    },
    {
      path: 'Buscar', 
      component: Buscar
    },
    {
      path: 'Favoritos', 
      component: Favoritos
    },
    {
      path: 'MiPerfil', 
      component: MiPerfil
    },
    {
      path: 'BorrarCuenta', 
      component: BorrarCuenta
    },
    {
      path: 'ListaDirecciones', 
      component: ListaDirecciones
    },
    {
      path: 'Direcciones', 
      component: Direcciones
    }
  ]
},
// 🔥 CAPTURAR TODAS LAS RUTAS NO DEFINIDAS
{
  path: '/:pathMatch(.*)*',
  redirect: '/'
}]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

let isFirstNavigation = true

// 🚀 APLICAR LA VERIFICACIÓN DE AUTENTICACIÓN GLOBALMENTE
router.beforeEach((to) => {
  const usuario = localStorage.getItem('usuario')
  // console.log('index.ts - Ruta actual:', to.path)
  // console.log('index.ts - usuario:', usuario)

  // Verificar si es la primera navegación
  if (isFirstNavigation) {
    console.log('🚀 APP ACABA DE INICIAR - Primera navegación')
    isFirstNavigation = false
    // Aquí puedes ejecutar código específico del inicio
    localStorage.setItem('appIniciada', '1')
  }

  const isAuthenticated = !(usuario === null || usuario === '' || usuario === 'null')
  // console.log('index.ts - isAuthenticated:', isAuthenticated)
  // Definir rutas públicas
  const publicRoutes = ['/client/Login']
  const isPublicRoute = publicRoutes.includes(to.path)
  // console.log('index.ts - Es ruta pública:', isPublicRoute)
  // 1. Si NO está autenticado Y no va a ruta pública, forzar Login
  if (!isAuthenticated && !isPublicRoute) {
    // console.log('index.ts - Redirigiendo a Login (no autenticado)')
    return { path: '/client/Login', replace: true }
  } 
  // 2. Si está autenticado y está en Login, enviarlo a Buscar
  if (isAuthenticated && isPublicRoute) {
    // console.log('index.ts - Redirigiendo a Buscar (ya autenticado)')
    return { path: '/client/Buscar', replace: true }
  }
  // console.log('index.ts - Navegación permitida')
  return true
})

export default router
