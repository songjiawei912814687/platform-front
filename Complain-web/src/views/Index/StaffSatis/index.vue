<template>
    <div class="content-wrap">
        <h2 class="content__title">人员满意度统计</h2>

        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="统计时间：" :span="2">
                <a-range-picker v-model="searchParams.searchTime"
                                style="width: 100%"
                                :allowClear="false"
                                format='YYYY-MM-DD'/>
            </search-box-item>

            <search-box-item label="工号：">
                <a-input v-model.number="searchParams.employeesNo" placeholder="请输入工号"/>
            </search-box-item>
        </search-box>

        <div class="action">
            <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_FEEDBACK_PERSONNELSATISFACTIONSTATISTICS_EXPORT') > -1">导出</a-button>
        </div>

        <div class="content">
            <a-table :columns="columns"
                     :dataSource="tableData"
                     :loading="loading"
                     :rowKey="record => parseInt(100*Math.random())"
                     @change="onPageChange"
                     :pagination="true">
                 <span slot="unsatisfactoryNumbers" slot-scope="text, record">
					<span v-if="parseInt(record.unsatisfactoryNumbers) ===0">{{record.unsatisfactoryNumbers}}</span>
					<a href="javascript:" v-if="parseInt(record.unsatisfactoryNumbers) >0" @click="handleUnsatisfactory(record)">{{record.unsatisfactoryNumbers}}</a>
				</span>

                <span slot="runManyTimes" slot-scope="text, record">
					<span v-if="parseInt(record.runManyTimes) ===0">{{record.runManyTimes}}</span>
					<a href="javascript:" v-if="parseInt(record.runManyTimes) >0" @click="handleRunManyTimes(record)">{{record.runManyTimes}}</a>
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
                <!--<span style="margin-left: 10px">共{{pagination.total}}条</span>-->
            </div>
        </div>

        <un-satisfaction-data :modal="unSatisModal" @close="handleUnSatisfactionClose"/>
        <run-many-data :modal="runManyModal" @close="handleRunManyClose"/>
    </div>
</template>

