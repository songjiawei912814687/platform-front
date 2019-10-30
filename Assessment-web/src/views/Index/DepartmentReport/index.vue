<template>
    <div class="content-wrap">
        <h2 class="content__title">部门考核报表</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="年：">
                <DatePicker type="year" v-model="searchParams.year"
                            placeholder="请选择年" style="width: 100%"></DatePicker>
            </search-box-item>
            <search-box-item label="月：" class="monthPicker">
                <a-month-picker dropdownClassName="monthPickerClass"
                                v-model="searchParams.month" format="MM" placeholder="请选择月" style="width: 100%"/>
            </search-box-item>
            <search-box-item label="组织名称：">
                <a-tree-select
                        style="width: 100%"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        :treeData="orgTreeData"
                        showSearch
                        treeNodeFilterProp="title"
                        placeholder='请选择考核部门'
                        treeDefaultExpandAll
                        v-model="searchParams.organizationId"
                />
            </search-box-item>
            <!--<search-box-item label="组织名称：">-->
                <!--<a-input v-model="searchParams.organizationName" placeholder="请输入组织名称"/>-->
            <!--</search-box-item>-->
        </search-box>
        <div class="action">
            <!--<a-button @click="handleDrawerToggle('addVisible', true)" >录入</a-button>-->
            <a-button @click="exportExcel()" v-if="authorityActionList.indexOf('A_ASSESSMENT_DEPARTMENTREPORT_EXPORT') > -1 || !useAuthority">导出</a-button>
            <a-button @click="exportbanjianExcel()" v-if="authorityActionList.indexOf('A_ASSESSMENT_DEPARTMENTREPORT_BANJIANEXPORT') > -1 || !useAuthority" >导出办件量</a-button>
            <a-button @click="exportliangbanExcel()" v-if="authorityActionList.indexOf('A_ASSESSMENT_DEPARTMENTREPORT_LIANFBANEXPORT') > -1 || !useAuthority">导出联办率</a-button>
            <a-button @click="exportshixianExcel()" v-if="authorityActionList.indexOf('A_ASSESSMENT_DEPARTMENTREPORT_SHIXIANGEXPORT') > -1 || !useAuthority">导出五办实现率</a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="tableList"
                     :loading="loading"
                     :scroll="scroll"
                     @change="onPageChange"
                     :rowKey="record => String(record.id)"
                     :pagination="pagination">
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
} from 'ant-design-vue';
import { getPage, exportExcel,banjianexportExcel,liangbanexportExcel,shixianexportExcel } from '@/remote/departmentReport';

import { getOrgTree } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import { autoDoFn, transformTree } from '@/utils/util';
import moment from 'moment';

const { Item } = Form;
const { Option } = Select;
const { MonthPicker } = DatePicker;



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
    APopconfirm: Popconfirm,
    ATreeSelect: TreeSelect,
    AMonthPicker: MonthPicker,
    SearchBox,
    SearchBoxItem,
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          customRender:(text, row, index)=>`${index + 1+this.pagination.pageSize*(this.pagination.page-1)}`,
          width: 100,
        },
        {
          title: '组织机构',
          dataIndex: 'organizationName',
          width: 300,
        },
        {
          title: '人均办件量',
          dataIndex: 'doThings',
          width: 250,
        },
        {
          title: '一窗受理率',
          dataIndex: 'windowAccept',
          width: 250,
        },
        {
          title: '网上申报率',
          dataIndex: 'onlineReporting',
          width: 250,
        },
        {
          title: '事项联办率',
          dataIndex: 'matterSeec',
          width: 250,
        },
        {
          title: '资料精简率',
          dataIndex: 'dataCompaction',
          width: 250,
        },
        {
          title: '中介服务率',
          dataIndex: 'intermediaryService',
          width: 250,
        },
        {
          title: '群众满意率',
          dataIndex: 'peopleSatisfaction',
          width: 250,
        },
        {
          title: '工作纪律',
          dataIndex: 'jobLogging',
          width: 200,
        },
        {
          title: '办理规范',
          dataIndex: 'transactNorm',
          width: 200,
        },
        {
          title: '创新工作',
          dataIndex: 'innovationWork',
          width: 200,
        },
        {
          title: '当月指数',
          dataIndex: 'mouthIndex',
          width: 200,
        },
      ],
      addVisible: false,
      modifyId: '',
      data: [],
      viewVisible: false,
      searchParams: {
        year: new Date(moment().subtract(1, 'months').valueOf()),
        month: moment().subtract(1, 'months'),
        organizationName: '',
      },
      loading: false,
      tableList: [],
      yearList: [],
      monthList: [],
      departmentList: [],
      staffList: [],
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
        const res = await getPage({
          ...this.searchParams,
          ...this.pagination,
          year: this.searchParams.year ? moment(this.searchParams.year).format('YYYY') : '',
          month: this.searchParams.month ? this.searchParams.month.format('MM') : '',
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
    handleModifyShow(rowData) {
      this.handleDrawerToggle('addVisible', true);
      this.modifyId = rowData.id;
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
    handleAddSuccess() {
      this.handleDrawerToggle('addVisible', false);
      this.initList();
    },
    exportExcel() {
      autoDoFn(async () => {
        const res = await exportExcel({
          ...this.searchParams,
          year: this.searchParams.year ? moment(this.searchParams.year).format('YYYY') : '',
          month: this.searchParams.month ? this.searchParams.month.format('MM') : '',
        });
        if (res) {
          window.open(`${res.data}`, '_blank');
        }
      });
    },
    exportbanjianExcel() {
      autoDoFn(async () => {
        const res = await banjianexportExcel({
          ...this.searchParams,
          year: this.searchParams.year ? moment(this.searchParams.year).format('YYYY') : '',
          month: this.searchParams.month ? this.searchParams.month.format('MM') : '',
        });
        if (res) {
          window.open(`${res.data}`, '_blank');
        }
      });
    },
    exportliangbanExcel() {
      autoDoFn(async () => {
        const res = await liangbanexportExcel({
          ...this.searchParams,
          year: this.searchParams.year ? moment(this.searchParams.year).format('YYYY') : '',
          month: this.searchParams.month ? this.searchParams.month.format('MM') : '',
        });
        if (res) {
          window.open(`${res.data}`, '_blank');
        }
      });
    },
    exportshixianExcel() {
      autoDoFn(async () => {
        const res = await shixianexportExcel({
          ...this.searchParams,
          year: this.searchParams.year ? moment(this.searchParams.year).format('YYYY') : '',
          month: this.searchParams.month ? this.searchParams.month.format('MM') : '',
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
        year: new Date(moment().subtract(1, 'months').valueOf()),
        month: moment().subtract(1, 'months'),
        organizationName: '',
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
    handleDelete(id) {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getDel({ complaintId: id });
        if (res) {
          this.$message.success('删除成功');
          this.initList();
        }
        this.loading = false;
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
