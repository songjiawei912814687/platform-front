import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login/index';
import AutoLogin from '@/views/Login/AutoLogin';
import IndexWrap from '@/views/Index/IndexWrap';

import Classify from '@/views/Index/classify/index';
import Rule from '@/views/Index/Rule/index';
import Complain from '@/views/Index/Complain/index';
import Score from '@/views/Index/Score/index';
import Template from '@/views/Index/Template/index';
import StaffCheck from '@/views/Index/StaffCheck/index';
import DepartmentCheck from '@/views/Index/DepartmentCheck/index';
import AwardReport from '@/views/Index/AwardReport/index';
import DepartmentReport from '@/views/Index/DepartmentReport/index';
import StaffReport from '@/views/Index/StaffReport/index';

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
      redirect: '/index/classify',
      name: 'index',
      component: IndexWrap,
      children: [{
        path: '/index/classify',
        name: 'org',
        component: Classify,
      },
      {
        path: '/index/rule',
        name: 'rule',
        component: Rule,
      },
      {
        path: '/index/Complain',
        name: 'complain',
        component: Complain,
      },
      {
        path: '/index/score',
        name: 'score',
        component: Score,
      },
      {
        path: '/index/template',
        name: 'template',
        component: Template,
      },
        {
          path: '/index/departmentCheck',
          name: 'departmentCheck',
          component: DepartmentCheck,
        },
      {
        path: '/index/staffCheck',
        name: 'staffCheck',
        component: StaffCheck,
      },
      {
        path: '/index/awardReport',
        name: 'awardReport',
        component: AwardReport,
      },
        {
          path: '/index/departmentReport',
          name: 'departmentReport',
          component: DepartmentReport,
        },
        {
          path: '/index/staffReport',
          name: 'staffReport',
          component: StaffReport,
        },
      ],
    },
  ],
});
