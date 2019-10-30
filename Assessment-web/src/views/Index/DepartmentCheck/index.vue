<template>
    <div class="content-wrap">
        <h2 class="content__title">部门考核计划</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="年：">
                <DatePicker type="year"
                            v-model="searchParams.year"
                            :clearable="false"
                            placeholder="请选择年"
                            @on-change="handleYearChange"
                            :disabledDate="disabledDate"
                            style="width: 100%"></DatePicker>
            </search-box-item>
            <search-box-item label="月：">
                <a-month-picker dropdownClassName="monthPickerClass"
                                v-model="searchParams.month"
                                format="MM"
                                :allowClear="true"
                                :disabledDate="disabledDate"
                                placeholder="请选择月"
                                style="width: 100%"/>
            </search-box-item>
            <search-box-item label="组织结构：">
                <a-tree-select
                        style="width: 100%"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        :treeData="orgTreeData"
                        showSearch
                        treeNodeFilterProp="title"
                        placeholder='请选择组织机构'
                        treeDefaultExpandAll
                        v-model="searchParams.organizationId"
                />
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
                        <a href="javascript:;" @click="handleModifyShow(record)">申报</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_DEPARTMENTPLAN_EXPORT') > -1
                            || !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="exportExcel(record)">导出</a>
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
        <edit-score :addVisible="editVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('editVisible', false)"></edit-score>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :orgTreeData="orgTreeData"
             :modifyId="modifyId"
             :state="state"
             :permission="permission"
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
import EditScore from './EditScore.vue';
import { autoDoFn, transformTree } from '@/utils/util';

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
    AMonthPicker: MonthPicker,
    ATreeSelect: TreeSelect,
    SearchBox,
    SearchBoxItem,
    Add,
    EditScore,
  },
  data() {
    return {
      columns: [
        // {
        //   title: '年',
        //   dataIndex: 'year',
        //   width: 100,
        // },
        // {
        //   title: '月',
        //   dataIndex: 'month',
        //   width: 100,
        // },
        {
          title: '序号',
          customRender:(text, row, index)=>`${index + 1+this.pagination.pageSize*(this.pagination.page-1)}`,
          width: 50,
        },
        {
          title: '考核部门',
          dataIndex: 'organizationName',
          width: 150,
        },
        {
          title: '计划名称',
          dataIndex: 'name',
          width: 400,
        },
        // {
        //   title: '模版类型',
        //   dataIndex: 'typeName',
        //   width: 200,
        // },
        // {
        //   title: '考核对象类型',
        //   dataIndex: 'objectTypeName',
        //   width: 200,
        // },
        {
          title: '基准分',
          dataIndex: 'datumValue',
          width: 100,
        },
        {
          title: '最终得分',
          dataIndex: 'finalScore',
          width: 100,
        },
        {
          title: '状态',
          dataIndex: 'stateName',
          width: 100,
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      addVisible: false,
      editVisible: false,
      viewVisible: false,
      modifyId: '',
      state:'',
      permission:'',
      data: [],
      searchParams: {
        year: new Date(moment().subtract(1, 'months').valueOf()),
        month: moment().subtract(1, 'months'),
        organizationId: '',
      },
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 300,
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
          year: moment(this.searchParams.year).format('YYYY'),
          month: this.searchParams.month === undefined||this.searchParams.month === null ? null : this.searchParams.month.format('MM'),
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
      this.state = rowData.state;
      this.permission = authorityActionList.indexOf('A_ASSESSMENT_DEPARTMENTPLAN_AJUST') > -1?1:0;
    },
    handleModifyScoreShow(rowData) {
      this.handleDrawerToggle('editVisible', true);
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
      this.handleDrawerToggle('editVisible', false);
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
        year: new Date(moment().subtract(1, 'months').valueOf()),
        month: moment().subtract(1, 'months'),
        name: '',
        organizationId: '',
      };
      this.pagination = {
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
    handleYearChange(value) {
      if(value === moment().format("YYYY")){
        this.searchParams.month = moment('2018-' + moment().format("MM") + '-01');
      }
    },
    disabledDate(current){
      return current && moment(moment(this.searchParams.year).format("YYYY")+ '-' + current.format("MM-DD")).valueOf() > moment().valueOf();
    },
  },
};
</script>

<style lang="less">

</style>
