<template>
  <div class="wrap-content" style="min-width:100px;">
    <div class="_detail-title">
      <a @click="returnBack">
        <a-icon type="left"/>返回
      </a>
    </div>

    <div class="infoBox">
      <div class="resBox">
        <div class="detail-label">问题：</div>
        <div class="detail-content">
          <p>{{title || ''}}</p>
        </div>
        <div class="detail-label">答案：</div>
        <div class="detail-content">
          <p>{{description || ''}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Breadcrumb, Icon } from "ant-design-vue";

import { autoDoFn } from "@/utils/util";
import { get } from "@/remote/consultquestion";

export default {
  name: "detail",
  components: {
    AButton: Button,
    ABreadcrumb: Breadcrumb,
    AIcon:Icon,
  },
  data() {
    return {
      id: "",
      title: "",
      description: ""
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getData();
  },
  methods: {
    getData() {
      autoDoFn(async () => {
        const res = await get({
          id: this.id
        });
        this.loading = false;
        if (res.success) {
          this.title = res.data.title;
          this.description = res.data.description;
        }
      });
    },
    returnBack() {
      this.$router.back(-1);
    }
  }
};
</script>

<style lang="less" scoped>
._detail-title {
  line-height: 50px;
  height: 50px;
  font-size: 12px;
  padding: 0 10px;
  text-align: center;
  position: fixed;
  background-color: #fff;
  width: 100%;
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
/*._detail-resultBox{
        .mint-cell-title{
            flex: none;
        }
        .mint-cell-value{
            text-align: left;
            color: #1890ff;
        }
    }*/

.infoBox {
  padding-top: 50px;
  .resBox {
    .detail-label {
      background-color: #159bd4;
      color: #fff;
      padding-left: 15px;
      font-size: 14px;
      line-height: 30px;
    }
    .detail-content {
      background-color: #fff;
      > p {
        font-size: 14px;
        line-height: 25px;
        min-height: 25px;
        padding-left: 15px;
        margin-bottom: 2px;
        background-color: #e9e9e9;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .footer-info {
    text-align: center;
    padding-top: 20px;
    .download-button {
      display: inline-block;
      width: 80%;
      background-color: #ff6600;
      color: #fff;
      font-size: 16px;
      line-height: 35px;
      border: none;
    }
    .download-info {
      color: #1890ff;
      font-size: 12px;
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>