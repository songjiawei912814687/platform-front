<template>
    <div class="content-wrap">
        <h2 class="content__title">考勤规则配置</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="规则名称：">
                <a-input v-model="searchParams.name" placeholder="请输入规则名称"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)" v-if="authorityActionList.indexOf('A_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCERULE_CONFIG_ADD') > -1">录入</a-button>
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
                    <a href="javascript:;" v-if="authorityActionList.indexOf('A_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCERULE_CONFIG_CHECK') > -1" @click="handleViewShow(record)">查看</a>
                    <template v-if="authorityActionList.indexOf('A_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCERULE_CONFIG_UPDATE') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCERULE_CONFIG_DEL') > -1">
                        <a-divider v-if="!record.type" type="vertical"/>
                        <a-popconfirm v-if="!record.type" title="配置中有考勤规则确定删除?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                    <template >
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="action(record)" v-if="authorityActionList.indexOf('A_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCERULENEW__ADD') > -1">新建考勤规则</a>
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
        <add-config :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('addVisible', false)">
        </add-config>

        <new-rule-index :newRuleViewVisible="newRuleViewVisible"
            @successCallback="handleAddSuccess"
            :modifyId="modifyId"
            :attendanceRuleConfigId = "attendanceRuleConfigId"
            :handleClose="() => handleDrawerToggle('newRuleViewVisible', false)">
        </new-rule-index>

        <rule-config-detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)">
        </rule-config-detail-view>
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
import { getPage, getDel} from '@/remote/attendanceRuleConfig';
import { getOrgTree } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import AddConfig from './RuleConfigAdd';
import RuleConfigDetailView from './RuleConfigDetailView';
import NewRuleIndex from './NewRuleIndex';
import { autoDoFn, transformTree } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '配置名称',
    dataIndex: 'name',
    width: 400,
  },
  {
    title: '配置说明',
    dataIndex: 'description',
    width: 400,
  },
  {
    title: '操作',
    key: 'action',
    width: 230,
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
    AddConfig,
    RuleConfigDetailView,
    NewRuleIndex,
  },
  data() {
    return {
      columns,
      attendanceRuleConfigId:'',
      addVisible: false,
      modifyId: '',
      data: [],
      viewVisible: false,
      newRuleViewVisible:false,
      searchParams: {
      name: '',
      },
      description:'',
      loading: false,
      scroll: {
        y: document.documentElement.clientHeight - 360,
        x: 1000,
      },
        pageSizeOptions: [10, 20, 30, 40, 50],
        pagination: {
            pageSize: 10,
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
  methods: {
      onShowSizeChange() {
          this.pagination.rows = this.pagination.pageSize
          this.initList()
      },
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getPage({ ...this.searchParams });
        if (res) {
          this.data = res.data.list;
          this.pagination.total = res.data.total;
          this.pagination.page = res.data.pageNum;
          this.pagination.rows = res.data.pageSize;
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
        this.loading = true;
        const res = await getDel(data);
        if (res) {
          this.$message.success('删除成功');
          this.initList();
        }
        this.loading = false;
      });
    },
      action(data){
          this.attendanceRuleConfigId = data.id;
          this.newRuleViewVisible = true;
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
