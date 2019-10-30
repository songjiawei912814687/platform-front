<template>
    <div class="content-wrap">
        <h2 class="content__title">自助表单</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="表单名称">
                <a-input v-model="searchParams.name"/>
            </search-box-item>
        </search-box>
        <div class="action" >
            <a-button @click="handleDrawerToggle('addVisible', true)"v-if="authorityActionList.indexOf('A_KNOWLEDGE_SELFSHEET_ADD')">录入</a-button>

            <a-button  @click="handleDelete({idList: selectedRowKeys})"
                       :disabled="!hasSelected"
                       :loading="loading"
                       v-if="authorityActionList.indexOf('A_KNOWLEDGE_SELFSHEET_DELETE')">
                    删除
            </a-button>

        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :rowKey="record => record.id"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange:onSelectChange}"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleModifyShow(record)" v-if="authorityActionList.indexOf('A_KNOWLEDGE_SELFSHEET_UPDATE') ">编辑</a>
                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="handleViewShow(record)" v-if="authorityActionList.indexOf('A_KNOWLEDGE_SELFSHEET_VIEW')">查看</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认" cancelText="取消">
                        <a href="javascript:;" v-if="authorityActionList.indexOf('A_KNOWLEDGE_SELFSHEET_DELETE')">删除</a>
                    </a-popconfirm>
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
  Switch,
} from 'ant-design-vue';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import { autoDoFn } from '@/utils/util';
import { getPage, getDel } from '@/remote/selfSheet';

const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '表单名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '地址',
    width: 200,
    dataIndex: 'url',
  },
  {
    title: '创建时间',
    width: 200,
    dataIndex: 'createdDateTime',
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
      // fixed: 'right',
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
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        pagination: {
            pageSize: '10',
            defaultCurrent: 1,
            total: 0,
            rows: 10,
            page: 0,
        },
        authorityActionList: window.authorityActionList,
    };
  },
  created() {
    this.initList();
  },
    computed: {
        hasSelected() {
            return this.selectedRowKeys.length > 0
        }
    },
  methods: {
      onSelectChange (selectedRowKeys) {
          this.selectedRowKeys = selectedRowKeys;
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
          setTimeout(() => {
              this.loading = false;
              this.selectedRowKeys = [];
          }, 1000);
        const res = await getDel(data);
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

</style>
