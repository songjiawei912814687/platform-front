<template>
    <div class="content-wrap">
        <h2 class="content__title">我的会议</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="会议主题：">
                <a-input v-model="searchParams.theme" placeholder='请输入会议主题'/>
            </search-box-item>
            <search-box-item label="日期：">
                <a-date-picker placeholder='请选择日期' v-model="searchParams.date" style="width: 100%"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)">录入</a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="meetingTime" slot-scope="text, record">{{record.appointmentDate + ' ' + meetingTime[record.startDateTime].name + '-' + record.appointmentDate + ' ' + meetingTime[record.endDateTime].name}}</span>
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" v-if="String(record.state) === '0'" @click="handleModifyShow(record)">编辑</a>
                    <a-divider type="vertical" v-if="String(record.state) === '0'"/>
                    <a href="javascript:;" @click="handleViewShow(record)">查看</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认" cancelText="取消">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :staffList="staffList"
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
} from 'ant-design-vue';
import { getMyPage, getDel } from '@/remote/appointment';
import { getEmployeesAll } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import { autoDoFn, transformTree } from '@/utils/util';
import { meetingTime } from '@/common/dictData';
import moment from 'moment';

const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '会议主题',
    dataIndex: 'theme',
    width: 300,
  },
  {
    title: '会议室',
    dataIndex: 'roomName',
    width: 300,
  },
  {
    title: '会议时间',
    dataIndex: 'meetingTime',
    scopedSlots: { customRender: 'meetingTime' },
    width: 400,
  },
  {
    title: '状态',
    dataIndex: 'stateName',
    width: 200,
  },
  {
    title: '预约人',
    dataIndex: 'emplyeesName',
    width: 200,
  },
  {
    title: '主办单位',
    dataIndex: 'hostUnit',
    width: 300,
  },
  {
    title: '操作',
    key: 'action',
    width: 250,
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
    SearchBox,
    SearchBoxItem,
    Add,
    DetailView,
  },
  data() {
    return {
      columns,
      selectedRowKeys: [],
      addVisible: false,
      viewVisible: false,
      modifyId: '',
      data: [],
      searchParams: {
        theme: '',
        date: moment(),
      },
      loading: false,
      staffList: [],
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
      meetingTime,
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
        const res = await getMyPage({ ...this.searchParams });
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
        const staffRes = await getEmployeesAll();
        if (staffRes) {
          this.staffList = staffRes.data;
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
        theme: '',
        date: moment(),
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
  },
};
</script>

<style lang="less">

</style>
