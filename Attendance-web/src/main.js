import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import {
  message,
  notification,
  Modal,
} from 'ant-design-vue';
import router from './router';
import store from './store/index';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
Vue.use(iView);
Vue.config.productionTip = false;

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;

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
