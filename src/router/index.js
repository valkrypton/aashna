import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/LandingPage.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView

    },
    {
        path: '/sign-up',
        name: 'signup',
        component: () => import('../views/SignUp')
    },
    {
        path: "/login",
        name: 'login',
        component: () => import('../views/LogIn')
    },
    {
        path: "/home",
        name: "homepage",
        component: () => import('../views/MainView')
    },
    {
        path: "/user-profile",
        name: "profile-page",
        component: () => import('../views/ProfileView'),
        props: {user: Object}

    }

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
