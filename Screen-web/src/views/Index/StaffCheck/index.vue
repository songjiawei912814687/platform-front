<template>
    <div class="content-wrap">
        <h2 class="content__title">员工考核计划</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="年：">
                <DatePicker type="year"
                            v-model="searchParams.year"
                            placeholder="请选择年"
                            :clearable="false"
                            :disabledDate="disabledDate"
                            style="width: 100%"></DatePicker>
            </search-box-item>
            <search-box-item label="月：">
                <a-month-picker dropdownClassName="monthPickerClass"
                                v-model="searchParams.month"
                                format="MM"
                                placeholder="请选择月"
                                :allowClear="false"
                                :disabledDate="disabledDate"
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
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_EMPLOYEEPLAN_EDITOR') > -1 || !useAuthority">
                        <a href="javascript:;" @click="handleModifyShow(record)">明细</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_EMPLOYEEPLAN_EXPORT') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="exportExcel(record)">导出</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_EMPLOYEEPLAN_SETUPSERVICESTARS') > -1 || !useAuthority">
                        <a-divider type="vertical" v-show="record.isStar === 0"/>
                        <a href="javascript:;"
                           @click="handleChangeState(record,true)" v-show="record.isStar === 0">
                            设置服务明星
                        </a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_EMPLOYEEPLAN_SETUPSERVICESTARS') > -1 || !useAuthority">
                        <a-divider type="vertical" v-show="record.isStar === 1"/>
                        <a href="javascript:;"
                           @click="handleChangeState(record,false)" v-show="record.isStar === 1">
                            取消服务明星
                        </a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_EMPLOYEEPLAN_APPEAL') > -1
                            || !useAuthority">
                        <a-divider type="vertical" v-show="record.finalScore"/>
                        <a href="javascript:;" v-show="record.finalScore" @click="handleComplain(record)">申诉</a>
                    </template>
                </span>
            </a-table>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :orgTreeData="orgTreeData"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <ComplainAdd :addVisible="complainAddVisible"
                     @successCallback="handleComplainAddSuccess"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('complainAddVisible', false)">
        </ComplainAdd>
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
import { getPage, getDel, exportExcel, getStart, getStop } from '@/remote/staffCheck';
import { getOrgTree } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox.vue';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem.vue';
import { autoDoFn, transformTree } from '@/utils/util';
import Add from './Add.vue';
import ComplainAdd from '../Complain/Add.vue';


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
    title: '部门',
    dataIndex: 'organizationName',
    width: 300,
  },
  {
    title: '考核人员',
    dataIndex: 'employeeName',
    width: 300,
  },
  {
    title: '服务明星',
    dataIndex: 'isStarName',
    width: 200,
  },
  {
    title: '基准分',
    dataIndex: 'datumValue',
    width: 200,
  },
  {
    title: '得分合计',
    dataIndex: 'finalScore',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'stateName',
    width: 400,
  },
  {
    title: '操作',
    key: 'action',
    width: 280,
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
    ComplainAdd,
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
      complainAddVisible: false,
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
    // 启用与停用
    handleChangeState(data, type) {
      this.loading = true;
      if (type) {
        autoDoFn(async () => {
          const res = await getStart({ idList: data.id });
          if (res.success) {
            this.$message.success('操作成功！');
          }
          this.loading = false;
          this.initList();
        });
      } else {
        autoDoFn(async () => {
          const res = await getStop({ idList: data.id });
          if (res.success) {
            this.$message.success('操作成功！');
          }
          this.loading = false;
          this.initList();
        });
      }
    },
    // 申诉
    handleComplain(record) {
      this.handleDrawerToggle('complainAddVisible', true);
      this.modifyId = record.id;
    },
    handleComplainAddSuccess() {
      this.handleDrawerToggle('complainAddVisible', false);
      this.initList();
    },
    disabledDate(current){
      return current && current > moment().valueOf();
    },
  },
};
</script>

<style lang="less">

</style>
