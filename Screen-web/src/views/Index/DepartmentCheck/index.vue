<template>
    <div class="content-wrap">
        <h2 class="content__title">部门考核计划</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="年：">
                <DatePicker type="year"
                            v-model="searchParams.year"
                            :clearable="false"
                            placeholder="请选择年"
                            :disabledDate="disabledDate"
                            style="width: 100%"></DatePicker>
            </search-box-item>
            <search-box-item label="月：">
                <a-month-picker dropdownClassName="monthPickerClass"
                                v-model="searchParams.month"
                                format="MM"
                                :allowClear="false"
                                :disabledDate="disabledDate"
                                placeholder="请选择月"
                                style="width: 100%"/>
            </search-box-item>
            <search-box-item label="组织结构：">
                <a-tree-select
                        style="width: 100%"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        :treeData="orgTreeData"
                        placeholder='请选择组织机构'
                        treeDefaultExpandAll
                        v-model="searchParams.organizationId"
                        :showSearch='true'
                />
            </search-box-item>
            <search-box-item label="人员：">
                <a-input v-model="searchParams.name"/>
            </search-box-item>
        </search-box>
        <div class="content" style="top: 99px;">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_DEPARTMENTPLAN_EDITOR') > -1
                            || !useAuthority">
                        <a href="javascript:;" @click="handleModifyShow(record)">明细</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_DEPARTMENTPLAN_EXPORT') > -1
                            || !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="exportExcel(record)">导出</a>
                    </template>
                </span>
            </a-table>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :orgTreeData="orgTreeData"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
    </div>
</template>

<script>
import moment from 'moment';

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
import { getPage, getDel, exportExcel } from '@/remote/departmentCheck';
import { getOrgTree } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox.vue';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem.vue';
import Add from './Add.vue';
import { autoDoFn, transformTree } from '@/utils/util';

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
    title: '计划名称',
    dataIndex: 'name',
    width: 400,
  },
  {
    title: '模版类型',
    dataIndex: 'typeName',
    width: 300,
  },
  {
    title: '考核对象类型',
    dataIndex: 'objectTypeName',
    width: 300,
  },
  {
    title: '考核部门',
    dataIndex: 'organizationName',
    width: 200,
  },
  {
    title: '基准分',
    dataIndex: 'datumValue',
    width: 200,
  },
  {
    title: '最终得分',
    dataIndex: 'finalScore',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'stateName',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
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
    AMonthPicker: MonthPicker,
    ATreeSelect: TreeSelect,
    SearchBox,
    SearchBoxItem,
    Add,
  },
  data() {
    return {
      columns,
      addVisible: false,
      viewVisible: false,
      modifyId: '',
      data: [],
      searchParams: {
        year: new Date(moment().valueOf()),
        month: moment(),
        name: '',
        organizationId: '',
      },
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 300,
        x: 1000,
      },
      pagination: {
        defaultCurrent: 1,
        total: 0,
        row: 10,
        page: 0,
      },
      orgTreeData: [],
      authorityActionList: window.authorityActionList,
      useAuthority: window.defaultConfig.useAuthority,
    };
  },
  created() {
    this.initBaseData();
    this.initList();
  },
  methods: {
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getPage({
          ...this.searchParams,
          ...this.pagination,
          year: moment(this.searchParams.year).format('YYYY'),
          month: this.searchParams.month.format('MM'),
        });
        if (res) {
          this.data = res.data.list;
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
    handleLeaveSuccess() {
      this.handleDrawerToggle('leaveVisible', false);
      this.initList();
    },
    handleSearch() {
      this.initList();
    },
    handleReset() {
      this.searchParams = {
        year: new Date(moment().valueOf()),
        month: moment(),
        name: '',
        organizationId: '',
      };
      this.pagination = {
        defaultCurrent: 1,
        row: 10,
        page: 0,
      };
      this.$nextTick(() => {
        this.initList();
      });
    },
    handleDelete(data) {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getDel(data);
        if (res) {
          this.$message.success('删除成功');
          this.initList();
        } else {
          this.loading = false;
        }
      });
    },
    onPageChange(pagination) {
      this.pagination.page = pagination.current;
      this.$nextTick(() => {
        this.initList();
      });
    },
    exportExcel(record) {
      autoDoFn(async () => {
        const res = await exportExcel({ planId: record.id });
        if (res) {
          window.open(`${res.data}`, '_blank');
        }
      });
    },
    disabledDate(current){
      return current && current > moment().valueOf();
    },
  },
};
</script>

<style lang="less">

</style>
