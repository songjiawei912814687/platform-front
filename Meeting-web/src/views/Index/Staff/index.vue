<template>
    <div class="content-wrap">
        <h2 class="content__title">人员管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="工号：">
                <a-input v-model="searchParams.employeeNo"/>
            </search-box-item>
            <search-box-item label="姓名：">
                <a-input v-model="searchParams.name"/>
            </search-box-item>
            <search-box-item label="组织机构：">
                <a-input v-model="searchParams.organizationName"/>
            </search-box-item>
            <search-box-item label="职务：">
                <a-input v-model="searchParams.jobsName"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)">录入</a-button>
            <a-button @click="exportExcel">导出</a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="handleViewShow(record)">查看</a>
                    <!--<a-divider type="vertical"/>
                    <a href="javascript:;" @click="handleDrawerToggle('leaveVisible', true)">离职</a>-->
                </span>
            </a-table>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :orgTreeData="orgTreeData"
             :roleList="roleList"
             :windowList="windowList"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <leave :leaveVisible="leaveVisible" @successCallback="handleLeaveSuccess"
               :handleClose="() => handleDrawerToggle('leaveVisible', false)"></leave>
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
} from 'ant-design-vue';
import { getPage, getDel, exportExcel } from '@/remote/staff';
import { getOrgTree, getRoleAll } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import Leave from './Leave';
import { autoDoFn, transformTree } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '工号',
    dataIndex: 'employeeNo',
    fixed: 'left',
    width: 150,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    fixed: 'left',
    width: 200,
  },
  {
    title: '组织机构',
    dataIndex: 'organizationName',
  },
  {
    title: '职务',
    dataIndex: 'jobsName',
    width: 300,
  },
  {
    title: '入职时间',
    dataIndex: 'inductionDateTime',
    width: 300,
  },
  {
    title: '状态',
    dataIndex: 'stateName',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 250,
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
    SearchBox,
    SearchBoxItem,
    Add,
    Leave,
    DetailView,
  },
  data() {
    return {
      columns,
      addVisible: false,
      leaveVisible: false,
      viewVisible: false,
      modifyId: '',
      data: [],
      searchParams: {
        name: '',
        employeeNo: '',
        organizationName: '',
        jobsName: '',
      },
      loading: false,
      roleList: [],
      windowList: [],
      orgTreeData: [],
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1000,
      },
      pagination: {
        defaultCurrent: 1,
        total: 0,
        row: 10,
        page: 0,
      },
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
      autoDoFn(async () => {
        const orgRes = await getOrgTree();
        if (orgRes) {
          this.orgTreeData = transformTree(orgRes.data);
        }
        const roleRes = await getRoleAll();
        if (roleRes) {
          this.roleList = roleRes.data.list;
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
        name: '',
        employeeNo: '',
        organizationName: '',
        jobsName: '',
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
    handleDelete(data) {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getDel(data);
        if (res) {
          this.$message.success('删除成功');
          this.initList();
        }
        this.loading = true;
      });
    },
    onPageChange(pagination) {
      this.pagination.page = pagination.current;
      this.$nextTick(() => {
        this.initList();
      });
    },
    exportExcel(){
      autoDoFn(async () => {
        let res = await exportExcel(this.searchParams);
        if(res){
          window.open(`${res.data}`, '_blank')
        }
      })
    }
  },
};
</script>

<style lang="less">

</style>