<script>

  import {
    Row,
    Col,
    Input,
    Button,
    Table,
    Select,
    Upload,
    Icon,
    Divider,
    Popconfirm,
    DatePicker,
  } from 'ant-design-vue';
  import moment from 'moment';
  import unSatisfactionData from './unSatisfactionData';
  import runManyData from './runManyData';
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  import { autoDoFn, formatTimes } from '@/utils/util';
  import SearchBox from '@/components/SearchBox/SearchBox';
  import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
  import { getPage, exportExcel } from '@/remote/staffSatis';

  const columns = [
    {
      title: '工号',
      dataIndex: 'employeesNo',
      width: 150,
    }, {
      title: '部门',
      dataIndex: 'organizationName',
      width: 200,
    }, {
      title: '姓名',
      dataIndex: 'employeesName',
      width: 150,
    }, {
      title: '满意数',
      dataIndex: 'satisfactoryNumbers',
      width: 150,
    }, {
      title: '不满意数',
      dataIndex: 'unsatisfactoryNumbers',
      width: 150,
          scopedSlots: {
              customRender: 'unsatisfactoryNumbers'
          },
    }, {
      title: '满意率',
      dataIndex: 'satisfactionRate',
      width: 150,
    }, {
      title: '跑一次',
      dataIndex: 'runOneTimes',
      width: 150,
    }, {
      title: '跑多次',
      dataIndex: 'runManyTimes',
      width: 150,
          scopedSlots: {
              customRender: 'runManyTimes'
          },
    }, {
      title: '实现率',
      dataIndex: 'realizationRate',
      width: 150
    }
  ];

  const unSatisColumns = [
      {
          title:'群众姓名',
          dataIndex: 'personName',
          width:150,
      },
      {
          title:'群众电话',
          dataIndex: 'phone',
          width:150,
      },
      {
          title:'员工工号',
          dataIndex: 'employeesNo',
          width:150,
      },
      {
          title:'员工姓名',
          dataIndex: 'employeesName',
          width:150,
      },{
          title:'投诉时间',
          dataIndex: 'feedbackTime',
          width:200,
      },{
          title:'办理事项',
          dataIndex: 'matters',
          width:250,
      },{
          title:'满意度',
          dataIndex: 'satisfactionName',
          width:150,
      },
  ];

  const runManyColumns = [
      {
          title:'群众姓名',
          dataIndex: 'personName',
          width:150,
      },
      {
          title:'群众电话',
          dataIndex: 'phone',
          width:150,
      },
      {
          title:'员工工号',
          dataIndex: 'employeesNo',
          width:150,
      },
      {
          title:'员工姓名',
          dataIndex: 'employeesName',
          width:150,
      }
      ,{
          title:'投诉时间',
          dataIndex: 'feedbackTime',
          width:250,
      },{
          title:'办理事项',
          dataIndex: 'matters',
          width:250,
      },{
          title:'实现率',
          dataIndex: 'completeRateName',
          width:150,
      },
  ];


  export default {
    name: 'index',
    components: {
      AInput: Input,
      ARow: Row,
      ACol: Col,
      AButton: Button,
      ATable: Table,
      ASelect: Select,
      ASelectOption: Option,
      AUpload: Upload,
      AIcon: Icon,
      ADivider: Divider,
      APopconfirm: Popconfirm,
      ARangePicker: RangePicker,
      SearchBox,
      SearchBoxItem,
      unSatisfactionData,
      runManyData,
      ADatePicker: DatePicker
    },
    data() {
      return {
        departmentList: [],
        searchParams: {
          searchTime: [moment('01', 'DD'), moment()],
          employeesNo: null,
        },
        tableData: [],
        columns: columns,
        loading: false,
          pageSizeOptions: ['10', '20', '30', '40', '50'],
          pagination: {
              pageSize: '10',
              defaultCurrent: 1,
              total: 0,
              rows: 10,
              page: 0,
          },
          unSatisModal:{
              unSatisVisible: false,
              unSatisColumns: [],
              title: '',
              unSatisRecord: {},
          },
          runManyModal : {
              runManyVisible: false,
              runManyColumns: [],
              title: '',
              runManyRecord: {},
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
      moment,
      formatTimes,
      initList() {
        autoDoFn(async () => {
          this.loading = true;
          let params = {
            startTime: this.searchParams.searchTime[0].format('YYYY-MM-DD') + ' 00:00:00',
            endTime: this.searchParams.searchTime[1].format('YYYY-MM-DD') + ' 00:00:00',
            employeesNo: this.searchParams.employeesNo
          };
          const res = await getPage({
            ...params,
            ...this.pagination,
          });
          if (res.success) {
            this.tableData = res.data;
            this.pagination.total = res.data.total;
            this.pagination.page = res.data.pageNum;
            this.pagination.row = res.data.pageSize;
          }

          this.loading = false;
        });
      },
      handlePicker(date) {
        console.log(date);
      },
      handleSearch() {
        this.initList();
      },
      handleReset() {
        this.searchParams = {
          searchTime: [moment('01', 'DD'), moment()],
          employeesNo: null,
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

      onPageChange(pagination) {
        this.pagination.page = pagination.current;
        this.$nextTick(() => {
        });
      },

      exportExcel() {
        autoDoFn(async () => {
          let params = {
            startTime: this.searchParams.searchTime[0].format('YYYY-MM-DD') + ' 00:00:00',
            endTime: this.searchParams.searchTime[1].format('YYYY-MM-DD') + ' 00:00:00',
            employeesNo: this.searchParams.employeesNo
          };
          const res = await exportExcel({
            ...params
          });
          if (res) {
            window.open(`${res.data}`, '_blank');
          }
        });
      },
        handleUnsatisfactory(record){
            this.unSatisModal = {
                unSatisVisible: true,
                unSatisColumns: unSatisColumns,
                title: '不满意详情',
                //传递的参数的值
                unSatisRecord: {
                    satisfaction: '1',
                    empNo: record.employeesNo,
                    startTime:this.searchParams.searchTime[0].format('YYYY-MM-DD') + ' 00:00:00',
                    endTime:this.searchParams.searchTime[1].format('YYYY-MM-DD') + ' 23:59:59'
                },
            }
        },
        handleUnSatisfactionClose(){
            this.unSatisModal = {
                unSatisVisible: false,
                unSatisColumns: [],
                title: '',
                //传递的参数的值
                unSatisRecord: {},
            }
        },
        handleRunManyTimes(record){
            this.runManyModal = {
                runManyVisible: true,
                runManyColumns: runManyColumns,
                title: '跑多次详情',
                //传递的参数的值
                runManyRecord: {
                    completeRate: '2',
                    empNo: record.employeesNo,
                    startTime:this.searchParams.searchTime[0].format('YYYY-MM-DD') + ' 00:00:00',
                    endTime:this.searchParams.searchTime[1].format('YYYY-MM-DD') + ' 23:59:59'
                },
            }
        },
        handleRunManyClose(){
            this.runManyModal = {
                runManyVisible: false,
                runManyColumns: [],
                title: '',
                //传递的参数的值
                runManyRecord: {},
            }
        }
    }
  };
</script>

<style scoped>

</style>
