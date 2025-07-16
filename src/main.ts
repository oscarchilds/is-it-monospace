import './assets/styles/main.scss'

// App
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Pinia
import { createPinia } from 'pinia'
const pinia = createPinia()

app.use(pinia)

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config } from '@fortawesome/fontawesome-svg-core'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

library.add(faUpload)
config.styleDefault = 'solid'

app.component('font-awesome-icon', FontAwesomeIcon)

// Final
app.mount('#app')
