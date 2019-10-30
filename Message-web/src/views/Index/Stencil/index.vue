<template>
    <div class="content-wrap">
        <h2 class="content__title">短信模板</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="业务类型：">
                <a-select placeholder='请选择业务类型' v-model="searchParams.type">
                    <a-select-option v-for="item in typeList" :value='String(item.code)' :key="String(item.code)">
                        {{item.message}}
                    </a-select-option>
                </a-select>
            </search-box-item>
            <search-box-item label="模板名称：">
                <a-input v-model="searchParams.name" placeholder="请输入模板名称"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"
                      v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALRULE_ADD') > -1 || !useAuthority">录入
            </a-button>
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
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALRULE_VIEW') > -1 || !useAuthority">查看</a>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALRULE_EDITOR') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                     <template>
                        <a-divider type="vertical"/>
                        <a v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALINDEX_STOP') > -1 || !useAuthority"
                           v-show="record.state === 0"
                           href="javascript:;"
                           @click="handleChangeState(record,true)">启用</a>
                        <a v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALINDEX_STAT') > -1 || !useAuthority"
                           v-show="record.state === 1"
                           href="javascript:;"
                           @click="handleChangeState(record,false)">停用</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALRULE_DELETE') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete(record)" okText="确认" cancelText="取消">
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
             :typeList="typeList"
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
import { findConfigs, getPage, getDel, getStart, getStop } from '@/remote/stencil';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;
const columns = [
  {
    title: '业务类型',
    dataIndex: 'typeName',
    width: 300,
  },
  {
    title: '模板名称',
    dataIndex: 'name',
    width: 450,
  },
  {
    title: '状态',
    dataIndex: 'statName',
    width: 150,
  },
  {
    title: '更新人',
    dataIndex: 'lastUpdateUserName',
    width: 250,
  },
  {
    title: '更新时间',
    dataIndex: 'lastUpdateDateTime',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    width: 300,
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
      addVisible: false,
      modifyId: '',
      data: [],
      typeList: [],
      viewVisible: false,
      searchParams: {
        name: '',
      },
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1000,
      },
      state: '', // 状态
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        pagination: {
            pageSize: '10',
            defaultCurrent: 1,
            total: 0,
            rows: 10,
            page: 0,
        },
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
    initBaseData() {
      autoDoFn(async () => {
        const res = await findConfigs({});
        if (res.success) {
          this.typeList = res.data;
        }
      });
    },
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getPage({
          ...this.searchParams,
          ...this.pagination,
        });
        if (res.success) {
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
        type: '',
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
        if (data.state === 1) {
          this.$message.error('只能删除已停用的模板');
        } else {
          this.loading = true;
          const res = await getDel({ idList: data.id });
          if (res.success) {
            this.$message.success('删除成功');
            this.initList();
          }
          this.loading = false;
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
