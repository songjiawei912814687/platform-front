import Vue from 'vue';
import vant from 'vant';
import App from './App.vue';
import router from './router';
import store from './store';
import 'vant/lib/index.css';

Vue.use(vant);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
