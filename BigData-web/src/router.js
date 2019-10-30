import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login/index';
import IndexWrap from '@/views/Index/IndexWrap';
import MyBench from '@/views/Index/MyBench/index';
import AutoLogin from '@/views/Login/AutoLogin';
import User from '@/views/Index/System/User/index';
import Role from '@/views/Index/System/Role/index';
import ReviewConfig from '@/views/Index/System/reviewConfig/index';
import ReviewConfigNew from '@/views/Index/System/reviewConfigNew/index';
import Review from '@/views/Index/review';
import Applicant from '@/views/Index/applicat';
import Download from '@/views/Index/Download';
import Staff from '@/views/Index/staff';
import MyStaff from '@/views/Index/myStaff';
import Menu from '@/views/Index/System/Menu';
import Config from '@/views/Index/System/ConfigParameter';
import Luyin from '@/views/Index/System/luyinDemo';
import StaffDetail from '@/views/Index/staff/StaffDetailView'
import DownDetail from '@/views/Index/Download/DownDetailView'
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
      redirect: '/index/myBench',
      name: 'index',
      component: IndexWrap,
      children: [{
        path: '/index/myBench',
        name: 'myBench',
        component: MyBench,
      },
        {
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
          path: '/index/review/approval',
          name: 'approval',
          component: Review,
        },
        {
          path: '/index/review/applicat',
          name: 'applicat',
          component: Applicant,
        },
        {
          path: '/index/system/reviewConfig',
          name: 'reviewConfig',
          component: ReviewConfig
        },
        {
          path: '/index/system/reviewConfigNew',
          name: 'reviewConfigNew',
          component: ReviewConfigNew
        },
        {
          path: '/index/download',
          name: 'download',
          component: Download
        },
        {
          path: '/index/download/detail',
          name: 'downloadDetail',
          component: DownDetail
        },
        {
          path: '/index/staff/staff',
          name: 'staff',
          component: Staff
        },
        {
          path: '/index/staff/myStaff',
          name: 'myStaff',
          component: MyStaff
        },
        {
          path: '/index/system/menu',
          name: 'menu',
          component: Menu
        },
        {
          path: '/index/system/config',
          name: 'config',
          component: Config
        },
        {
          path: '/index/system/luyinDemo',
          name: 'luyin',
          component: Luyin
        },
        {
          path: 'index/staff/staff/detail',
          name: 'staffDetail',
          component: StaffDetail
        }

      ],
    }
  ],
});
