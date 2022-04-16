import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from "@/components/About";

const routes = [
  {
    path: '/',
    name: 'home',
    component:HomeView

  },
  {
    path: '/sign-up',
    name: 'signup',
    component: ()=>import('@/views/SignUp')
  },
  {
    path: '/sign-up/continue',
    name:'signup-continue',
    component: ()=>import('@/views/SignUpContinue')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
