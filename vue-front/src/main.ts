import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* Bootstrap */
import { BootstrapVue } from 'bootstrap-vue'
Vue.use(BootstrapVue)

/* Fonts Awesome */
import { library } from '@fortawesome/fontawesome-svg-core'
// TODO extract library for production
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import vuetify from './plugins/vuetify'
library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
