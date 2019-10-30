import Vue from "vue";
import Router from "vue-router";
import IndexWrap from "@/views/IndexWrap";
import Complain from "@/views/Complain/Index";
import UserGuide from "@/views/UserGuide/index";
import ConsultQuestion from "@/views/ConsultQuestion/index";
import ItemList from "@/views/UserGuide/itemlist";
import ConsultDetail from "@/views/ConsultQuestion/detail";
import Questions from "@/views/ConsultQuestion/questions";
import ItemDetail from "@/views/UserGuide/detail";
import Downloads from "@/views/UserGuide/downloads";
import Entrance from "@/views/Entrance/index";
import Leave from '@/views/Leave/index';
import DetailView from '@/views/Leave/DetailView';
import AddView from '@/views/Leave/Add';
import LeaveLogin from '@/views/LeaveLogin/index';
Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/index/consultquestion"
    },
    {
      path: "/index",
      redirect: "/index/entrance",
      name: "home",
      component: IndexWrap,
      children: [
        {

          path: "/index/complain", //投诉
          name: "complain",
          component: Complain
        },
        {
          path: "/index/userguide", // 事项指南
          name: "userguide",
          component: UserGuide
        },
        {
          path: "/index/itemlist", //事项列表
          name: "itemlist",
          component: ItemList
        },
        {
          path: "/index/itemdetail", // 事项详情
          name: "itemdetail",
          component: ItemDetail
        },
        {
          path: "/index/questions", // 咨询问题
          name: "questions",
          component: Questions
        },
        {
          path: "/index/consultquestion", // 咨询问题
          name: "consultquestion",
          component: ConsultQuestion
        },
        {
          path: "/index/consultdetail", //咨询问题详情
          name: "consultdetail",
          component: ConsultDetail
        },
        {
          path: "/index/downloads", // 申报材料
          name: "downloads",
          component: Downloads
        },
        {
          path: "/index/entrance", // 咨询问题
          name: "entrance",
          component: Entrance
        },
          {
              path: "/index/leave", // 咨询问题
              name: "leave",
              component: Leave
          },
          {
              path: "/index/leave/add", // 咨询问题
              name: "leaveadd",
              component: AddView
          },
          {
              path: "/index/leave/detail", // 咨询问题
              name: "leavedetail",
              component: DetailView
          },
          {
              path: "/index/login", // 咨询问题
              name: "login",
              component: LeaveLogin
          },

      ]
    },

  ]
});
