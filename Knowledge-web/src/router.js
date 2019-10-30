import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login/index';
import IndexWrap from '@/views/Index/IndexWrap';
import AutoLogin from '@/views/Login/AutoLogin';
import SelfSheet from '@/views/Index/SelfSheet/index'
import Power from '@/views/Index/Power/index';
import Grain from '@/views/Index/Grain/index';
import Refer from '@/views/Index/Refer/index';
import Materials from '@/views/Index/Materials/index';
import Search from '@/views/Index/Search'

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
            redirect: '/index/power',
            name: 'index',
            component: IndexWrap,
            children: [
                {
                    path: '/index/power',
                    name: 'power',
                    component: Power,
                },
                {
                    path: '/index/grain',
                    name: 'grain',
                    component: Grain,
                },
                {
                    path: '/index/refer',
                    name: 'refer',
                    component: Refer,
                },
                {
                    path: '/index/materials',
                    name: 'materials',
                    component: Materials,
                },
                {
                    path: '/index/selfSheet',
                    name: 'selfSheet',
                    component: SelfSheet,
                },
                {
                    path: '/index/search',
                    name: 'search',
                    component: Search,
                }
            ],
        },
    ],
});
