import Vue from 'vue'
import App from './App.vue'
import router from './router'
import confirm from './confirm-vue'
import store from './store';
import vuetify from './plugins/vuetify';
import './plugins/axios';
import './plugins/mask';
import './plugins/excel';

Vue.config.productionTip = false

new Vue({
  router,
  confirm,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
