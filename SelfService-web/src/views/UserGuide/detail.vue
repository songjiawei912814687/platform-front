<template>
  <div class="wrap-content detailBox" style="min-width:100px;">
    <div class="nowposition">
      <a-breadcrumb :routes="routes" separator=">">
        <template slot="itemRender" slot-scope="{route, params, routes, paths}">
          <span v-if="routes.indexOf(route) === routes.length - 1">{{route.breadcrumbName}}</span>
          <router-link v-else :to="paths.join('/')">{{route.breadcrumbName}}</router-link>
          <!-- <span>
                        {{route.breadcrumbName}}
          </span>-->
        </template>
      </a-breadcrumb>
      <a-button type="default" class="returnBack" @click="returnBack">返回</a-button>
      <a-button type="default" class="returnBack" @click="returnHome">首页</a-button>
    </div>

    <div class="infoBox">
      <div class="resBox">
        <div class="detail-label">事项名称：</div>
        <div class="detail-content">
          <p>{{resdata.name || '无'}}</p>
        </div>
        <div class="detail-label">适用范围</div>
        <div class="detail-content">
          <p>
            涉及内容：
            <span>{{resdata.contentInvolve || '无'}}</span>
          </p>
          <p>
            适用对象：
            <span>{{resdata.suitableName || '无'}}</span>
          </p>
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
            <span>{{resdata.windowsApplication || '无'}}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="footer-info">
      <Button class="download-button" :loading="downloadLoading" @click="downloadThisPage">下载打印本指南</Button>
      <p class="download-info">材料空白表、示例表，请在"打印资料"中单独下载打印</p>
    </div>
  </div>
</template>

<script>
import { Button, Breadcrumb, Tabs, Table } from "ant-design-vue";

const { TabPane } = Tabs;

import { autoDoFn } from "@/utils/util";
import { findShiXList, downLoadMessage, download } from "@/remote/userguide";
import print from "print-js";

const columns = [
  {
    title: "申报材料",
    dataIndex: "name",
    width: 300
  },
  // {
  //     title: '材料出具单位',
  //     dataIndex: 'materialFormName',
  //     width: 150,
  // },
  {
    title: "材料形式",
    dataIndex: "materialFormName",
    width: 150
  }
];

export default {
  name: "index",
  components: {
    AButton: Button,
    ABreadcrumb: Breadcrumb,
    ATabs: Tabs,
    ATabPane: TabPane,
    ATable: Table
  },
  data() {
    return {
      id: "",
      type: 1,
      resdata: "",
      downloadLoading: false,
      tableList: [],
      columns: columns,
      routes: [
        {
          path: "../../../index/homepage",
          breadcrumbName: "首页"
        },
        {
          path: "../../../index/userguide",
          breadcrumbName: "事项指南"
        },
        {
          path:
            "../../../index/itemlist?id=" +
            this.$route.query.qlId +
            "&type=" +
            this.$route.query.type +
            "&qlName=" +
            this.$route.query.qlName,
          breadcrumbName: "事项列表"
        },
        {
          path: "../../index/itemdetail",
          breadcrumbName: "事项详情"
        }
      ],
      nowIndex: 1
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.qlId = this.$route.query.qlId;
    this.type = this.$route.query.type;
    this.qlName = this.$route.query.qlName;
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
      // this.$router.back(-1);
      this.$router.push(
        "/index/itemlist?id=" +
          this.qlId +
          "&type=" +
          this.type +
          "&qlName=" +
          this.qlName
      );
    },
    returnHome() {
      // this.$router.back(-1);
      this.$router.push("/index/homepage");
    },

    changeIndex(nowIndex) {
      this.nowIndex = nowIndex;
    },

    overShow(nowIndex) {
      this.nowIndex = nowIndex;
    },

    downloadThisPage() {
      autoDoFn(async () => {
        this.downloadLoading = true;
        const res = await downLoadMessage({
          id: this.id
          // 'id': 165,
        });
        if (res.success) {
          if (res.data) {
            const imageArr = ["JPG", "JPEG", "PNG", "GIF"];
            let type = "pdf";
            const nameArr = res.data.split(".");
            if (
              imageArr.indexOf(nameArr[nameArr.length - 1].toUpperCase()) > -1
            ) {
              type = "image";
            }
            print({
              printable: `/${res.data}`,
              type
            });
          }
        }
        this.downloadLoading = false;
      });
    }
  }
};
</script>

<style lang="less">
.ant-table-thead > tr > th {
  background: #159bd4;
  color: #fff;
  font-size: 14px;
}
.detailBox .ant-layout-content {
  overflow-y: scroll;
}

.detailBox .infoBox .titles {
  color: #4088c7;
  font-size: 16px;
  text-align: center;
}

.detailBox {
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
    position: sticky;
    width: 100%;
    bottom: 0px;
    background: #ffffff;
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

.detailBox .resBox table {
  width: 100%;
}

.detailBox .resBox table td {
  border: 1px solid #dbe9f4;

  padding: 10px 15px;
}

.detailBox .resBox table .first,
.detailBox .resBox table .third {
  background-color: rgb(233, 242, 249);
}

.detailBox .resBox table .threeCols {
  color: rgb(161, 161, 161);
}

.detailBox .resBox table .threeCols span {
  color: rgb(61, 61, 61);
}

.detailBox .tabBox {
  width: 100%;
  margin-top: 20px;
  border-top: 2px solid #469ef7;
}

.detailBox .tabBox table {
  width: 100%;
}

.detailBox .tabBox table tr {
  border: 0 !important;
  border-top: 1px solid #e8e8e8 !important;
  background: #e9f0f6 !important;
}

.detailBox .tabBox td.active {
  background: #fff !important;
}

.detailBox .tabBox table tr:last-child {
  min-height: 200px;
  border: 0 !important;
}

.detailBox .tabBox td {
  min-width: 100px;
  width: 16.6%;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  line-height: 40px;
}
</style>
