import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login/index';
import IndexWrap from '@/views/Index/IndexWrap';
import AutoLogin from '@/views/Login/AutoLogin';
import User from '@/views/Index/System/User/index';
import Role from '@/views/Index/System/Role/index';
import Menu from '@/views/Index/System/Menu';
import Org from '@/views/Index/personnel/Org';
import Staff from '@/views/Index/personnel/Staff';
import stampList from '@/views/Index/stamp/stampList';
import Forget from '@/views/Forget/index.vue'
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
      path: '/forget',
      name: 'forget',
      component: Forget,
     },
    {
      path: '/index',
      redirect: '/index/system/user',
      name: 'index',
      component: IndexWrap,
      children: [{
          path: '/index/system/user',
          name: 'user',
          component: User,
        },
        {
          path: '/index/system/role',
          name: 'user',
          component: Role,
        },
        {
          path: '/index/system/menu',
          name: 'menu',
          component: Menu
        },
        {
          path: '/index/org',
          name: 'org',
          component: Org
        },
        {
          path: '/index/personnel/staff',
          name: 'staff',
          component: Staff
        },
        {
          path: '/index/stamp/stampList',
          name: 'stampList',
          component: stampList,
        },
      ],
    }
  ],
});
