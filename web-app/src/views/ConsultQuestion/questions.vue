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

    <div class="content">
      <div class="tab-content">
        <mt-cell
          v-for="(item, index) in questions"
          :key="index"
          :to="'/index/consultdetail?id=' + item.id"
          is-link
          :title="item.title"
        ></mt-cell>
      </div>
    </div>
  </div>
</template>

<script>
import { Input, Button, Breadcrumb } from "ant-design-vue";

const { Search } = Input;

import { autoDoFn } from "@/utils/util";
import { findPageList } from "@/remote/consultquestion";
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
      questions: [],
      searchKey: ""
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      autoDoFn(async () => {
        const res = await findPageList({
          organizationId: this.$route.query.organizationId,
          type: this.$route.query.type
        });
        if (res && res.success) {
          this.dataList = res.data;
          this.questions = this.dataList;
        }
      });
    },
    onSearch() {
      let _searchKey = this.searchKey;
      let _dataList = [];
      this.dataList.forEach((item, index) => {
        if (item.title.indexOf(_searchKey) > -1) {
          _dataList.push(item);
        }
      });
      this.questions = _dataList;
      console.log(this.questions);
    },
    returnBack() {
      this.$router.back(-1);
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

