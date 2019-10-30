<template>
  <div>
    <div class="_title">
      <a @click="handleAddSuccess">
        <a-icon type="plus" />请假申请
      </a>
      <h1>请假记录</h1>
    </div>
    <div style="padding-top:70px ">
      <!--<a-table-->
        <!--:columns="columns"-->
        <!--:dataSource="dataList"-->
        <!--:loading="loading"-->
        <!--:rowKey="record => String(record.id)"-->
        <!--:pagination="false"-->
        <!--style="font-size: 16px"-->
      <!--&gt;-->
        <!--<span-->
          <!--slot="applicationType"-->
          <!--slot-scope="text, record"-->
        <!--&gt;{{applicationTypeArr[record.applicationType]}}</span>-->
        <!--<span slot="action" slot-scope="text, record">-->
          <!--<a href="javascript:;" @click="handleViewShow(record)" style="font-size: 15px">查看</a>-->
        <!--</span>-->
      <!--</a-table>-->

      <a-table :columns="columns"
               :dataSource="dataList"
               :loading="loading"
               :scroll="scroll"
               @change="onPageChange"
               :rowKey="record => String(record.id)"
               :pagination="pagination">
        <span slot="startTime" slot-scope="text, record">{{record.startDate + ' ' + record.startTime}}</span>
        <span slot="endTime" slot-scope="text, record">{{record.endDate + ' ' + record.endTime}}</span>
        <span slot="applicationType"
              slot-scope="text, record">{{applicationTypeArr[record.applicationType]}}</span>
        <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)">查看</a>
                </span>
      </a-table>
      <div style="position: relative; left: 0px;top: -50px;width: 80px">
        <!--<span style="margin: 10px 10px;">页/行</span>-->
        <!--<a-select @change="onShowSizeChange" v-model="pagination.pageSize" style="width: 40px;margin: 20px 0;"-->
                  <!--:getPopupContainer="triggerNode => triggerNode.parentNode">-->
          <!--<a-select-option value = '10'>10/行</a-select-option>-->
          <!--<a-select-option value = '30'>30/行</a-select-option>-->
          <!--<a-select-option value = '50'>50/行</a-select-option>-->
          <!--<a-select-option value = '100'>100/行</a-select-option>-->
        <!--</a-select>-->
        <span style="margin-left: 5px;font-size: 15px">共{{pagination.total}}条</span>
      </div>
    </div>
    <!--<detail-view :viewVisible="viewVisible"-->
                 <!--:modifyId="modifyId"-->
                 <!--:applicationTypeArr="applicationTypeArr"-->
                 <!--:handleClose="() => handleDrawerToggle('viewVisible', false)">-->
    <!--</detail-view>-->
  </div>
</template>

<script>
import Vue from "vue";
import Add from "./Add";
import moment from "moment";
import { getPage } from "@/remote/leave";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Form,
  Select,
  DatePicker,
  Upload,
  Icon,
  Divider,
  Popconfirm,
  TreeSelect,
  Card
} from "ant-design-vue";
import { autoDoFn, transformTree3,transformTree } from "@/utils/util";
import DetailView from "./DetailView";
import {getOrgTree} from '@/remote/base';
const { Item } = Form;
const { Option } = Select;
const applicationTypeArr = [
  "",
  "临时外出二小时公事",
  "哺乳假",
  "",
  "产假",
  "年休假",
  "因公外出",
  "事假",
  "病假",
  "",
  "临时外出二小时私事",
  "婚假",
  "探亲假",
  "陪产假",
  "丧假"
];
export default {
  name: "Index",
  components: {
    AInput: Input,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    ATable: Table,
    AForm: Form,
    ASelect: Select,
    ASelectOption: Option,
    ADatePicker: DatePicker,
    AUpload: Upload,
    AIcon: Icon,
    ADivider: Divider,
    APopconfirm: Popconfirm,
    ATreeSelect: TreeSelect,
    ACard: Card,
    DetailView,
    Add
  },
  data() {
    return {
      loading: false,
      modifyId: "",
      addVisible: false,
      viewVisible: false,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头

      columns: [
        {
          title: "请假类型",
          dataIndex: "applicationType",
            width: "80px",
          scopedSlots: { customRender: "applicationType" }
        },
        {
          title: "状态",
          key: "statusName",
          dataIndex: "statusName",
            width: "80px",

        },
        {
          title: "操作",
          dataIndex: "action",
          width: "80px",
          scopedSlots: { customRender: "action" }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      dataList: [],
      TreeData: [],
      selectedRowKeys: [],
      selectedRows: [],
      pageSizeOptions: [10, 20, 30, 40, 50],
      pagination: {
          pageSize: '10',
          defaultCurrent: 1,
          total: 0,
          rows: 10,
          page: 0,
      },
      // custom table alert & rowSelection
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = [];
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },

        scroll: {
            y: document.documentElement.clientHeight - 360,
            // x: 1000,
        },
      optionAlertShow: false,
      applicationTypeArr
    };
  },
  created() {
    this.initList();
  },
  methods: {
      onShowSizeChange() {
          this.pagination.rows = this.pagination.pageSize
          this.initList()
      },
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        // let res = Vue.ls.get("applicationList");
        // if (Vue.ls.get("applicationList") === undefined) {
        //   console.log("2222");
        //   res = await getPage({ ...this.queryParam, ...this.pagination });
        //   Vue.ls.set("applicationList", res);
        // }
          const res = await getPage({
              ...this.pagination,
          });
        if (res) {
          this.dataList = res.data.list;
          this.pagination.total = res.data.total;
          this.pagination.page = res.data.pageNum;
          this.pagination.row = res.data.pageSize;
        }
        this.loading = false;
      });
    },
    handleViewShow(rowData) {
      rowData.applicationTypeName = this.applicationTypeArr[
        rowData.applicationType
      ];
      this.$router.push({
        name: `leavedetail`,
        query: {
          modifyId: rowData.id,
          rowData: rowData
        }
      });
      this.modifyId = rowData.id;
    },
    handleModifyShow(rowData) {
      this.$router.push({
        name: `leaveadd`
      });
      this.modifyId = rowData.id;
    },
    handleAddSuccess() {
      this.$router.push({
        name: `leaveadd`
      });
      this.initList();
    },
    handleDrawerToggle(type, isVisible) {
      this[type] = isVisible;
      if (!isVisible) {
        this.modifyId = "";
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
      onPageChange(pagination) {
          this.pagination.page = pagination.current;
          this.$nextTick(() => {
              this.initList();
          });
      },
    handleReset() {
      this.queryParam = {
        username: ""
      };
      this.pagination = {
        pageSize: 10,
        row: 10,
        current: 0
      };
      this.$nextTick(() => {
        this.initList();
      });
    }
  }
};
</script>
<style lang="less">
._title {
  line-height: 70px;
  height: 70px;
  font-size: 16px;
  padding: 0 10px;
  text-align: center;
  position: fixed;
  background-color: #fff;
  width: 100%;
  z-index: 999;
  a {
    display: block;
    position: absolute;
    top: 0;
    left: 10px;
    font-size: 16px;
  }
  h1 {
    font-size: 28px;
    color: #777;
    overflow: hidden;
    padding: 0 70px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
