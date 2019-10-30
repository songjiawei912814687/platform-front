import Vue from 'vue';
import Router from 'vue-router';

import IndexWrap from '@/views/IndexWrap';
import HomePage from '@/views/HomePage';
import UserGuide from '@/views/UserGuide/index';
import ConsultQuestion from '@/views/ConsultQuestion/index';
import Questions from "@/views/ConsultQuestion/questions";
import ItemList from '@/views/UserGuide/itemlist';
import ConsultDetail from '@/views/ConsultQuestion/detail';
import ItemDetail from '@/views/UserGuide/detail';
import Downloads from '@/views/UserGuide/downloads';
import selfform from '@/views/SelfForm/index';
import firstForm from '@/views/SelfForm/firstForm';
import secondForm from '@/views/SelfForm/secondForm';
import thirdForm from '@/views/SelfForm/thirdForm';
import fourthForm from '@/views/SelfForm/fourthForm';

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index/homepage',
    },
    {
      path: '/index',
      redirect: '/index/homepage',
      name: 'home',
      component: IndexWrap,
      children: [
        {
          path: '/index/homepage', //首页
          name: 'homepage',
          component: HomePage
        }, {
          path: '/index/userguide',  // 事项指南
          name: 'userguide',
          component: UserGuide
        }, {
          path: '/index/consultquestion',  // 咨询问题
          name: 'consultquestion',
          component: ConsultQuestion
        }, {
          path: '/index/itemlist',  //事项列表
          name: 'itemlist',
          component: ItemList
        }, {
          path: '/index/consultdetail',  //咨询问题详情
          name: 'consultdetail',
          component: ConsultDetail
        }, {
          path: '/index/itemdetail', // 事项详情
          name: 'itemdetail',
          component: ItemDetail
        }, {
          path: '/index/downloads',  // 申报材料
          name: 'downloads',
          component: Downloads,
        }, {
          path: '/index/selfform',  // 自助填单
          name: 'selfform',
          component: selfform,
        }, {
          path: '/index/firstForm',  // 自助填单
          name: 'firstForm',
          component: firstForm,
        },{
          path: '/index/secondForm',  // 自助填单
          name: 'secondForm',
          component: secondForm,
        },{
          path: '/index/thirdForm',  // 自助填单
          name: 'thirdForm',
          component: thirdForm,
          },{
          path: '/index/fourthForm',  // 自助填单
          name: 'fourthForm',
          component: fourthForm,
          },{
          path: "/index/questions", // 咨询问题
          name: "questions",
          component: Questions
          }
      ]
    },
  ],
});
