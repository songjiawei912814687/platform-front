<template>
    <div class="content-wrap">
        <h2 class="content__title">季度报表</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="年：">
                <DatePicker type="year" v-model="searchParams.year"
                            placeholder="请选择年" style="width: 100%"></DatePicker>
            </search-box-item>
            <search-box-item label="季度：">
                <a-select placeholder='请季度' v-model="searchParams.quarter" style="width:100%">
                    <a-select-option value='1'>1</a-select-option>
                    <a-select-option value='2'>2</a-select-option>
                    <a-select-option value='3'>3</a-select-option>
                    <a-select-option value='4'>4</a-select-option>
                </a-select>
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
            <a-button @click="exportExcel()" v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_EMPLOYEEREPORT_EXPORT') > -1 || !useAuthority">导出</a-button>
            <a-button @click="handleReportShow()" v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_EMPLOYEEREPORT_CREATEEXPORT') > -1 || !useAuthority">生成考核报表</a-button>
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
                    <template v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_EMPLOYEEREPORT_DETAIL') > -1 || !useAuthority">
                        <a href="javascript:;" @click="handleViewShow(record)">明细</a>
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
        </div>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <a-modal
                title="生成季度考核报表"
                :visible="reportVisible"
                @ok="handleReportSubmit"
                :confirmLoading="confirmLoading"
                @cancel="handleReportCancel"
        >
            <a-form @submit="handleReportSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label='年'
                                fieldDecoratorId="year"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择年!' }], trigger: 'on-change'}">
                            <DatePicker type="year" placeholder="请选择年" style="width: 100%"></DatePicker>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='季度'
                                fieldDecoratorId="quarter"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择季度!'}]}">
                              <a-select placeholder='请选择季度'  style="width:100%">
                                  <a-select-option value='1'>1</a-select-option>
                                  <a-select-option value='2'>2</a-select-option>
                                  <a-select-option value='3'>3</a-select-option>
                                  <a-select-option value='4'>4</a-select-option>
                              </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
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
  Modal,
} from 'ant-design-vue';
import { getPage, getDetail, exportExcel,createReport } from '@/remote/staffReport';

import { getOrgTree } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import { autoDoFn, transformTree } from '@/utils/util';
import moment from 'moment';
import DetailView from './detailView';

const { Item } = Form;
const { Option } = Select;
const { MonthPicker } = DatePicker;

const columns = [
  {
    title: '年',
    dataIndex: 'year',
    width: 400,
  },
  {
    title: '季度',
    dataIndex: 'quarter',
    width: 400,
  },
  {
    title: '组织机构',
    dataIndex: 'organizationName',
    width: 400,
  },
  // {
  //   title: '工号',
  //   dataIndex: 'employeeName',
  //   width: 400,
  // },
  {
    title: '姓名',
    dataIndex: 'employeeName',
    width: 400,
  },
  {
    title: '扣分总值',
    dataIndex: 'toltal',
    width: 400,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
    scopedSlots: { customRender: 'action' },
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
    APopconfirm: Popconfirm,
    ATreeSelect: TreeSelect,
    AMonthPicker: MonthPicker,
    SearchBox,
    SearchBoxItem,
    DetailView,
    AModal: Modal,
  },
  data() {
    return {
      columns,
      addVisible: false,
      modifyId: '',
      data: [],
      viewVisible: false,
      reportVisible: false,
      confirmLoading: false,
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
            page: 0,
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
          this.tableList = res.data.list;
          this.pagination.total = res.data.total;
          this.pagination.page = res.data.pageNum;
          this.pagination.row = res.data.pageSize;
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
    handleSearch() {
      this.initList();
    },
    handleReset() {
      this.searchParams = {
        year: new Date(moment().subtract(1, 'months').valueOf()),
        month: moment().subtract(1, 'months'),
        organizationName: '',
      };
      this.pagination = {
        defaultCurrent: 1,
        total: 0,
        row: 10,
        page: 0,
      };
      this.$nextTick(() => {
        this.initList();
      });
    },
    onPageChange(pagination) {
      this.pagination.page = pagination.current;
      this.$nextTick(() => {
        this.initList();
      });
    },
    handleReportShow() {
      this.reportVisible = true;
    },
    handleReportSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            this.confirmLoading = true;
            const res = await createReport({
              quarter: values.quarter,
              year: values.year ? moment(values.year).format("YYYY") : '',
            });
            if (res.success) {
              this.$message.success('操作成功');
              this.reportVisible = false;
            }
            this.confirmLoading = false;
            this.initList();
          });
        }
      });
    },
    handleReportCancel() {
      this.reportVisible = false;
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
