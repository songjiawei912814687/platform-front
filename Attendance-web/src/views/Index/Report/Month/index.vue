<template>
    <div class="content-wrap">
        <h2 class="content__title">考勤月报表</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="统计时间：">
                <a-range-picker :allowClear="false"
                               format="YYYY-MM-DD"
                                style="width: 100%"
                               v-model="searchParams.searchTime" :placeholder="['请选择日期', '请选择日期']"></a-range-picker>
            </search-box-item>
            <search-box-item label="姓名：">
                <a-input v-model="searchParams.name" placeholder='请输入姓名'/>
            </search-box-item>
            <search-box-item label="工号：">
                <a-input v-model="searchParams.no" placeholder='请输入工号'/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_ATTENDANCE_STATISTICALREPORTS_ATTENDANCEMONTHLYSTATEMENT_EXPORT') > -1">导出</a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :rowKey="record => String(record.employeeId)"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :pagination="pagination">
                <span slot="lateness" slot-scope="text, record">
                  <span v-if="record.lateness === '0次'">{{record.lateness}}</span>
                  <a href="javascript:0" v-if="record.lateness !== '0次'" @click="handleDetailShow(record,1,'迟到')">{{record.lateness}}</a>
                </span>
                <span slot="leaveEarlyTimes" slot-scope="text, record">
                  <span v-if="record.leaveEarlyTimes === '0次'">{{record.leaveEarlyTimes}}</span>
                  <a href="javascript:0" v-if="record.leaveEarlyTimes !== '0次'" @click="handleDetailShow(record,2,'早退')">{{record.leaveEarlyTimes}}</a>
                </span>
                <span slot="notPunchTimes" slot-scope="text, record">
                  <span v-if="record.notPunchTimes === '0次'">{{record.notPunchTimes}}</span>
                  <a href="javascript:0" v-if="record.notPunchTimes !== '0次'"  @click="handleDetailShow(record,3,'未打卡')">{{record.notPunchTimes}}</a>
                </span>
                <span slot="days" slot-scope="text, record">
                  <span v-if="record.days === '0.0天'">{{record.days}}</span>
                  <a href="javascript:0" v-if="record.days !== '0.0天'" @click="handleDetailShow(record,4,'请假')">{{record.days}}</a>
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
          <data-list :modal="modal" @close="handleDateListClose" />
        </div>
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
import { getPage, exportExcel } from '@/remote/reportMonth';
import { getOrgTree } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import { autoDoFn, transformTree } from '@/utils/util';
import moment from 'moment';
import DataList from './DataList'

const { Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: '姓名',
    dataIndex: 'employeeName',
    width: 200,
  },
  {
    title: '工号',
    dataIndex: 'employeeNo',
    width: 200,
  },
  {
    title: '所属部门',
    dataIndex: 'organizationName',
    width: 200,
  },
    {
        title: '补录次数',
        dataIndex: 'supplementTimes',
        width: 200,
    },
  {
    title: '迟到次数',
    dataIndex: 'lateness',
    width: 200,
    scopedSlots: {
      customRender: 'lateness'
    },
  },
  {
    title: '早退次数',
    dataIndex: 'leaveEarlyTimes',
    width: 200,
    scopedSlots: {
      customRender: 'leaveEarlyTimes'
    },
  },
  {
    title: '未打卡次数',
    dataIndex: 'notPunchTimes',
    width: 200,
    scopedSlots: {
      customRender: 'notPunchTimes'
    },
  },
  {
    title: '请假天数',
    dataIndex: 'days',
    width: 200,
    scopedSlots: {
      customRender: 'days'
    },
  },
];

const leaveColumns = [
	    {
			title: '请假类型',
			dataIndex: 'applicationTypeName',
			width: 300,
		},
		{
			title: '开始时间',
			dataIndex: 'startTime',
			width: 300,
			scopedSlots: {
				customRender: 'startTime'
			},
		},
		{
			title: '结束时间',
			dataIndex: 'endTime',
			width: 300,
			scopedSlots: {
				customRender: 'endTime'
			},
		}

	];

