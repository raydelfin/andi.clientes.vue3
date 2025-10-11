// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import Login from '../views/Login.vue'
import Buscar from '../views/Buscar.vue'

const routes: Array<RouteRecordRaw> = [
{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  name: 'Login',
  component: Login
},
{
  path: '/buscar',
  name: 'buscar',
  component: Buscar
}]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

// 🚀 APLICAR LA VERIFICACIÓN DE AUTENTICACIÓN GLOBALMENTE
router.beforeEach((to) => {
  // console.log('localStorage.getItem(usuario) ---')
  // console.log(localStorage.getItem('usuario'))
  let usuario = localStorage.getItem('usuario')
  if (usuario === null || usuario === '' || usuario === 'null') {
    usuario = ''
  }
  console.log('router.beforeEach((to) => { ---')
  console.log('usuario ---')
  console.log(usuario)
  // 1. Define las rutas públicas (donde NO se necesita login)
  const rutasPublicas = ['/login'] // Asegúrate de incluir solo la ruta de login
  // 2. Verifica si el usuario quiere acceder a una página restringida
  //    Y si NO está logueado
  if (!rutasPublicas.includes(to.path) && (usuario === '')) {
    console.log('USUARIO NO AUTENTICADO. Redirigiendo a /login')
    return { path: '/login', replace: true }
    // 3. Retorna la ruta de destino (Login)
    /*
    return { 
      path: '/login',
      replace: true // Reemplaza la entrada en el historial
    }
    */
  } else {
    console.log('USUARIO AUTENTICADO. Redirigiendo a /buscar')
  }
  // 4. Si está logueado o si es una ruta pública, continúa
  return true
})

export default router
