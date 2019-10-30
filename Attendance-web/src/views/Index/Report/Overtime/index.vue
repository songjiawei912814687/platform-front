<template>
    <div class="content-wrap">
        <h2 class="content__title">加班报表</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="报表时间：">
                <a-month-picker v-model="searchParams.reportDate" format="YYYY-MM" placeholder="请选择时间" style="width: 100%"/>
            </search-box-item>
            <search-box-item label="所属机构：">
                <a-input v-model="searchParams.organizationName" placeholder="请输入所属机构"/>
            </search-box-item>
            <search-box-item label="人员：">
                <a-input v-model="searchParams.employeesName" placeholder="请输入人员姓名"/>
            </search-box-item>
            <search-box-item label="市民卡银行卡号：">
                <a-input v-model="searchParams.bankCardNumber" placeholder="请输入市民卡银行卡号"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="exportExcel"
                      v-if="authorityActionList.indexOf('A_ATTENDANCE_STATISTICALREPORTS_OVERTIMEREPORT_EXPORT') > -1">
                导出
            </a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     @change="onPageChange"
                     :rowKey="record => String(record.id)"
                     :pagination="pagination">
                <span slot="overTimeCount" slot-scope="text, record">
                    <a href="javascript:;" v-if="record.overTimeCount > 0" @click="handleOverTimeShow(record)">{{record.overTimeCount}}</a>
                </span>
                <span slot="restCount" slot-scope="text, record">
                    <a href="javascript:;" v-if="record.restCount > 0" @click="handleRestShow(record)">{{record.restCount}}</a>
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
        <data-list :modal="modal" @close="dataListClose"/>
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
  import {getPage, exportExcel} from '@/remote/reportOvertime';
  import SearchBox from '@/components/SearchBox/SearchBox';
  import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
  import {autoDoFn, transformTree, jsonToUrl, apiVersion} from '@/utils/util';
  import DataList from './DataList';
  import moment from 'moment'

  const {Item} = Form;
  const {Option} = Select;
  const {MonthPicker} = DatePicker;

  const columns = [
    {
      title: '组织机构',
      dataIndex: 'organizationName',
      width: 300,
    },
    {
      title: '姓名',
      dataIndex: 'employeesName',
      width: 300,
    },
    {
      title: '市民卡银行卡号',
      dataIndex: 'bankCardNumber',
      width: 500,
    },
    {
      title: '加班次数',
      dataIndex: 'overTimeCount',
      width: 200,
      scopedSlots: {customRender: 'overTimeCount'},
    },
    {
      title: '调休次数',
      dataIndex: 'restCount',
      width: 200,
      scopedSlots: {customRender: 'restCount'},
    },
    {
      title: '合计',
      dataIndex: 'amount',
      width: 300,
    },
  ];

  const overTimeColumns = [
    {
      title: '单位',
      dataIndex: 'organizationName',
      width: 300,
    },
    {
      title: '姓名',
      dataIndex: 'employeesName',
      width: 300,
    },
    {
      title: '加班日期',
      dataIndex: 'overTimeDate',
      width: 300,
    },
  ];

  const adjustColumns = [
    {
      title: '单位',
      dataIndex: 'organizationName',
      width: 300,
    },
    {
      title: '姓名',
      dataIndex: 'employeesName',
      width: 300,
    },
    {
      title: '调休日期',
      dataIndex: 'restTime',
      width: 300,
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
      ATreeSelect: TreeSelect,
      AMonthPicker: MonthPicker,
      SearchBox,
      SearchBoxItem,
      DataList,
    },
    data() {
      return {
        columns,
        addVisible: false,
        modifyId: '',
        data: [],
        viewVisible: false,
        searchParams: {
          organizationName: '',
          employeesName: '',
          bankCardNumber: '',
          reportDate: moment().subtract(1, 'months'),
        },
        loading: false,
        scroll: {
          y: document.documentElement.clientHeight - 360,
          x: 1000,
        },
        orgTreeData: [],
        staffList: [],
          pageSizeOptions: ['10', '20', '30', '40', '50'],
          pagination: {
              pageSize: '10',
              defaultCurrent: 1,
              total: 0,
              rows: 10,
              page: 0,
          },
        authorityActionList: window.authorityActionList,

        modal: {
          visible: false,
          columns: [],
          title: '',
          getPageName: '',
          record: {},
          reportDate: moment().subtract(1, 'months').format("YYYY-MM")
        }
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
            reportDate: this.searchParams.reportDate.format("YYYY-MM")
          });
          if (res) {
            this.data = res.data;
            this.pagination.total = res.data.length;
          }
          this.loading = false;
        });
      },
      handleSearch() {
        this.initList();
      },
      handleReset() {
        this.searchParams = {
          organizationName: '',
          employeesName: '',
          bankCardNumber: '',
          reportDate: moment().subtract(1, 'month'),
        };
        this.pagination = {
          defaultCurrent: 1,
          pageSize: 10,
          pageNum: 0,
          total: 0,
        };
        this.$nextTick(() => {
          this.initList();
        });
      },
      onPageChange(pagination) {
        this.pagination.page = pagination.current;
        this.$nextTick(() => {
        });
      },
      exportExcel() {
        autoDoFn(async () => {
          let res = await exportExcel({
            ...this.searchParams,
            reportDate: this.searchParams.reportDate.format("YYYY-MM")
          });
          if (res) {
            window.open(`${res.data}`, '_blank')
          }
        })
      },
      handleOverTimeShow(record) {
        this.modal = {
          visible: true,
          columns: overTimeColumns,
          title: '查看加班记录',
          getPageName: 'getOverTimePage',
          record,
          reportDate: this.searchParams.reportDate.format("YYYY-MM")
        }
      },
      handleRestShow(record) {
        this.modal = {
          visible: true,
          columns: adjustColumns,
          title: '查看调休记录',
          getPageName: 'getAdjustPage',
          record,
          reportDate: this.searchParams.reportDate.format("YYYY-MM")
        }
      },
      dataListClose(record) {
        this.modal = {
          visible: false,
          columns: [],
          title: '',
          getPageName: '',
          record: {},
          reportDate: '',
        }
      },
    },
  };
</script>

<style lang="less">

</style>
