import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import './assets/global.css'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App).use(router).mount('#app')
