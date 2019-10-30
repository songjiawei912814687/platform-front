import Vue from 'vue';
import Router from 'vue-router';
import Screen1 from '@/views/Screen/Screen1';
import Screen2 from '@/views/Screen/Screen2';
import Screen3 from '@/views/Screen/Screen3';
import Screen4 from '@/views/Screen/Screen4';
import Screen5 from '@/views/Screen/2';
import Screen7 from '@/views/Screen/meeting3'
import Screen6 from '@/views/Screen/meeting4'
import Screen8 from '@/views/Screen/picture'
import Screen9 from '@/views/Screen/picture1'
import Screen10 from '@/views/Screen/picture2'
import Screen11 from '@/views/Screen/picture3'
import Screen12 from '@/views/Screen/picture4'
import Screen13 from '@/views/Screen/picture5'
import Screen14 from '@/views/Screen/picture6'
import Screen15 from '@/views/Screen/picture7'
import Screen16 from '@/views/Screen/picture8'
import Screen17 from '@/views/Screen/picture9'

Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/screen1',
    },
    {
      path: '/screen1',
      name: 'screen1',
      component: Screen1,
    },
    {
      path: '/screen2',
      name: 'screen2',
      component: Screen2,
    },
    {
      path: '/screen3',
      name: 'screen3',
      component: Screen3,
    },
    {
      path: '/screen4',
      name: 'screen4',
      component: Screen4,
    },
    {
      path: '/screen5',
      name: 'screen5',
      component: Screen5,
    },
    {
      path: '/screen6',
      name: 'screen6',
      component: Screen6,
    },
    {
      path: '/screen7',
      name: 'screen7',
      component: Screen7,
    },
    {
      path: '/screen8',
      name: 'screen8',
      component: Screen8,
    },
      {
          path: '/screen9',
          name: 'screen9',
          component: Screen9,
      },
      {
          path: '/screen10',
          name: 'screen10',
          component: Screen10,
      },
      {
          path: '/screen11',
          name: 'screen11',
          component: Screen11,
      },
      {
          path: '/screen12',
          name: 'screen12',
          component: Screen12,
      },
      {
          path: '/screen13',
          name: 'screen13',
          component: Screen13,
      },
      {
          path: '/screen14',
          name: 'screen14',
          component: Screen14,
      },
      {
          path: '/screen15',
          name: 'screen15',
          component: Screen15,
      },
      {
          path: '/screen16',
          name: 'screen16',
          component: Screen16,
      },
      {
          path: '/screen17',
          name: 'screen17',
          component: Screen17,
      },


  ],
});

