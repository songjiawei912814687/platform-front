<template>
    <div class="content-wrap">
        <h2 class="content__title">员工加减分</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="指标分类：">
                <a-select placeholder='请选择指标分类' v-model="searchParams.appraisalId">
                    <a-select-option v-for="item in classifyList"
                                     :value='String(item.id)'
                                     :key="String(item.id)">
                        {{item.name}}
                    </a-select-option>
                </a-select>
            </search-box-item>
            <!--<search-box-item label="考核规则：">
                <a-select placeholder='请选择考核规则' v-model="searchParams.ruleId" >
                    <a-select-option v-for="item in ruleList" :value='String(item.id)' :key="String(item.id)">
                       {{item.name}}
                    </a-select-option>
                </a-select>
            </search-box-item>-->
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"
                      v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALEMPLOYEERECORD_ADD') > -1 || !useAuthority">
                录入
            </a-button>
            <a-button @click="exportExcel"
                      v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALEMPLOYEERECORD_EXPORT') > -1 || !useAuthority">
                导出
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
                <span slot="adjunct" slot-scope="text, record">
                    <a href="javascript:;" @click="exportExcel(record)">点击下载</a>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALEMPLOYEERECORD_VIEW') > -1 || !useAuthority">查看</a>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALEMPLOYEERECORD_EDITOR') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALEMPLOYEERECORD_DELETE') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete(record.id)" okText="确认" cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                </span>
            </a-table>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :classifyList="classifyList"
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

import { selectPage, getDel, downloadFile } from '@/remote/score';
import { getRuleByIndexId, getPage } from '@/remote/rule';
import { selectAll } from '@/remote/classify';
import { getEmployeesAll } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox.vue';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem.vue';
import Add from './Add.vue';
import DetailView from './DetailView.vue';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '指标分类',
    dataIndex: 'indexName',
    width: 200,
  },
  {
    title: '考核规则',
    dataIndex: 'ruleName',
    width: 200,
  },
  {
    title: '组织机构',
    dataIndex: 'organizationName',
    width: 200,
  },
  {
    title: '记录人',
    dataIndex: 'employeeName',
    width: 200,
  },
  {
    title: '分值',
    dataIndex: 'value',
    width: 100,
  },
  {
    title: '累计限额',
    dataIndex: 'limits',
    width: 150,
  },
  {
    title: '计分公式',
    dataIndex: 'scoreTypeName',
    width: 150,
  },
  {
    title: '计分设置',
    dataIndex: 'scoreSourceName',
    width: 150,
  },
  {
    title: '默认打分',
    dataIndex: 'defaultScore',
    width: 150,
  },
  {
    title: '得分',
    dataIndex: 'score',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'stateName',
    width: 100,
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 300,
  },
  {
    title: '记录时间',
    dataIndex: 'recordDateTime',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
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
      addVisible: false,
      modifyId: '',
      data: [],
      classifyList: [],
      ruleList: [],
      viewVisible: false,
      searchParams: {},
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1550,
      },
      state: '', // 状态
      pagination: {
        defaultCurrent: 1,
        total: 0,
        row: 10,
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
    initBaseData() {
      autoDoFn(async () => {
        const res = await selectAll({
          state: window.parseInt('0'),
          type: window.parseInt(''),
        });
        if (res.success) {
          this.classifyList = res.data;
        }
        const res1 = await getPage();
        if (res1.success) {
          this.ruleList = res1.data.list;
        }
      });
    },
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await selectPage({
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
      this.searchParams = {};
      this.classify = {};
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
    handleDelete(id) {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getDel({ idList: id });
        if (res.success) {
          this.$message.success('删除成功');
          this.initList();
        }
        this.loading = false;
      });
    },
    exportExcel() {
      autoDoFn(async () => {
        const res = await downloadFile({
          appraisalId: window.parseInt(this.searchParams.appraisalId),
          ruleId: window.parseInt(''),
        });
        if (res.success) {
          window.open(`${res.data}`, '_blank');
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
