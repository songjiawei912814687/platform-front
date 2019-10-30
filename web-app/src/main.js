import 'babel-polyfill';
import Vue from 'vue';
import VueStorage from 'vue-ls'
import App from './App.vue';
import MintUI from 'mint-ui'

import router from './router';
import store from './store/index';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'mint-ui/lib/style.css'
import {
  message,
  notification,
  Modal,
} from 'ant-design-vue';

Vue.use(MintUI);
// const options = {
//   namespace: 'vuejs__', // key prefix
//   name: 'ls', // name variable Vue.[ls] or this.[$ls],
//   storage: 'local', // storage name session, local, memory
// };

Vue.use(VueStorage, {
  namespace: 'pro__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
});
Vue.config.productionTip = false;
Vue.prototype.$message = message;

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach((transition) => {
  NProgress.done();
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
