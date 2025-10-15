// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import MainLayout from '../views/MainLayout.vue' // El nuevo layout

const routes: Array<RouteRecordRaw> = [{
  path: '/app', // Ruta padre que carga MainLayout
  component: MainLayout,
  children: [
    {
      path: 'Login', 
      component: () => import('@/views/Login.vue') // Debe usar import dinámico si las otras lo usan
    },
    {
      path: 'Buscar', 
      component: () => import('@/views/Buscar.vue')
    },
    {
      path: 'Favoritos', 
      component: () => import('../views/Favoritos.vue')
    },
    {
      path: 'MiPerfil', 
      component: () => import('../views/MiPerfil.vue')
    }
  ]
}]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

// 🚀 APLICAR LA VERIFICACIÓN DE AUTENTICACIÓN GLOBALMENTE
/*
router.beforeEach((to) => {
  let usuario = localStorage.getItem('usuario')
  if (usuario === null || usuario === '' || usuario === 'null') {
    usuario = ''
  }
  const rutasPublicas = ['/login']
  if (!rutasPublicas.includes(to.path) && (usuario === '')) {
    return { path: '/login', replace: true }
  } else {
  }
  return true
})
*/
// 🚀 APLICAR LA VERIFICACIÓN DE AUTENTICACIÓN GLOBALMENTE
router.beforeEach((to) => {
  let usuario = localStorage.getItem('usuario')
  const isAuthenticated = !(usuario === null || usuario === '' || usuario === 'null')
  // La única ruta pública "de la app" es /app/Login
  const isLoginRoute = to.path === '/app/Login' 
  // 1. Si NO está autenticado Y no va a Login, forzar Login
  if (!isAuthenticated && !isLoginRoute) {
      return { path: '/app/Login', replace: true }
  } 
  // 2. Si está autenticado y está en Login, enviarlo a Buscar
  if (isAuthenticated && isLoginRoute) {
      return { path: '/app/Buscar', replace: true };
  }
  return true
})

export default router
