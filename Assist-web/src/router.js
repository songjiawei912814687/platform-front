import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login/index';
import AutoLogin from '@/views/Login/AutoLogin';
import IndexWrap from '@/views/Index/IndexWrap';
import Staff from '@/views/Index/ItemWrap/index';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/autoLogin',
      name: 'autoLogin',
      component: AutoLogin,
    },
    {
      path: '/index',
      redirect: '/index?code=staff',
      name: 'index',
      component: IndexWrap,
      children: [{
        path: '/index',
        name: 'staff',
        component: Staff,
      }],
    },
  ],
});
