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

export default router
