<template>
    <div class="content-wrap">
        <h2 class="content__title">考核申诉</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="年：">
                <DatePicker type="year" v-model="searchParams.year"
                            placeholder="请选择年" style="width: 100%"></DatePicker>
            </search-box-item>
            <search-box-item label="月：" class="monthPicker">
                <a-month-picker dropdownClassName="monthPickerClass"
                                v-model="searchParams.month" format="MM" placeholder="请选择月" style="width: 100%"/>
            </search-box-item>
            <search-box-item label="考核部门：">
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
            <search-box-item label="考核人员：">
                <a-input v-model="searchParams.employeeName" placeholder="请输入考核人员"/>
            </search-box-item>
        </search-box>
        <div class="action">
            
            <a-button @click="exportExcel()"
                      v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALCOMPLAINT_EXPORT') > -1 || !useAuthority">
                导出
            </a-button>
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
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALCOMPLAINT_VIEW') > -1 || !useAuthority">查看</a>
                    <template
                            v-if="(authorityActionList.indexOf('A_ASSESSMENT_APPRAISALCOMPLAINT_EDITOR') > -1 || !useAuthority )&&(record.state==0)">
                        <a-divider type="vertical" />
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALCOMPLAINT_DELETE') > -1 || !useAuthority">
                        <a-divider type="vertical" v-if="record.state==0"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete(record.id)" okText="确认" cancelText="取消"
                                      v-if="record.state==0">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
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
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
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
import { getPage1, getDel, exportExcel } from '@/remote/complain';

import { getOrgTree } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import { autoDoFn, transformTree } from '@/utils/util';
import moment from 'moment';

const { Item } = Form;
const { Option } = Select;
const { MonthPicker } = DatePicker;

const columns = [
  {
    title: '年',
    dataIndex: 'year',
    width: 100,
  },
  {
    title: '月',
    dataIndex: 'month',
    width: 100,
  },
  {
    title: '考核计划标题',
    dataIndex: 'name',
    width: 300,
  },
  {
    title: '模板类型',
    dataIndex: 'typeName',
    width: 150,
  },
  {
    title: '所属部门',
    dataIndex: 'organizationName',
    width: 250,
  },
  {
    title: '考核人员',
    dataIndex: 'inspectionpersonnelName',
    width: 150,
  },
  {
    title: '申述日期',
    dataIndex: 'createdDateTime',
    width: 150,
  },
  {
    title: '申诉原因',
    dataIndex: 'description',
    width: 250,
  },
  {
    title: '状态',
    dataIndex: 'stateName',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
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
    Add,
    DetailView,
  },
  data() {
    return {
      columns,
      addVisible: false,
      modifyId: '',
      data: [],
      viewVisible: false,
      searchParams: {
        year: '',
        month: null,
        organizationId: '',
        employeeName: '',
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
        x: 1350,
      },
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        pagination: {
            pageSize: '10',
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
        const res = await getPage1({
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
        const res = await exportExcel();
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
        year: '',
        month: null,
        organizationId: '',
        employeeId: '',
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
        this.initList();
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
