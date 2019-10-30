import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login/index';
import AutoLogin from '@/views/Login/AutoLogin';
import IndexWrap from '@/views/Index/IndexWrap';
import Org from '@/views/Index/Org/index';
import Staff from '@/views/Index/Staff/index';
import Window from '@/views/Index/Window/index';
import Role from '@/views/Index/Role/index';
import Post from '@/views/Index/Post/index';
import Address from '@/views/Index/Address'


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
      redirect: '/index/org',
      name: 'index',
      component: IndexWrap,
      children: [{
        path: '/index/org',
        name: 'org',
        component: Org,
      },
      {
        path: '/index/staff',
        name: 'staff',
        component: Staff,
      },
      {
        path: '/index/window',
        name: 'window',
        component: Window,
      },
      {
        path: '/index/role',
        name: 'role',
        component: Role,
      },
      {
        path: '/index/post',
        name: 'post',
        component: Post,
      },
        {
          path: '/index/address',
          name: 'address',
          component: Address,
        },
      ],
    },
  ],
});
