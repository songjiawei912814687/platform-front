<template>
  <div class="content-wrap">
    <div class="title">
      <a @click="returnBack">
        <a-icon type="left"/>返回
      </a>
      <h1>{{name}}</h1>
    </div>

    <div class="resultBox">
      <a-spin :spinning="loading">
        <mt-cell
          v-for="(item, index) in dataList"
          :key="index"
          @click.native="linkto(item)"
          is-link
          :title="item.happeningType"
        ></mt-cell>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { Icon, Spin } from "ant-design-vue";

import { autoDoFn } from "@/utils/util";
import { findMiniPageList, findMore } from "@/remote/userguide";

export default {
  name: "index",
  components: {
    AIcon: Icon,
    ASpin: Spin
  },
  data() {
    return {
      id: "",
      type: 2,
      nowName: "", //名称
      name: "",
      searchKey: "",
      dataList: [],
      originDataList: [], //搜索前的原本数组
      loading: false,
      routes: [
        {
          path: "../../index/homepage",
          breadcrumbName: "首页"
        },
        {
          path: "../../index/userguide",
          breadcrumbName: "事项指南"
        },
        {
          path: "../../index/itemlist",
          breadcrumbName: "事项列表"
        }
      ]
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    this.name = this.$route.query.name;
    this.getData();
  },
  methods: {
    getData() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await findMiniPageList({
          id: this.id,
          type: this.type
        });
        if (res && res.success) {
          this.dataList = res.data;
          this.originDataList = res.data;
        }
        this.loading = false;
      });
    },
    onSearch() {
      let _searchKey = this.searchKey;
      let _dataList = [];
      this.dataList = JSON.parse(JSON.stringify(this.originDataList));
      this.dataList.forEach((item, index) => {
        if (item.qlNames.indexOf(_searchKey) > -1) {
          _dataList.push(item);
        }
      });
      this.dataList = _dataList;
    },
    // 前往 事项详情页面
    linkto(item) {
      if (item.hashChild) {
        this.findMore(item.id);
      } else {
        this.$router.push(
          "/index/itemdetail?id=" + item.id + "&type=" + this.type
        );
      }
    },

    // 打印资料
    download(id) {
      this.$router.push("/index/downloads?id=" + id + "&type=" + this.type);
    },

    findMore(id) {
      autoDoFn(async () => {
        const res = await findMore({ id });
        if (res && res.success) {
          this.dataList = res.data;
          this.originDataList = res.data;
        }
      });
    },

    returnBack() {
      this.$router.back(-1);
    }
  }
};
</script>

<style scoped lang="less">
.mint-cell {
  margin-top: 6px;
}
.title {
  line-height: 50px;
  height: 50px;
  font-size: 12px;
  padding: 0 10px;
  text-align: center;
  width: 100%;
  position: fixed;
  z-index: 99;
  background-color: #fff;
  a {
    display: block;
    position: absolute;
    top: 0;
    left: 10px;
  }
  h1 {
    font-size: 16px;
    color: #777;
    overflow: hidden;
    padding: 0 50px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.resultBox {
  width: 100%;
  height: 100%;
  padding-top: 50px;
}
.ant-spin-spinning {
  width: 100%;
  height: 100%;
  padding-top: 100px;
}
</style>
