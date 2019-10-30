import Vue from 'vue';
import Router from 'vue-router';
import IndexWrap from './views/IndexWrap.vue';
import Appointment from './views/Appointment.vue';
import List from './views/AppointmentList.vue';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexWrap,
      redirect: '/appointment',
      children: [{
        path: '/appointment',
        name: '预约排队',
        component: Appointment,
      }, {
        path: '/list',
        name: '我的预约',
        component: List,
      }],
    },
  ],
});
