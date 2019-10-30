<template>
    <div class="content-wrap">
        <h2 class="content__title">考核报表</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item  label="查询时间：" :span="2">
              <a-range-picker  v-model="searchParams.searchTime" style="width: 100%" format="YYYY-MM-DD" :placeholder="['请选择时间', '请选择时间']"></a-range-picker>
            </search-box-item>
            <search-box-item label="组织名称：">
                <a-tree-select
                        style="width: 100%"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        :treeData="orgTreeData"
                        placeholder='请选择考核部门'
                        treeDefaultExpandAll
                        v-model="searchParams.organizationId"
                        :showSearch='true'
                        treeNodeFilterProp="title"
            />
            </search-box-item>
            <search-box-item label="姓名：">
                <a-input v-model="searchParams.name"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="exportExcel()" v-if="authorityActionList.indexOf('A_SYSTEM_ASSESSMENT_REPORT_EXPORT') > -1 || !useAuthority">导出</a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="tableList"
                     :loading="loading"
                     :scroll="scroll"
                     @change="onPageChange"
                     :rowKey="record => String(record.id)"
                     :pagination="pagination">
                 <span slot="action" slot-scope="text, record">
                    <template v-if="authorityActionList.indexOf('A_SYSTEM_ASSESSMENT_REPORT_VIEWMEMBERS') > -1|| !useAuthority">
                        <a href="javascript:;" @click="handleMembersShow(record)">查看详情</a>
                    </template>
                </span>
            </a-table>


            <div style="position: relative; left: 0px;top: -70px;width: 400px">
                <span style="margin: 20px 20px;">页/行</span>
                <a-select @change="onShowSizeChange" v-model="pagination.pageSize" style="width: 100px;margin: 20px 0;"
                          placeholder=''
                          :getPopupContainer="triggerNode => triggerNode.parentNode">
                    <a-select-option value = '10'>10/行</a-select-option>
                    <a-select-option value = '30'>30/行</a-select-option>
                    <a-select-option value = '50'>50/行</a-select-option>
                    <a-select-option value = '100'>100/行</a-select-option>
                </a-select>
                <span style="margin-left: 10px">共{{pagination.total}}条</span>
            </div>
            <a-drawer
                    title="查看详情"
                    :visible="membersVisible"
                    @close="() => handleDrawerToggle('membersVisible', false)"
                    :width="780"
            >
                <template slot="footer">
                    <a-button key="back" @click="handleDrawerToggle('membersVisible', false)">关闭</a-button>
                </template>
                <a-table :columns="membersColumns" :dataSource="membersData"
                         @change="onMembersPageChange"
                         :loading="membersLoading"
                         :rowKey="record => String(record.id)"
                         :pagination="membersPagination"></a-table>
            </a-drawer>

        </div>
    </div>
</template>

<script>
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
  Drawer,
} from 'ant-design-vue';
import { getReportPage, exportReportExcel} from '@/remote/staff';
import { getReport} from '@/remote/score';
import { getOrgTree } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import { autoDoFn, transformTree } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const {RangePicker} = DatePicker;
const membersColumns = [
    {
        title: '考核规则',
        dataIndex: 'ruleName',
        width: 100,
    },
    {
        title: '组织机构',
        dataIndex: 'organizationName',
        width: 100,
    },
    {
        title: '姓名',
        dataIndex: 'employeeName',
        width: 100,
    },
    {
        title: '记录时间',
        dataIndex: 'recordDateTime',
        width: 100,
    },
    {
        title: '扣分分值',
        dataIndex: 'value',
        width: 100,
    },
];


