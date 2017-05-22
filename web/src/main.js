// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import AuthPlugin from './plugins/auth'
import axios from 'axios'
import VeeValidate from 'vee-validate'
import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VeeValidate)

// Setup API prefix (TODO: asi by sa zislo upratat rest clienta do jednej triedy)
var isProduction = false
var apiPrefix
var setupAPI = function () {
  switch (process.env.NODE_ENV) {
    case 'production':
      apiPrefix = '/cxf'
      isProduction = true
      break
    default:
      apiPrefix = '/cxf'
  }
}
setupAPI()

// Notifications
miniToastr.init()

function toast({ title, message, type, timeout, cb }) {
  return miniToastr[type](message, title, timeout, cb)
}

Vue.use(VueNotifications, {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
})

VeeValidate.Validator.extend('password', {
  getMessage: field => 'Requirements: 1 uppercase, 1 lowercase, 1 number, and one special character (E.g. , . _ & ? etc)',
  validate: value => {
    var strongRegex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\\$%\\^&\\*])[0-9a-zA-Z!@#\\$%\\^&\\*]{8,}$')
    return strongRegex.test(value)
  }
})

Vue.use(AuthPlugin, {
  router: router,
  http: axios,
  isProduction: isProduction,
  apiPrefix: apiPrefix
})
Vue.material.registerTheme('default', {
  primary: 'green'
})
Vue.prototype.$http = axios
Vue.prototype.$apiPrefix = apiPrefix
Vue.prototype.$isProduction = isProduction

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

