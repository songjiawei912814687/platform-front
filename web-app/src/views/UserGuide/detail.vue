<template>
  <div class="wrap-content" style="min-width:100px;">
    <div class="_detail-title">
      <a @click="returnBack">
        <a-icon type="left"/>返回
      </a>
    </div>

    <div class="infoBox">
      <div class="resBox">
        <div class="detail-label">事项名称：</div>
        <div class="detail-content">
          <p>{{resdata.name|| '无'}}</p>
        </div>
        <div class="detail-label">适用范围</div>
        <div class="detail-content">
          <p>
            涉及内容：
            <span>{{resdata.contentInvolve|| '无'}}</span>
          </p>
          <p>
            适用对象：
            <span>{{resdata.suitableName || '无'}}</span>
          </p>
        </div>
        <div class="detail-label">审批依据</div>
        <div class="detail-content">
          <p v-html="resdata.lawBasis || '无'"></p>
        </div>
        <a-table
          :columns="columns"
          :dataSource="tableList"
          :rowKey="record => String(record.id)"
          :pagination="false"
          :loading="loading"
          style="margin-top:20px"
        >
          <div slot="emptyTableFileName" slot-scope="text, record" class="downloads">
            <div class="actions" v-show="record.emptyTableFileName!==undefined">
              <a @click="download(record.emptyTableFileUrl)">[{{record.emptyTableFileName}}]</a>
            </div>
          </div>
          <div slot="exampleTableFileName" slot-scope="text, record" class="downloads">
            <div class="actions" v-show="record.exampleTableFileName!==undefined">
              <a @click="download(record.exampleTableFileUrl)">[{{record.exampleTableFileName}}]</a>
            </div>
          </div>
        </a-table>
        <div class="detail-label">受理机构</div>
        <div class="detail-content">
          <p>{{resdata.acpInstitution || '无'}}</p>
        </div>

        <div class="detail-label">办公时间</div>
        <div class="detail-content">
          <p>
            <span v-html="resdata.onTime"></span>
          </p>
        </div>

        <div class="detail-label">咨询电话</div>
        <div class="detail-content">
          <p>{{resdata.linkTel || '无'}}</p>
        </div>

        <div class="detail-label">办结时限</div>
        <div class="detail-content">
          <div class="detail-content">
            <p>
              办理时限：
              <span>{{resdata.limitInfo || '无'}}</span>
            </p>
            <!--<p>法定期限：<span>{{resdata.anticipateDay || '无'}}</span></p>-->
          </div>
        </div>

        <!--<div class="detail-label">申报材料</div>-->
        <!--<div class="detail-content">-->
        <!--<p><span v-html="resdata."></span></p>-->
        <!--</div>-->

        <div class="detail-label">办理方式</div>
        <div class="detail-content">
          <p>
            在线申请：
            <span>{{resdata.onlineApplication || '无'}}</span>
          </p>
          <p>
            窗口申请：
            <span>{{resdata.windowsApplication}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Breadcrumb, Icon, Table } from "ant-design-vue";

import { autoDoFn } from "@/utils/util";
import { findShiXList, download } from "@/remote/userguide";

export default {
  name: "index",
  components: {
    AButton: Button,
    AIcon: Icon,
    ABreadcrumb: Breadcrumb,
    ATable: Table
  },
  data() {
    return {
      id: "",
      resdata: "",
      tableList: [],
      loading: false,
      columns: [
        {
          title: "申报材料",
          dataIndex: "name",
          width: 300
        },
        {
          title: "材料形式",
          dataIndex: "materialFormName",
          width: 150
        }
      ]
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getData();
  },
  methods: {
    getData() {
      autoDoFn(async () => {
        const res = await findShiXList({
          id: this.id
        });
        if (res.success) {
          this.resdata = res.data;
          this.resdata.contentInvolve = this.resdata.contentInvolve.replace(
            "\u0000",
            ""
          );
          this.resdata.name = this.resdata.name
            ? this.resdata.name.replace("\u0000", "")
            : "无";
          this.resdata.windowsApplication = this.resdata.windowsApplication
            ? this.resdata.windowsApplication.replace("\u0000", "")
            : "无";
        }
      });
      autoDoFn(async () => {
        const res = await download({
          id: this.id
        });
        this.loading = false;
        if (res.success) {
          this.tableList = res.data;
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
  z-index: 9999;
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
