<template>
    <div class="content-wrap">
        <h2 class="content__title">材料清单</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="材料名称：">
                <a-input v-model="searchParams.name"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)" v-if="authorityActionList.indexOf('A_KNOWLEDGE_MATERIALS_ADD') > -1">录入</a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :rowKey="record => record.id"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleModifyShow(record)" v-if="authorityActionList.indexOf('A_KNOWLEDGE_MATERIALS_EDITOR') > -1">编辑</a>
                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="handleViewShow(record)" v-if="authorityActionList.indexOf('A_KNOWLEDGE_MATERIALS_VIEW') > -1">查看</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({id: record.id})" okText="确认" cancelText="取消">
                        <a href="javascript:;" v-if="authorityActionList.indexOf('A_KNOWLEDGE_MATERIALS_DELETE') > -1">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :grainId="grainId"
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
  Switch,
} from 'ant-design-vue';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import { autoDoFn } from '@/utils/util';
import { getPage, getDel } from '@/remote/materials';

const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '材料名称',
    dataIndex: 'name',
    width: 200,
    fixed: 'left',
  },
  {
    title: '材料形式',
    width: 200,
    dataIndex: 'materialFormName',
  },
  {
    title: '材料详细要求',
    width: 200,
    dataIndex: 'requestDetail',
  },
  {
    title: '必要性及描述',
    width: 200,
    dataIndex: 'necessarilyDescription',
  },
  {
    title: '材料出具单位',
    width: 300,
    dataIndex: 'meteriaOrganization',
  },
  {
    title: '备注',
    width: 400,
    dataIndex: 'remark',
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
    ASwitch: Switch,
    SearchBox,
    SearchBoxItem,
    Add,
    DetailView,
  },
  data() {
    return {
      columns,
      addVisible: false,
      viewVisible: false,
      selectStaffVisible: false,
      selectedRowKeys: [],
      modifyId: '',
      grainId: '',
      data: [],
      classifyList: [],
      searchParams: {
        name: '',
      },
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1700,
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
        this.grainId = this.$route.query.id;
        const res = await getPage({
          minimumParticleId: this.grainId,
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
  },
};
</script>

<style lang="less">

</style>
