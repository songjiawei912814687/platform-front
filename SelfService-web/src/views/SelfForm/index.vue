<template>
  <div class="content-wrap">
    <div class="nowposition">
      <span class="titles">当前位置：</span>
      <a-breadcrumb :routes="routes" separator=">">
        <template slot="itemRender" slot-scope="{route, params, routes, paths}">
          <span v-if="routes.indexOf(route) === routes.length - 1">{{route.breadcrumbName}}</span>
          <router-link v-else :to="paths.join('/')">{{route.breadcrumbName}}</router-link>
        </template>
      </a-breadcrumb>
      <a-button type="default" class="returnBack" @click="returnBack">返回</a-button>
    </div>
    <div class="searchBox">
      <div class="btnSearch">
        <div v-if="status === 'search'">
          <a-button @click="searchCancel">取消搜索</a-button>
        </div>
        <div v-else>
          <a-button :class="[nowBtn=='ishot'?'activeBtn':'']">自助填单表</a-button>
        </div>
      </div>
      <div class="keySearch">
        <a-input-search
          v-model.trim="searchKey"
          @search="findFormsByName"
          enterButton="搜索"
          placeholder="请输入关键字搜索"
        />
      </div>
      <hr class="lines" />
    </div>
    <div class="infoBox" style="padding: 150px 30px 130px;">
      <div class="resultBox">
        <div class="info" v-for="(item, index) in dataList" :key="index" @click="getDetail(item)">
          <span>{{item.name}}</span>
          <i class="visible"></i>
        </div>
      </div>
    </div>
  </div>
</template>

 <script>
import { Input, Button, Breadcrumb } from "ant-design-vue";

const { Search } = Input;

import { autoDoFn } from "@/utils/util";

const typeList = {
  ishot: 1,
  isdepart: 2,
  istheme: 3,
  search: 4
};

export default {
  name: "index",
  components: {
    AInputSearch: Search,
    AButton: Button,
    ABreadcrumb: Breadcrumb
  },
  data() {
    return {
      nowBtn: "ishot",
      searchKey: "",
      dataList: [{ name: "建设工程规划许可证", url: "/index/firstForm" },
          { name: "基本医疗保险参保人员长住外地就医备案表", url: "/index/secondForm" },
          { name: "基本医疗保险参保人员享受规定(特殊慢性)病种待遇备案表", url: "/index/thirdForm" },
          { name: "生育保险待遇申请表", url: "/index/fourthForm" },
      ], //数据列表
      originDataList: [], //搜索前的原本数组
      routes: [
        {
          path: "../index/homepage",
          breadcrumbName: "首页"
        },
        {
          path: "/index/selfform",
          breadcrumbName: "自助填单"
        }
      ],
      status: ""
    };
  },
  created() {},

  methods: {
    getDetail(item) {
      this.$router.push(item.url);
    },
    returnBack() {
      // this.$router.back(-1);
      this.$router.push("/index/selfform");
    }
  }
};
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
  border: 1px solid #41a5f8;
  float: left;
  margin-right: 20px;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  margin-bottom: 20px;
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

