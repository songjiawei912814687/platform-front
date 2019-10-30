<template>
    <div class="content-wrap">
        <h2 class="content__title">收件箱</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="业务类型：">
                <a-select placeholder='请选择业务类型' v-model="searchParams.type">
                    <a-select-option value='1'>窗口回访</a-select-option>
                    <a-select-option value='2'>审批类型</a-select-option>
                    <a-select-option value='3'>窗口评价</a-select-option>
                    <a-select-option value='4'>会议提醒</a-select-option>
                    <a-select-option value='5'>通知部门管理员</a-select-option>
                    <a-select-option value='6'>窗口再次评价</a-select-option>
                    <a-select-option value='7'>窗口再次回访</a-select-option>
                    <a-select-option value='99'>手动发送</a-select-option>
                </a-select>
            </search-box-item>
            <search-box-item label="回复号码：">
                <a-input v-model="searchParams.sendTelephone" placeholder="请输入接收号码"/>
            </search-box-item>

            <search-box-item label="回复内容：">
                <a-input v-model="searchParams.content" placeholder="请输入回复内容"/>
            </search-box-item>

            <search-box-item  label="接收时间：" :span="1">
            	<a-range-picker @change="changehandle2" v-model="searchParams.searchTime" style="width: 100%" format="YYYY-MM-DD" :placeholder="['请选择时间', '请选择时间']"></a-range-picker>
            </search-box-item>
          </search-box>
        <div class="action">
            <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALRULE_ADD') > -1 || !useAuthority">导出</a-button>
        </div>
        <div class="content" >
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)" v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALRULE_VIEW') > -1 || !useAuthority">查看</a>
                    <a-divider type="vertical"/>
                    <!--<a href="javascript:;" @click="exportExcel(record.id)" v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALRULE_VIEW') > -1 || !useAuthority">导出</a>-->
                    <template v-if="authorityActionList.indexOf('A_ASSESSMENT_APPRAISALRULE_DELETE') > -1 || !useAuthority">
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
import { getPage, exportExcel, getDelete } from '@/remote/receive';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import Add from './Add';
import DetailView from './DetailView';
import { autoDoFn, transformTree } from '@/utils/util';
import moment from 'moment';

const {
		RangePicker
	} = DatePicker;
const { Item } = Form;
const { Option } = Select;
const columns = [
  {
    title: '业务类型',
    dataIndex: 'typeName',
    width: 200,
  },
  {
    title: '发送者姓名',
    dataIndex: 'sendName',
    width: 200,
  },
  {
    title: '发送号码',
    dataIndex: 'sendTelephone',
    width: 200,
  },
  {
    title: '发送时间',
    dataIndex: 'sendTime',
    width: 350,
  },

  {
    title: '短信内容',
    dataIndex: 'description',
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
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
      data: [
        {},
      ],
      viewVisible: false,
      searchParams: {
				searchTime: [],
        name: '',
          content:'',
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
    // this.initBaseData();
    this.initList();
  },
  methods: {
      onShowSizeChange() {
          this.pagination.rows = this.pagination.pageSize
          this.initList()
      },
    moment,
    initBaseData() {
      autoDoFn(async () => {
      });
    },
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getPage({
          ...this.searchParams,
        startDate: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD 00:00:00") : '',
        endDate: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD 23:59:59") : '',
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
          searchTime: [],
          name: '',
          content:'',
      };
      this.pagination = {
        defaultCurrent: 1,
        // total: 0,
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
        const res = await getDelete({ id });
        if (res.success) {
          this.$message.success('删除成功');
          this.initList();
        }else{
          this.loading = false;
        }
      });
    },
    // 导出
    exportExcel() {
      autoDoFn(async () => {
        const res = await exportExcel({
            ...this.searchParams,
            startDate: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD 00:00:00") : '',
            endDate: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD 23:59:59") : '',
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
