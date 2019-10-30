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
    </div>
    <div class="btnSearch">
      <button :class="active === 'depart' ? 'activeBtn' : ''" @click="switchActive('depart')">按部门</button>
      <button :class="active === 'type' ? 'activeBtn' : ''" @click="switchActive('type')">按类型</button>
    </div>
    <div class="content">
      <div class="tab-content" v-show="active === 'depart'">
        <mt-cell
          v-for="(item, index) in organizations"
          :key="index"
          :to="'/index/questions?organizationId=' + item.organizationId"
          is-link
          :title="item.organizationName"
        ></mt-cell>
      </div>
      <div class="tab-content" v-show="active === 'type'">
        <mt-cell
          v-for="(item, index) in typesData"
          :key="index"
          :to="'/index/questions?type=' + item.type"
          is-link
          :title="item.name"
        ></mt-cell>
      </div>
    </div>
  </div>
</template>

<script>
import { Input, Button, Breadcrumb } from "ant-design-vue";

const { Search } = Input;

import { autoDoFn } from "@/utils/util";
import { getOrganizations } from "@/remote/consultquestion";
import {
  findQlPageList,
  findOrganizationList,
  findHangPageList
} from "@/remote/userguide";

export default {
  name: "index",
  components: {
    AInputSearch: Search,
    AButton: Button,
    ABreadcrumb: Breadcrumb
  },
  data() {
    return {
      dataList: [],
      organizations: [],
      types: [
        { type: "23", name: "项目审批类" },
        { type: "24", name: "企业开办类" },
        { type: "25", name: "个人办事类" },
        { type: "155", name: "其他类" }
      ],
      typesData: [
        { type: "23", name: "项目审批类" },
        { type: "24", name: "企业开办类" },
        { type: "25", name: "个人办事类" },
        { type: "155", name: "其他类" }
      ],
      searchKey: "",
      active: "depart"
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      autoDoFn(async () => {
        const res = await getOrganizations({
          organizationName: ""
        });
        if (res && res.success) {
          this.dataList = res.data;
          this.organizations = this.dataList;
        }
      });
    },
    onSearch() {
      let _searchKey = this.searchKey;
      let _dataList = [];
      if (_searchKey === "depart") {
        this.dataList.forEach((item, index) => {
          if (item.organizationName.indexOf(_searchKey) > -1) {
            _dataList.push(item);
          }
        });
        this.organizations = _dataList;
      } else {
        this.types.forEach((item, index) => {
          if (item.name.indexOf(_searchKey) > -1) {
            _dataList.push(item);
          }
        });
        this.typesData = _dataList;
      }
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
.mint-cell {
  margin-top: 6px;
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