const dailyDateColumns = [{
			title: '姓名',
			dataIndex: 'employeeName',
			width: 150,
		},
		{
			title: '工号',
			dataIndex: 'employeeNo',
			width: 150,
    },
    {
			title: '考勤日期',
			dataIndex: 'attendanceDate',
			width: 250,
		},
    
		{
			title: '上班打卡时间',
			dataIndex: 'signInTime',
			scopedSlots: {
				customRender: 'goToWork'
			},
			width: 250,
		},
		{
			title: '下班打卡时间',
			dataIndex: 'signOutTime',
			scopedSlots: {
				customRender: 'goHome'
			},
			width: 250,
		},
		{
			title: '请假',
			dataIndex: 'isLeave',
			width: 200,
			scopedSlots: {
				customRender: 'leave'
			},
		},
		{
			title: '迟到',
			dataIndex: 'beLate',
			width: 200,
		},
		{
			title: '早退',
			dataIndex: 'leaveEarly',
			width: 200,
		},
		{
			title: '未打卡',
			dataIndex: 'punch',
			width: 200,
		},
		{
			title: '状态',
			dataIndex: 'statusName',
			width: 200,
		},
        {
            title: '核销假状态',
            dataIndex: 'verification',
            width: 200,
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
    ARangePicker: RangePicker,
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
      date: '',
      viewVisible: false,
      searchParams: {
        no: '',
        name:'',
        searchTime: [moment().subtract(1, 'month'), moment()],
      },
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
      orgTreeData: [],
      staffList: [],
      authorityActionList: window.authorityActionList,
      modal: {
        visible: false,
        columns: [],
        title: '',
        record: {},
      }
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
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getPage({
          ...this.searchParams,
          startTime: this.searchParams.searchTime[0].format("YYYY-MM-DD")+' 00:00:00',
          endTime: this.searchParams.searchTime[1].format("YYYY-MM-DD")+ ' 23:59:59',
        });
        if (res) {
          this.data = res.data;
					this.pagination.total = res.data.length
        }
        this.loading = false;
      });
    },
    initBaseData() {
      const that = this;
      autoDoFn(async () => {
        const orgRes = await getOrgTree();
        if (orgRes) {
          that.orgTreeData = transformTree(orgRes.data);
        }
      });
    },
    handleSearch() {
      this.initList();
    },
    handleReset() {
      this.searchParams = {
        no: '',
        name:'',
        searchTime: [moment().subtract(1, 'month'), moment()],
      };
      this.$nextTick(() => {
        this.initList();
      });
    },
    disabledDate(currentDate){
      if(!currentDate){
        return false;
      }
      return moment(currentDate.format("YYYY-MM-DD")).valueOf() > moment(moment().format("YYYY-MM-DD")).valueOf();
    },
    exportExcel(){
      autoDoFn(async () => {
        let res = await exportExcel({
            ...this.searchParams,
          startTime: this.searchParams.searchTime[0].format("YYYY-MM-DD")+ ' 00:00:00',
          endTime: this.searchParams.searchTime[1].format("YYYY-MM-DD")+' 23:59:59',
        });
        if(res){
          window.open(`${res.data}`, '_blank')
        }
      })
    },

    handleDetailShow(record,type,typeName) {
      let begin =  this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD") : '';
      let end = this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD") : '';
      this.modal = {
        visible: true,
        columns: type===4?leaveColumns:dailyDateColumns,
        title: '查看'+typeName+'记录',
        record: {
          employeeNo: record.employeeNo,
          begin,
          end,
          type,
        },
      }
    },

    handleDateListClose() {
      this.modal = {
        visible: false,
        columns: [],
        title: '',
        record: {},
      }
    }
  },
};
</script>

<style lang="less">

</style>
