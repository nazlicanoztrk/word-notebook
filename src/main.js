

import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import router from './router'

import '@quasar/extras/material-icons/material-icons.css'

import 'quasar/dist/quasar.css'

import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(Quasar, {
  plugins: {
    Notify
  }, 
})

app.mount('#app')
