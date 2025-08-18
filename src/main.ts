import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// Install Pinia for state management
app.use(createPinia())

// Install head management
app.use(createHead())

// Mount the app
app.mount('#app')