import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login/index';
import AutoLogin from '@/views/Login/AutoLogin';
import IndexWrap from '@/views/Index/IndexWrap';

import Stencil from '@/views/Index/Stencil/index';
import Group from '@/views/Index/Group/index';
import Send from '@/views/Index/Send/index';
import Wait from '@/views/Index/Wait/index';
import Finish from '@/views/Index/Finish/index';
import Receive from '@/views/Index/Receive/index';

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
      redirect: '/index/stencil',
      name: 'index',
      component: IndexWrap,
      children: [
        {
          path: '/index/stencil',
          name: 'stencil',
          component: Stencil,
        },
        {
          path: '/index/group',
          name: 'group',
          component: Group,
        },
        {
          path: '/index/send',
          name: 'send',
          component: Send,
        },
        {
          path: '/index/wait',
          name: 'wait',
          component: Wait,
        },
        {
          path: '/index/finish',
          name: 'finish',
          component: Finish,
        },
        {
          path: '/index/receive',
          name: 'receive',
          component: Receive,
        },
      ],
    },
  ],
});
