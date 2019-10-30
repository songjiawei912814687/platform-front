<template>
  <div class="content-wrap">
    <div class="searchBox">
      <div class="keySearch">
        <a-input-search
          v-model.trim="searchKey"
          @search="onSearch"
          enterButton="搜索"
          placeholder="请输入关键字搜索"
        />
      </div>

      <div class="btnSearch">
        <button :class="active === 'mini' ? 'activeBtn' : ''" @click="switchActive('mini')">最小颗粒化事项</button>
        <button :class="active === 'hot' ? 'activeBtn' : ''" @click="switchActive('hot')">热门事项</button>
      </div>
    </div>

    <div class="content">
      <div class="tab-content" v-show="active === 'mini'">
        <mt-cell
          v-for="(item, index) in departList"
          :key="index"
          :to="'/index/itemlist?id=' + item.id + '&name=' + item.name + '&type=' + typeList[active]"
          is-link
          :title="item.name"
          @click="getDetail(item.id)"
        ></mt-cell>
      </div>
      <div class="tab-content" v-show="active === 'hot'">
        <mt-cell
          v-for="(item, index) in departList"
          :key="index"
          :to="'/index/itemlist?id=' + item.id + '&name=' + item.name + '&type=' + typeList[active]"
          is-link
          :title="item.name"
          @click="getDetail(item.id)"
        ></mt-cell>
      </div>
    </div>
  </div>
</template>

<script>
import { Input, Button, Breadcrumb } from "ant-design-vue";

const { Search } = Input;

import { autoDoFn } from "@/utils/util";
import { findOrganizationList, findHangPageList } from "@/remote/userguide";
const typeList = {
  mini: 1,
  hot: 2
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
      active: "mini",
      searchKey: "",
      departList: [], //数据列表
      typeList,
      departOriginList: [], //搜索前的原本数组
      themeOriginList: [] //搜索前的原本数组
    };
  },
  created() {
    this.getDepartData();
    this.getThemeData();
  },

  methods: {
    // 按部门
    getDepartData() {
      autoDoFn(async () => {
        const res = await findOrganizationList({});
        if (res && res.success) {
          this.departList = res.data;
          this.departOriginList = [...res.data];
        }
      });
    },
    onSearch() {
      this[this.active + "List"] = this[this.active + "OriginList"].filter(
        item => item.name.indexOf(this.searchKey) > -1
      );
    },
    getDetail(id) {
      this.$router.push(
        "/index/itemlist?id=" + id + "&type=" + typeList[this.active]
      );
    },
    returnBack() {
      this.$router.back(-1);
    },
    switchActive(value) {
      this.active = value;
    }
  }
};
</script>

<style scoped lang="less">
.content-wrap {
  padding: 10px;
}
.searchBox {
  position: relative;
}
.btnSearch {
  padding-top: 10px;
  button {
    width: 50%;
    border: none;
    border-bottom: 2px solid #ddd;
    border-radius: 0;
    outline: none;
    background-color: #fff;
    line-height: 40px;
    &.activeBtn {
      border-bottom: 2px solid #41a5f8;
      color: #41a5f8;
    }
  }
}
.content {
  height: calc(100% - 100px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