export default {
  name: 'Index',
  components: {
    AInput: Input,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    ATable: Table,
    AForm: Form,
    AFormItem: Item,
    ASelect: Select,
    ASelectOption: Option,
    ADatePicker: DatePicker,
    AUpload: Upload,
    AIcon: Icon,
    ADivider: Divider,
    ADrawer: Drawer,
    APopconfirm: Popconfirm,
    ATreeSelect: TreeSelect,
    AMonthPicker: MonthPicker,
    ARangePicker: RangePicker,
    SearchBox,
    SearchBoxItem,
  },
  data() {
    return {
        columns: [
            {
                title: '姓名',
                dataIndex: 'name',
                width: 300,
            },
            {
                title: '组织机构',
                dataIndex: 'organizationName',
                width: 300,
            },
            {
                title: '扣分总值',
                dataIndex: 'toltal',
                width: 300,
            },
            {
                title: '操作',
                key: 'action',
                width:450,
                scopedSlots: { customRender: 'action' },
            },
        ],
      addVisible: false,
      modifyId: '',
      data: [],
     membersColumns,
      membersData: [],
      viewVisible: false,
      membersVisible: false,
      membersLoading: false,
      searchParams: {
          searchTime: [],
      },
      loading: false,
      tableList: [],
      monthList: [],
      orgTreeData: [],
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1000,
      },
        pageSizeOptions: [10, 20, 30, 40, 50],
        pagination: {
            pageSize: 10,
            defaultCurrent: 1,
            total: 0,
            rows: 10,
            page: 1,
        },
        membersPagination: {
            defaultCurrent: 1,
            total: 0,
            row: 10,
            page: 0,
        },
        orgId: '',
      authorityActionList: window.authorityActionList,
      useAuthority: window.defaultConfig.useAuthority,
    };
  },
  created() {
    this.initBaseData();
    this.initList();
  },
  methods: {
      onShowSizeChange() {
          this.pagination.rows = this.pagination.pageSize
          this.pagination.page = 1
          this.initList()
      },
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getReportPage({
          ...this.searchParams,
          ...this.pagination,
            startTime: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
            endTime:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
        });
        if (res) {
          this.tableList = res.data;
          this.pagination.total = res.data.length;
        }
        this.loading = false;
      });
    },
    initBaseData() {
      const that = this;
      autoDoFn(async () => {
        const orgRes = await getOrgTree();
        if (orgRes) {
          that.orgTreeData = transformTree(orgRes.data);
        }
      });
    },
      getReport() {
          autoDoFn(async () => {
              this.membersLoading = true;
              const res = await getReport({
                  employeesId: this.orgId,
                  state:2,
                  ...this.membersPagination,
                  ...this.searchParams,
                  startTime: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
                  endTime:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
              });
              if (res) {
                  this.membersData = res.data.list;
                  this.membersPagination.total = res.data.total;
                  this.membersPagination.page = res.data.pageNum;
                  this.membersPagination.row = res.data.pageSize;
              }
              this.membersLoading = false;
          });
      },
      handleMembersShow(data) {
          this.orgId = data.id;
          this.$nextTick(() => {
              this.getReport();
              this.handleDrawerToggle('membersVisible', true);
          });
      },
      onMembersPageChange(pagination) {
          this.membersPagination.page = pagination.current;
          this.$nextTick(() => {
              this.getReport();
              this.handleDrawerToggle('membersVisible', true);
          });
      },
    handleViewShow(rowData) {
      this.handleDrawerToggle('viewVisible', true);
      this.modifyId = rowData.id;
    },
      handleDrawerToggle(type, isVisible) {
          this[type] = isVisible;
          if (!isVisible) {
              this.modifyId = '';
          }
      },
    exportExcel() {
      autoDoFn(async () => {
        const res = await exportReportExcel({
          ...this.searchParams,
            startTime: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
            endTime:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
        });
        if (res) {
          window.open(`${res.data}`, '_blank');
        }
      });
    },
    handleSearch() {
      this.initList();
    },
    handleReset() {
      this.searchParams = {
        organizationId: '',
        name:'',
        searchTime: [],

      };
      this.pagination= {
            pageSize: 10,
            defaultCurrent: 1,
            total: 0,
            rows: 10,
            page: 0,
        };
      this.$nextTick(() => {
        this.initList();
      });
    },
    onPageChange(pagination) {
      this.pagination.page = pagination.current;
      this.$nextTick(() => {
      });
    },
  },
};
</script>

<style lang="less">
    .gkp-search-box {
        overflow: visible !important;
    }

    .monthPicker .ivu-date-picker-header {
        display: none !important;
    }
</style>
