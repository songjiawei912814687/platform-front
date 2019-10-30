<template>
    <a-drawer :visible="wrapVisible"
            @close="handleClose"
            :destroyOnClose="true"
            :maskClosable="false"
            :width="1200"
            title="材料清单">
        <a-spin tip="正在加载中..." :spinning="addLoading">
                <search-box @onSearch="handleSearch" @onReset="handleReset">
                    <search-box-item label="材料名称：">
                        <a-input v-model="searchParams.name"/>
                    </search-box-item>
                </search-box>
                <div class="action" style="margin:20px 0"v-if=" String(this.organizationId)==String(orgId)||String(username) ==='中心机关'">
                    <a-button @click="handleDrawerToggle('addVisible1', true)">录入</a-button>
                    <a-button @click="handleChoiceShow" style="margin-left: 10px">批量选择</a-button>
                </div>
                <div class="content">
                    <a-table :columns="parentId===0?columns:columns1"
                             :dataSource="data"
                             :loading="loading"
                             :scroll="scroll"
                             :rowKey="record => record.id"
                             @change="onPageChange"
                             :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleModifyShow(record)"
                       v-if="String(record.orgId)==String(orgId)||String(username) ==='中心机关'">编辑</a>
                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="handleViewShow(record)">查看</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({id: record.id})" okText="确认" cancelText="取消">
                        <a href="javascript:;" v-if="String(record.orgId)==String(orgId)||String(username) ==='中心机关'">删除</a>
                    </a-popconfirm>
                </span>
                    </a-table>
                </div>
            <add-wrap :addVisible1="addVisible1"
                      @successCallback="handleAddSuccess"
                      :modifyId="modifyId"
                      :grainId="grainId"
                      :orgId = "orgId"
                      :handleClose="() => handleDrawerToggle('addVisible1', false)"></add-wrap>
            <detail-view-wrap :viewVisible1="viewVisible1"
                         :modifyId="modifyId"
                         :handleClose="() => handleDrawerToggle('viewVisible1', false)"></detail-view-wrap>
            <add-choice-wrap :addVisible1="addVisible2"
                      @successCallback="handleAddSuccess2"
                      :qullFullId="qullFullId"
                      :grainId="grainId"
                      :orgId = "orgId"
                      :handleClose="() => {this.addVisible2 = false}"></add-choice-wrap>
        </a-spin>
    </a-drawer>
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
  Drawer,
  DatePicker,
  Upload,
  Icon,
  Spin,
  Divider,
  Popconfirm,
  Switch,
} from 'ant-design-vue';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import AddWrap from './AddWrap';
import DetailViewWrap from './DetailViewWrap';
import AddChoiceWrap from './AddChoiceWrap';
import { autoDoFn } from '@/utils/util';
import { getPage, getDel } from '@/remote/materials';

const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '材料名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '材料形式',
    dataIndex: 'materialFormName',
    width: 200,
  },
  {
    title: '必要性及描述',
    dataIndex: 'necessarilyDescription',
    width: 200,
  },
  {
    title: '材料出具单位',
    dataIndex: 'meteriaOrganization',
    width: 150,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: 150,
  },
];
const columns1 = [
  {
    title: '材料名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '材料形式',
    dataIndex: 'materialFormName',
    width: 200,
  },
  {
    title: '材料出具单位',
    dataIndex: 'meteriaOrganization',
    width: 150,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: 150,
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
    ADrawer: Drawer,
    ASpin: Spin,
    SearchBox,
    SearchBoxItem,
    AddWrap,
    AddChoiceWrap,
    DetailViewWrap,
  },
  props: ['wrapVisible', 'handleClose', 'grainId', 'qullFullId',"parentId","organizationId"],
  data() {
    return {
      columns,
      columns1,
      addVisible1: false,
      viewVisible1: false,
      addVisible2: false,
      selectStaffVisible: false,
      addLoading: false,
      selectedRowKeys: [],
      modifyId: '',
      data: [],
      orgId: localStorage.getItem("organId"),
      username:localStorage.getItem("userName"),
      classifyList: [],
      searchParams: {
        name: '',
      },
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1000
      },
      pagination: {
        defaultCurrent: 1,
        total: 0,
        row: 10,
        page: 0,
      },
    };
  },
  watch: {
    wrapVisible() {
      this.initList();
    },
  },
  methods: {
    initList() {
      autoDoFn(async () => {
        this.loading = true;
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
          console.log("this.orgId:"+this.orgId)
        }
        this.loading = false;
      });
    },
    handleModifyShow(rowData) {
      this.handleDrawerToggle('addVisible1', true);
      this.modifyId = rowData.id;
    },
    handleViewShow(rowData) {
      this.handleDrawerToggle('viewVisible1', true);
      this.modifyId = rowData.id;
    },
    handleDrawerToggle(type, isVisible) {
      this[type] = isVisible;
      if (!isVisible) {
        this.modifyId = '';
      }
    },
    handleAddSuccess() {
      this.handleDrawerToggle('addVisible1', false);
      this.initList();
    },
    handleAddSuccess2() {
      this.handleDrawerToggle('addVisible2', false);
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
    handleChoiceShow() {
      this.addVisible2 = true;
    }
  },
};
</script>

<style lang="less">

</style>

