<template>
    <div class="content-wrap">
        <div class="nowposition">
            <span class="titles">当前位置：</span>
            <a-breadcrumb :routes="routes" separator=">">
                <template slot="itemRender" slot-scope="{route, params, routes, paths}">
                    <span v-if="routes.indexOf(route) === routes.length - 1">
                        {{route.breadcrumbName}}
                    </span>
                    <router-link v-else :to="paths.join('/')">
                        {{route.breadcrumbName}}
                    </router-link>
                    <!-- <a-breadcrumb-item href="{routes.path}">
                         {{route.breadcrumbName}}
                     </a-breadcrumb-item>-->
                 </template>
             </a-breadcrumb>
             <a-button type='default' class="returnBack" @click="returnBack" style="background:  #10457a">返回</a-button>
         </div>
        <div class="searchBox">
            <div class="btnSearch">
                <div v-if="status === 'search'">
                    <a-button @click="searchCancel">取消搜索</a-button>
                </div>
                <div v-else>
                    <a-button :class="[nowBtn=='isdepart'?'activeBtn':'']" @click="handleBtnSearch('isdepart')"
                    >热门事项

                    </a-button>

                    <a-button :class="[nowBtn=='ishot'?'activeBtn':'']" @click="handleBtnSearch('ishot')"
                    >最小颗粒事项
                    </a-button>
                    <!--<a-button :class="[nowBtn=='istheme'?'activeBtn':'']" @click="handleBtnSearch('istheme')">按主题-->
                    <!--</a-button>-->
                </div>
            </div>
            <div class="keySearch">
                <a-input-search v-model.trim="searchKey" @search="findByHappenType" enterButton="搜索"
                                placeholder="请输入关键字搜索"/>
            </div>
            <hr class="lines">
        </div>
         <div class="infoBox" style="padding: 150px 30px 130px;">
             <div class="resultBox" style="font-size: 20px;color: white">
                 <div class="info" v-for="(item, index) in dataList" :key="index" @click="getDetail(item)">
                     <span>{{item.name}}</span>
                     <i class="visible"></i>
                 </div>
             </div>
         </div>

     </div>
 </template>

 <script>
   import {Input, Button, Breadcrumb,} from 'ant-design-vue';

   const {Search} = Input;

   import {autoDoFn} from '@/utils/util';
   import {
     findQlPageList,
     findOrganizationList,
     findHangPageList,
     findByHappenType,
   } from '@/remote/userguide';

   const typeList = {
     ishot: 1,
     isdepart: 2,
     istheme: 3,
     search: 4,
   };

   export default {
     name: 'index',
     components: {
       AInputSearch: Search,
       AButton: Button,
       ABreadcrumb: Breadcrumb,
     },
     data() {
       return {
         nowBtn: 'isdepart',
         searchKey: '',
         dataList: [],    //数据列表
         originDataList: [],  //搜索前的原本数组
         routes: [
           {
             path: '../index/homepage',
             breadcrumbName: '首页'
           }, {
             path: '/index/itemlist?id=\' + {item.id} + \'&type=\' + {typeList[this.nowBtn]} + \'&qlName=\' + item.name',
             breadcrumbName: '事项指南'
           }
         ],
         status: '',
       }
     },
     created() {
       // this.getHotData();
         this.getDepartData();
     },
     // mounted(){
     //     console.log('mouted========')
     // },
     // updated(){
     //     console.log('updated---------')
     // },
     methods: {
       // 查看最小颗粒
       getHotData() {
         autoDoFn(async () => {
           const res = await findQlPageList();
           if (res && res.success) {
             this.dataList = res.data;
             this.originDataList = res.data;
           }
         })
       },
       // 按部门
       getDepartData() {
         autoDoFn(async () => {
           const res = await findOrganizationList({})
           if (res && res.success) {
             this.dataList = res.data;
             this.originDataList = res.data;
           }
         })
       },
       // 按主题
       getThemeData() {
         autoDoFn(async () => {
           const res = await findHangPageList({
             hangYeClassTypeName: ''
           })
           if (res && res.success) {
             this.dataList = res.data;
             // this.originDataList = res.data;
           }
         })
       },
       // 搜索
       findByHappenType() {
         autoDoFn(async () => {
           // if(this.searchKey){
             const res = await findByHappenType({
               name: this.searchKey
             })
             if (res && res.success) {
               this.nowBtn = "search";
               this.dataList = res.data;
               // this.originDataList = res.data;
               this.status = 'search';
             }
           // }
         })
       },
       searchCancel() {
         this.nowBtn = 'ishot';
         this.status = '';
         this.getHotData();
       },
       handleBtnSearch(froms) {
         this.nowBtn = froms;
         if (froms == 'ishot') {
           // this.getHotData();
             this.getDepartData();
         } else if (froms == 'isdepart') {
           this.getDepartData();
         } else {
           this.getThemeData();
         }

       },
       onSearch() {
         this.dataList = this.originDataList.filter(item => item.name.indexOf(this.searchKey) > -1);
       },
       getDetail(item) {
         this.$router.push('/index/itemlist?id=' + item.id + '&type=' + typeList[this.nowBtn] + '&qlName=' + item.name);
       },
       returnBack() {
         // this.$router.back(-1);
         this.$router.push('/index/homepage')
       }
     }
   }
 </script>

 <style scoped>
     .searchBox {
         position: fixed;
         width: 100%;
         padding: 80px 30px 10px;
         background: #ffffff;
         z-index: 998;
     }

     .keySearch {
         position: absolute;
         right: 30px;
         top: 80px;
         width: 300px;
         background:  #10457a;
     }

     .btnSearch button {
         margin-right: 20px;
     }

     .btnSearch .activeBtn {
         background: #41a5f8;
         color: #fff;
     }

     .resultBox .info {
         width: 130px;
         height: 100px;
         border: 1px solid;
         float: left;
         margin-right: 20px;
         text-align: center;
         padding: 5px;
         cursor: pointer;
         margin-bottom: 20px;
         background: #10457a;
     }

     .resultBox .info span {
         vertical-align: middle;
         display: inline-block;
         *display: inline;
         *zoom: 1;
     }

     .visible {
         height: 100%;
         vertical-align: middle;
         width: 0;
         display: inline-block;
     }
 </style>

