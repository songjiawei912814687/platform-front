<template>
    <div class="content-wrap">
        <h2 class="content__title">会议室管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="会议室名称：">
                <a-input v-model="searchParams.name" placeholder="请输入会议室名称"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)" v-if="authorityActionList.indexOf('A_MEETING_MEETINGROOM_ADD') > -1">录入</a-button>
            <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_MEETING_MEETINGROOM_EXPORT') > -1">导出</a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     @change="onPageChange"
                     :rowKey="record => String(record.id)"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)" v-if="authorityActionList.indexOf('A_MEETING_MEETINGROOM_VIEW') > -1">查看</a>
                    <template v-if="authorityActionList.indexOf('A_MEETING_MEETINGROOM_EDITOR') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_MEETING_MEETINGROOM_DELETE') > -1">
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认" cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_MEETING_ROLEMANAGEMENT_DATAPERMISSIONS') > -1">
                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="organPerShow(record)">数据权限</a>
                    </template>
                </span>
            </a-table>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <organ :visible="organPermissionsVisible"
               :roomId="roomId"
               @cancel="() => this.organPermissionsVisible = false"
               @successCallback="() => this.organPermissionsVisible = false"
        ></organ>
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
import { getPage, getDel, exportExcel } from '@/remote/room';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import Organ from './Organs'
import { autoDoFn, transformTree } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '会议室名称',
    dataIndex: 'name',
    width: 400,
  },
  {
    title: '可容纳人数',
    dataIndex: 'containNumber',
    width: 300,
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 750,
  },
  {
    title: '操作',
    key: 'action',
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
    DetailView,
    Organ
  },
  data() {
    return {
      columns,
      addVisible: false,
      viewVisible: false,
      organPermissionsVisible: false,
      roomId: '',
      modifyId: '',
      data: [],
      searchParams: {
        name: '',
        windowNo: '',
      },
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: true,
      },
      pagination: {
        defaultCurrent: 1,
        total: 0,
        row: 10,
        page: 0,
      },
      authorityActionList: window.authorityActionList,
    };
  },
  created() {
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
    organPerShow(data) {
        this.roomId = String(data.id);
        this.organPermissionsVisible = true;
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
