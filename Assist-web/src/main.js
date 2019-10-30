import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue'
import ECharts from 'vue-echarts/components/ECharts.vue'

import 'ant-design-vue/dist/antd.css';
import router from './router';
import store from './store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
Vue.use(Antd);
Vue.config.productionTip = false;
Vue.component('v-chart', ECharts);

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
