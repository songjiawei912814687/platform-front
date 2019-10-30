<template>
    <div class="content-wrap">
        <h2 class="content__title">考核记录</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="规则类型：">
                <a-select placeholder='请选择规则类型' v-model="searchParams.ruleType" style="width: 100%;" >
                    <a-select-option v-for="item in classifyList"
                                     :value='String(item.id)'
                                     :key="String(item.id)">
                                      {{item.name}}
                    </a-select-option>
                </a-select>
            </search-box-item>
            <search-box-item label="组织结构：">
                <a-tree-select
                        style="width: 100%"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        :treeData="orgTreeData"
                        showSearch
                        treeNodeFilterProp="title"
                        placeholder='请选择组织机构'
                        treeDefaultExpandAll
                        v-model="searchParams.organizationId"
                />
            </search-box-item>
            <search-box-item label="姓名：">
                <a-input v-model="searchParams.name" placeholder="请输入姓名"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"
                      v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPRAISALRECORD_ADD') > -1 || !useAuthority">
                录入
            </a-button>
            <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPRAISALRECORD_EXPORT') > -1">导出
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
                       v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPRAISALRECORD_VIEW') > -1 || !useAuthority">查看</a>
                    <template
                            v-if="(authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPRAISALRECORD_EDITOR') > -1 || !useAuthority)&&userName===record.createdUserName">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template
                            v-if="(authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPRAISALRECORD_DELETE') > -1 || !useAuthority)&&record.complaintState===0&&userName===record.createdUserName">
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete(record.id)" okText="确认" cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPRAISALRECORD_RECORD') > -1
                            || !useAuthority" >
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleRecord(record)">日志</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPRAISALRECORD_APPEAL') > -1
                            || !useAuthority" >
                        <a-divider type="vertical" v-show="record.complaintStateName!=='待审批'&&record.complaintStateName!=='通过'"/>
                        <a href="javascript:;" @click="handleComplain(record)" v-show="record.complaintStateName!=='待审批'&&record.complaintStateName!=='通过'">申诉</a>
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
             :classifyList="classifyList"
             :ruleList="ruleList"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <ComplainAdd :addVisible="complainAddVisible"
                     @successCallback="handleComplainAddSuccess"
                     :planId="modifyId"
                     :handleClose="() => handleDrawerToggle('complainAddVisible', false)">
        </ComplainAdd>
        <record :addVisible="recordVisible"
             @successCallback="handleRecordAddSuccess"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('recordVisible', false)"></record>
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

import { selectPage, getDel, downloadFile } from '@/remote/score';
import { getRuleByIndexId, getPage, getRules } from '@/remote/rule';
import { getEmployeesAll } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox.vue';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem.vue';
import Add from './Add.vue';
import DetailView from './DetailView.vue';
import { autoDoFn, transformTree } from '@/utils/util';
import { getOrgTree } from '@/remote/base';
import ComplainAdd from '../Complain/Add.vue';
import RecordDetail from './RecordDetail.vue';
const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '考核规则',
    dataIndex: 'ruleName',
    width: 100,
  },
  {
    title: '组织机构',
    dataIndex: 'organizationName',
    width: 100,
  },
  {
    title: '被记录人',
    dataIndex: 'employeeName',
    width: 100,
  },
  {
    title: '扣分分值',
    dataIndex: 'value',
    width: 100,
  },
  {
    title: '申诉状态',
    dataIndex: 'complaintStateName',
    width: 100,
  },
  {
    title: '记录时间',
    dataIndex: 'recordDateTime',
    width: 100,
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
    ATreeSelect: TreeSelect,
    APopconfirm: Popconfirm,
    SearchBox,
    SearchBoxItem,
    Add,
    DetailView,
    ComplainAdd,
    Record:RecordDetail,
  },
  data() {
    return {
      columns,
      addVisible: false,
      complainAddVisible: false,
      recordVisible: false,
      modifyId: '',
      userName: localStorage.getItem('userName') === undefined || localStorage.getItem('userName') === 'undefined' ? localStorage.getItem('userName') : localStorage.getItem('userName'),
      employeesName: localStorage.getItem('employeesName') === undefined || localStorage.getItem('employeesName') === 'undefined' ? localStorage.getItem('employeesName') : localStorage.getItem('employeesName'),
      data: [],
      ruleList: [],
      classifyList: [{"id":1,'name':'工作纪律'},{"id":2,'name':'审执纪律'},{"id":3,'name':'组织纪律'},{"id":4,'name':'违规行为'}],
      viewVisible: false,
      searchParams: {},
      orgTreeData: [],
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1000,
      },
      state: '', // 状态
        pageSizeOptions: [10, 20, 30, 40, 50],
        pagination: {
            pageSize: 10,
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
        const orgRes = await getOrgTree();
        if (orgRes) {
             this.orgTreeData = transformTree(orgRes.data);
        }

        const res1 = await getRules();
        if (res1.success) {
          this.ruleList = res1.data;
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
          this.pagination.pageSize = res.data.pageSize;
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
          organizationId: '',
      };
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
          let res = await downloadFile(this.searchParams);
          if (res) {
              window.open(`${res.data}`, '_blank')
          }
      });
    },
    onPageChange(pagination) {
      this.pagination.page = pagination.current;
      this.$nextTick(() => {
        this.initList();
      });
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

     // 日志
    handleRecord(record) {
      this.handleDrawerToggle('recordVisible', true);
      this.modifyId = record.id;
    },
    handleRecordAddSuccess() {
      this.handleDrawerToggle('recordVisible', false);
      this.initList();
    },

  },
};
</script>

<style lang="less">

</style>
