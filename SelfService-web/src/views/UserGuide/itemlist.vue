<template>
    <div class="content-wrap">
        <div class="nowposition">
            <a-breadcrumb :routes="routes" separator=">">
                <template slot="itemRender" slot-scope="{route, params, routes, paths}">
                    <span v-if="routes.indexOf(route) === routes.length - 1">
                        {{route.breadcrumbName}}
                    </span>
                    <router-link v-else :to="paths.join('/')">
                        {{route.breadcrumbName}}
                    </router-link>
                    <!-- <span>
                         {{route.breadcrumbName}}
                     </span>-->
                </template>
            </a-breadcrumb>
            <a-button type='default' class="returnBack" @click="returnBack">返回</a-button>
            <a-button type='default' class="returnBack" @click="returnHome">首页</a-button>
        </div>
        <div class="searchBox">
            <div class="nameShow">
                {{qlName}}
            </div>
            <div class="keySearch">
                <a-input-search v-model.trim="searchKey" @search="onSearch" enterButton="搜索"
                                placeholder="请输入关键字搜索"/>
            </div>
            <hr class="lines">
        </div>
        <div class="infoBox" style="padding: 130px 30px 30px; ">
            <div class="resultBox">
                <div class="info" v-for="(item, index) in dataList" :key="index">
                    <div class="title">
                        {{item.happeningType}}
                    </div>
                    <!--<div>
                        <a-button>查询子集事项</a-button>
                    </div>
                    <div class="actions" v-else>
                        <a-button @click="linkto(item.qlFullId)">办事指南</a-button>
                        <a-button @click="download(item.qlFullId)">打印资料</a-button>
                    </div>-->
                    <div class="actions1" v-if="item.hashChild">
                        <a-button @click="findMore(item.id)">查看更多</a-button>
                    </div>
                    <div class="actions" v-else>
                        <a-button @click="linkto(item.id)">办事指南</a-button>
                        <a-button @click="download(item.id)">打印资料</a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {Input, Button, Breadcrumb} from 'ant-design-vue';

  const {Search} = Input;

  import {autoDoFn} from '@/utils/util';
  import {findMiniPageList, findMore} from '@/remote/userguide';

  export default {
    name: 'index',
    components: {
      AInputSearch: Search,
      AButton: Button,
      ABreadcrumb: Breadcrumb,
    },
    data() {
      return {
        id: '',
        type: 1,
        nowName: '',  //名称
        searchKey: '',
        dataList: [],
        originDataList: [],  //搜索前的原本数组
        routes: [
          {
            path: '../../index/homepage',
            breadcrumbName: '首页'
          }, {
            path: '../../index/userguide',
            breadcrumbName: '事项指南'
          }, {
            path: '../../index/itemlist?id=' + this.id + '&type=' + this.type,
            breadcrumbName: '事项列表'
          }],
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.type = this.$route.query.type;
      this.qlName = this.$route.query.qlName;
      this.$nextTick(() => {
        this.getData();
      });

    },
    methods: {
      getData() {
        autoDoFn(async () => {
          const res = await findMiniPageList({id: this.id, type: this.type});
          if (res && res.success) {
            this.dataList = res.data;
            this.originDataList = res.data;
          }
        })
      },
      onSearch() {
        console.log(this.originDataList);
        this.dataList = this.originDataList.filter(item => item.happeningType.indexOf(this.searchKey) > -1);
      },
      // 前往 事项详情页面
      linkto(id) {
        this.$router.push('/index/itemdetail?id=' + id + '&qlId=' + this.id + '&type=' + this.type + '&qlName=' + this.qlName);
      },

      // 打印资料
      download(id) {
        this.$router.push('/index/downloads?id=' + id + '&qlId=' + this.id + '&type=' + this.type + '&qlName=' + this.qlName);

      },

      findMore(id) {
        autoDoFn(async () => {
          const res = await findMore({id});
          if (res && res.success) {
            this.dataList = res.data;
            this.originDataList = res.data;
          }
        })
      },
      returnBack() {
        // this.$router.back(-1);
        this.$router.push('/index/userguide')
      },
      returnHome() {
        // this.$router.back(-1);
        this.$router.push('/index/homepage')
      },
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
    }

    .searchBox .nameShow {
        height: 32px;
        line-height: 32px;
        vertical-align: bottom;
        font-size: 20px;
    }

    .resultBox .info {
        height: 32px;
        line-height: 32px;
        margin: 20px 0;
        position: relative;
        border-bottom: 1px solid #e5e5e5;
        padding-bottom: 50px;
        font-size: 16px;
    }

    .resultBox .info button {
        color: #fff;
    }

    .oneaction,
    .actions1,
    .actions {
        position: absolute;
        right: 0;
        top: 0;
    }

    .oneaction button {
        width: 186px;
        background: #eee;
    }

    .actions button:first-child {
        background: #41a5f8;
        margin-right: 10px;
    }

    .actions button:last-child {
        background: #fc9707;
    }
    .actions1 button:last-child {
        background: #41a5f8;
        width: 186px;
    }
</style>
