<template>
    <div class="content-wrap">
        <h2 class="content__title">请假补录</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="所属机构：">
                <a-tree-select style="width: 100%" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                               :treeData="orgTreeData"
                               showSearch treeNodeFilterProp="title"
                               placeholder='请选择所属机构'
                               treeDefaultExpandAll :rowKey="record => String(record.id)"
                               v-model="searchParams.organizationId"
                               :allowClear="true">
                </a-tree-select>
            </search-box-item>
            <search-box-item label="申请人：">
                <a-input v-model="searchParams.employeesName" placeholder="请输入申请人"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)" v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATIONCOLLECTION_ADD') > -1">补录</a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     @change="onPageChange"
                     :rowKey="record => String(record.id)"
                     :pagination="pagination">
                <span slot="startTime" slot-scope="text, record">{{record.startDate + ' ' + record.startTime}}</span>
                <span slot="endTime" slot-scope="text, record">{{record.endDate + ' ' + record.endTime}}</span>
                <span slot="applicationType" slot-scope="text, record">{{applicationTypeArr[record.applicationType]}}</span>
                <span slot="action" slot-scope="text, record" >
                    <a href="javascript:;" @click="handleViewShow(record)" v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATIONCOLLECTION_VIEW') > -1">查看</a>
                    <template v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATIONCOLLECTION_EDITOR') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATIONCOLLECTION_DELETE') > -1">
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
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
             :orgTreeData="orgTreeData"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :applicationTypeArr="applicationTypeArr"
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
import { getPage, getDel } from '@/remote/leaveSupply';
import { getOrgTree } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import { autoDoFn, transformTree } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;
const applicationTypeArr = [
  '',
  '临时外出二小时公事',
  '哺乳假',
  '',
  '产假',
  '年休假',
  '因公外出',
  '事假',
  '病假',
   '',
  '临时外出二小时私事',
  '婚假',
  '探亲假',
  '陪产假',
  '丧假',
];

const columns = [
  {
    title: '机构',
    dataIndex: 'organizationName',
    width: 200,
  },
  {
    title: '人员',
    dataIndex: 'employeesName',
    width: 200,
  },
  {
    title: '类型',
    dataIndex: 'applicationType',
    scopedSlots: { customRender: 'applicationType' },
    width: 200,
  },
    {
        title:"补录时间",
        dataIndex: 'createdDateTime' ,
        scopedSlots: {customRender: 'createdDateTime'},
        width: 300,
    },
  {
    title: '开始时间',
    dataIndex: 'startDate',
    scopedSlots: { customRender: 'startTime' },
    width: 300,
  },
  {
    title: '结束时间',
    dataIndex: 'endDate',
    scopedSlots: { customRender: 'endTime' },
    width: 300,
  },
  {
    title: '请假原因',
    dataIndex: 'description',
    width: 400,
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    width: 250,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 180,
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
      createdDateTime:'',
      viewVisible: false,
      searchParams: {
        organizationId: '',
        employeesId: '',
      },
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1000,
      },
      orgTreeData: [],
      staffList: [],
      applicationTypeArr,
        pageSizeOptions: [10, 20, 30, 40, 50],
        pagination: {
            pageSize: 10,
            defaultCurrent: 1,
            total: 0,
            rows: 10,
            page: 0,
        },
      authorityActionList: window.authorityActionList,
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
    handleSearch() {
      this.initList();
    },
    handleReset() {
      this.searchParams = {
        organizationName: '',
        employeesName: '',
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
        }else{
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
  },
};
</script>

<style lang="less">

</style>
