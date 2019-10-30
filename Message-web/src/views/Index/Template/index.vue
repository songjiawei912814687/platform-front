<template>
    <div class="content-wrap template-wrap">
        <h2 class="content__title">考核模版</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="模版名称：">
                <a-input v-model="searchParams.name" placeholder="请输入模版名称"/>
            </search-box-item>
            <search-box-item label="模版类型：">
                <a-select placeholder='请选择模版类型' v-model="searchParams.type">
                    <a-select-option value='0'>月度考核</a-select-option>
                    <a-select-option value='1'>年度考核</a-select-option>
                </a-select>
            </search-box-item>
            <search-box-item label="对象类型：">
                <a-select placeholder='请选择对象类型' v-model="searchParams.objectType">
                    <a-select-option value='0'>窗口</a-select-option>
                    <a-select-option value='1'>工作人员</a-select-option>
                </a-select>
            </search-box-item>
            <!--<search-box-item label="启用状态：">
                <a-select placeholder='请选择启用状态' v-model="searchParams.state">
                    <a-select-option value='0'>启用</a-select-option>
                    <a-select-option value='1'>停用</a-select-option>
                </a-select>
            </search-box-item>-->
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"  v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALTEMPLATE_ADD') > -1 || !useAuthority">录入</a-button>
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
                       v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALTEMPLATE_VIEW') > -1|| !useAuthority">查看</a>
                    <template v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALTEMPLATE_EDITOR') > -1|| !useAuthority">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALTEMPLATE_RULESETTING') > -1|| !useAuthority">
                        <a-divider type="vertical" v-show="record.state === 0"/>
                        <a href="javascript:;" v-show="record.state === 0" @click="handleRuleShow(record)">规则设置</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALTEMPLATE_GENERATEASSESSMENTPLAN') > -1|| !useAuthority">
                        <a-divider type="vertical" v-show="record.state === 0"/>
                        <a href="javascript:;" @click="handleReportShow(record)" v-show="record.state === 0">生成报表</a>
                    </template>
                     <template
                             v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALTEMPLATE_START') > -1 || !useAuthority">
                        <a-divider type="vertical" v-show="record.state === 1"/>
                        <a href="javascript:;" @click="handleChangeState(record,true)"
                           v-show="record.state === 1">启用</a>
                    </template>
                   <template
                           v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALTEMPLATE_STOP') > -1 || !useAuthority">
                        <a-divider type="vertical" v-show="record.state === 0"/>
                        <a href="javascript:;" @click="handleChangeState(record,false)"
                           v-show="record.state === 0">停用</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALTEMPLATE_DELETE') > -1|| !useAuthority">
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
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <!--规则-->
        <RuleList :visible="permissionsVisible"
                  :roleId="modifyId"
                  @cancel="() => this.permissionsVisible = false"
                  @successCallback="() => this.permissionsVisible = false"
        ></RuleList>
        <!--生成报表-->
        <a-modal
                title="生成考核计划报表"
                :visible="reportVisible"
                @ok="handleReportSubmit"
                :confirmLoading="confirmLoading"
                @cancel="handleReportCancel"
        >
            <a-form @submit="handleReportSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label='年'
                                fieldDecoratorId="year"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请选择年!' }], trigger: 'on-change'}"
                        >
                            <DatePicker type="year" placeholder="请选择年" style="width: 100%"></DatePicker>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='月'
                                fieldDecoratorId="month"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请选择月!'}]}">
                            <a-month-picker
                                    dropdownClassName="monthPickerClass"
                                    :getCalendarContainer="triggerNode => triggerNode.parentNode"
                                    format="MM" placeholder="请选择月" style="width: 100%" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
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
  Modal,
} from 'ant-design-vue';
import { getPage, getDel, getStart, getStop, createPlanAndPlanDetail } from '@/remote/template';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import RuleList from './RuleList';
import { autoDoFn } from '@/utils/util';
import moment from 'moment';

const { Item } = Form;
const { Option } = Select;
const { MonthPicker } = DatePicker;


const columns = [
  {
    title: '模版名称',
    dataIndex: 'name',
    width: 400,
  },
  {
    title: '模版类型',
    dataIndex: 'typeName',
    width: 200,
  },
  {
    title: '对象类型',
    dataIndex: 'objectTypeName',
    width: 200,
  },
  {
    title: '考核对象',
    dataIndex: 'objectNameList',
    width: 400,
  },
  {
    title: '状态',
    dataIndex: 'stateName',
    width: 200,
  },
  {
    title: '基准分',
    dataIndex: 'datumValue',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    width: 350,
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
    AModal: Modal,
    AMonthPicker: MonthPicker,
    SearchBox,
    SearchBoxItem,
    Add,
    DetailView,
    RuleList,
  },
  data() {
    return {
      columns,
      addVisible: false,
      modifyId: '',
      data: [],
      viewVisible: false,
      reportVisible: false,
      confirmLoading: false,
      searchParams: {
        name: '',
        type: '',
        objectType: '',
      },
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1000,
      },
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        pagination: {
            pageSize: '10',
            defaultCurrent: 1,
            total: 0,
            rows: 10,
            page: 0,
        },
      roleId: '',
      permissionsVisible: false,
      authorityActionList: window.authorityActionList,
      useAuthority: window.defaultConfig.useAuthority,
    };
  },
  created() {
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
        objectType: '',
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
    handleDelete(id) {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getDel({ id });
        if (res) {
          this.$message.success('删除成功');
          this.initList();
        }
        this.loading = false;
      });
    },
    // 启用与停用
    handleChangeState(data, type) {
      this.loading = true;
      if (type) {
        autoDoFn(async () => {
          const res = await getStart({ templateId: data.id });
          if (res.success) {
            this.$message.success('操作成功！');
          }
          this.loading = false;
          this.initList();
        });
      } else {
        autoDoFn(async () => {
          const res = await getStop({ templateId: data.id });
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
    handleRuleShow(record) {
      this.permissionsVisible = true;
      this.modifyId = record.id;
    },
    handleReportShow(record) {
      this.modifyId = record.id;
      this.reportVisible = true;
    },
    handleReportCancel(record) {
      this.modifyId = '';
      this.reportVisible = false;
    },
    handleReportSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            this.confirmLoading = true;
            const res = await createPlanAndPlanDetail({
              templatetId: this.modifyId,
              year: values.year ? moment(values.year).format('YYYY') : '',
              month: values.month ? moment(values.month).format('MM') : '',
            });
            if (res.success) {
              this.$message.success('操作成功');
              this.reportVisible = false;
            }
            this.confirmLoading = false;
          });
        }
      });
    },
  },
};
</script>

<style lang="less">

</style>
