import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login/index';
import AutoLogin from '@/views/Login/AutoLogin';
import IndexWrap from '@/views/Index/IndexWrap';

import AttendanceWrap from '@/views/Index/Attendance/index';
import Data from '@/views/Index/Attendance/Data/index';
import Rule from '@/views/Index/Attendance/Rule/index';
import RuleConfig from '@/views/Index/Attendance/RuleConfig/index';

import LeaveWrap from '@/views/Index/Leave/index';
import Adjust from '@/views/Index/Leave/Adjust/index';
import Apply from '@/views/Index/Leave/Apply/index';
import Holiday from '@/views/Index/Leave/Holiday/index';
import LeaveOvertime from '@/views/Index/Leave/Overtime/index';
import Supply from '@/views/Index/Leave/Supply/index';

import ReportWrap from '@/views/Index/Report/index';
import Day from '@/views/Index/Report/Day/index';
import Month from '@/views/Index/Report/Month/index';
import ReportOvertime from '@/views/Index/Report/Overtime/index';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'default',
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
      name: 'index',
      component: IndexWrap,
      redirect: '/index/attendance',
      children: [{
        path: '/index/attendance',
        redirect: '/index/attendance/data',
        name: 'attendance',
        component: AttendanceWrap,
        children: [{
          path: '/index/attendance/data',
          name: 'data',
          component: Data,
        }, {
          path: '/index/attendance/rule',
          name: 'rule',
          component: Rule,
        }, {
            path: '/index/attendance/RuleConfig',
            name: 'ruleConfig',
            component: RuleConfig,
        }],
      }, {
        path: '/index/leave',
        redirect: '/index/leave/apply',
        name: 'leave',
        component: LeaveWrap,
        children: [{
          path: '/index/leave/apply',
          name: 'Apply',
          component: Apply,
        }, {
          path: '/index/leave/holiday',
          name: 'holiday',
          component: Holiday,
        }, {
          path: '/index/leave/overtime',
          name: 'leave_overtime',
          component: LeaveOvertime,
        }, {
          path: '/index/leave/adjust',
          name: 'adjust',
          component: Adjust,
        }, {
          path: '/index/leave/supply',
          name: 'supply',
          component: Supply,
        }, {
          path: '/index/report',
          redirect: '/index/report/day',
          name: 'report',
          component: ReportWrap,
          children: [{
            path: '/index/report/day',
            name: 'day',
            component: Day,
          },{
            path: '/index/report/month',
            name: 'month',
            component: Month,
          }, {
            path: '/index/report/overtime',
            name: 'report_overtime',
            component: ReportOvertime,
          }],
        }],
      }],
    },
  ],
});
