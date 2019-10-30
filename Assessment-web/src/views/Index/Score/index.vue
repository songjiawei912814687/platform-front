<template>
    <div class="content-wrap">
        <h2 class="content__title">员工加减分</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">

            <search-box-item  label="查询时间：" :span="1">
                <a-range-picker :allowClear="false"
                                    v-model="searchParams.searchTime"
                                    style="width: 95%"
                                    format="YYYY-MM-DD"
                                    :placeholder="['开始日期','结束日期']">
                </a-range-picker>
            </search-box-item>
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
                              v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALEMPLOYEERECORD_EDITOR') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="changeValid(record)">有效</a>
                    </template>

                      <template
                              v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALEMPLOYEERECORD_EDITOR') > -1 || !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="changeUnValid(record)">无效</a>
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
    message
} from 'ant-design-vue';

import { selectPage, getDel, downloadFile,setvalid } from '@/remote/score';
import { getRuleByIndexId, getPage, getClassFy } from '@/remote/rule';
import { selectAll } from '@/remote/classify';
import { getEmployeesAll } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox.vue';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem.vue';
import Add from './Add.vue';
import DetailView from './DetailView.vue';
import { autoDoFn, transformTree } from '@/utils/util';
import { getOrgTree } from '@/remote/base';


const { Item } = Form;
const { Option } = Select;
const {RangePicker} = DatePicker;

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
    ATreeSelect: TreeSelect,
    APopconfirm: Popconfirm,
      ARangePicker: RangePicker,
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
      searchParams: {
          searchTime: [],
          // days: moment().subtract(1, 'days'),
      },
      orgTreeData: [],
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1550,
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
        const orgRes = await getOrgTree();
        if (orgRes) {
             this.orgTreeData = transformTree(orgRes.data);
        }
        const res = await selectAll({
          state: window.parseInt('0'),
          type: window.parseInt(''),
        });
        if (res.success) {
          this.classifyList = res.data;
        }
        const res1 = await getClassFy();
        if (res1.success) {
          this.ruleList = res1.data;
        }

      });
    },
      changeValid(rowDate){
          let id = rowDate.id;
          let validStatus = 0;
          autoDoFn(async ()=>{
              this.loading = true;
              const res = await setvalid({
                  id: id,
                  validStatus: validStatus
              });
              if(res) {
                  message.info(res.message)
                  this.initList();
              }else {
                  message.error(res.message)
                  this.initList();
              }

          })
      },

      changeUnValid(rowDate){
          let id = rowDate.id;
          let validStatus = 1;
          autoDoFn(async ()=>{
              this.loading = true;
              const res = await setvalid({
                  id: id,
                  validStatus: validStatus
              });
              if(res) {
                  message.info(res.message)
                  this.initList();
              }else {
                  message.error(res.message)
                  this.initList();
              }

          })
      },
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await selectPage({
          ...this.searchParams,
          ...this.pagination,

            // days: this.searchParams.days==''?'':this.searchParams.days.format("YYYY-MM-DD"),
            startDate: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
            endDate:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',

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
        const res = await downloadFile({
          ...this.searchParams,
          ...this.pagination,
          appraisalId: window.parseInt(this.searchParams.appraisalId),
          startDate: this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
          endDate:this.searchParams.searchTime!=undefined&&this.searchParams.searchTime.length==2?this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
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

      changehandle2() {
          this.searchParams.searchTime = []
      },

  },
};
</script>

<style lang="less">

</style>
