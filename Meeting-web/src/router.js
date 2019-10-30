import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login/index';
import AutoLogin from '@/views/Login/AutoLogin';
import IndexWrap from '@/views/Index/IndexWrap';
import Room from '@/views/Index/Room/index';
import Appointment from '@/views/Index/Appointment/index';
import Pit from '@/views/Index/Pit/index';
import MyMeeting from '@/views/Index/MyMeeting/index';
import PitApply from '@/views/Index/PitApply/index';


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
      redirect: '/index/room',
      name: 'index',
      component: IndexWrap,
      children: [{
        path: '/index/room',
        name: 'room',
        component: Room,
      },{
        path: '/index/appointment',
        name: 'appointment',
        component: Appointment,
      },{
          path: '/index/pit',
          name: 'pit',
          component: Pit,
      },{
        path: '/index/myMeeting',
        name: 'myMeeting',
        component: MyMeeting,
      },{
        path: '/index/pitapply',
        name: 'pitapply',
        component: PitApply,
      }],
    },
  ],
});
