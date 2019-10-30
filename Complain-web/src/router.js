import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login/index';
import AutoLogin from '@/views/Login/AutoLogin';
import IndexWrap from '@/views/Index/IndexWrap';

import Feedback from '@/views/Index/Feedback';
import Advice from '@/views/Index/Advice';
import Overdue from '@/views/Index/Overdue';
import DepartSatis from '@/views/Index/DepartSatis';
import StaffSatis from '@/views/Index/StaffSatis';


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
      redirect: '/index/feedback',
      name: 'index',
      component: IndexWrap,
      children: [
        {
          path:'/index/feedback',   // 反馈信息
          name:'feedback',
          component:Feedback
        },
        {
          path:'/index/advice',   // 投诉建议
          name:'advice',
          component:Advice
        },
        {
          path:'/index/overdue',    // 逾期未回复
          name:'overdue',
          component:Overdue
        },
        {
          path:'/index/departsatis',  // 部门满意度统计
          name:'departsatis',
          component:DepartSatis
        },
        {
          path: '/index/staffsatis',  // 窗口满意度统计
          name: 'staffsatis',
          component: StaffSatis,
        }
      ],
    },
  ],
});
