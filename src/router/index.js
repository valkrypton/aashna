import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component:HomeView

  },
  {
    path: '/sign-up',
    name: 'signup',
    component: ()=>import('../views/SignUp')
  },
  {
    path: "/login",
    name: 'login',
    component: ()=>import('../views/LogIn')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
