<template>
    <div class="content-wrap">
        <h2 class="content__title">部门满意度统计</h2>

        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="统计时间：" :span="2">
                <a-range-picker v-model="searchParams.searchTime"
                                style="width: 100%"
                                :allowClear="false"
                         format='YYYY-MM-DD'/>
            </search-box-item>
            <search-box-item label="组织机构：">
                <a-tree-select
                        style="width: 100%"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                         v-model="searchParams.organizationId"
                         :treeData="organizationOptions"
                         treeDefaultExpandAll
                        :showSearch='true'
                        treeNodeFilterProp="title"
                        placeholder="请选择组织机构"
                        ></a-tree-select>
            </search-box-item>
        </search-box>

        <div class="action">
            <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_FEEDBACK_DEPARTMENTALSATISFACTIONSTATISTICS_EXPORT') > -1">导出</a-button>
        </div>

        <div class="content">
            <a-table :columns="columns"
                     :dataSource="tableData"
                     :loading="loading"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="true">

                <span slot="notSatisfactionNumber" slot-scope="text, record">
					<span v-if="parseInt(record.notSatisfactionNumber) ===0">{{record.notSatisfactionNumber}}</span>
					<a href="javascript:" v-if="parseInt(record.notSatisfactionNumber) >0" @click="handleNotSatisfaction(record)">{{record.notSatisfactionNumber}}</a>
				</span>

                <span slot="runMany" slot-scope="text, record">
					<span v-if="parseInt(record.runMany) ===0">{{record.runMany}}</span>
					<a href="javascript:" v-if="parseInt(record.runMany) >0" @click="handleRunMany(record)">{{record.runMany}}</a>
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
                <!--<span style="margin-left: 10px">共{{data.total}}条</span>-->
            </div>
        </div>
        <not-satisfaction-data :modal="notSatisfactionModal" @close="handleNotSatisfactionClose" />
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
  TreeSelect,
} from 'ant-design-vue';
import moment from 'moment';

import notSatisfactionData from './notSatisfactionData';
import runManyData from './runManyData';

const { Option } = Select;
const { RangePicker } = DatePicker;

import { autoDoFn, formatTimes, transformTree } from '@/utils/util';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';

import { getOrganizationTree } from '@/remote/common';
import { getPage, exportExcel } from '@/remote/departsatis';

const columns = [
    {
        title:'部门',
        dataIndex: 'organizationName',
        width:250,
    },{
        title:'满意数',
        dataIndex: 'satisfactionNumber',
        width:150,
    },{
        title:'不满意数',
        dataIndex: 'notSatisfactionNumber',
        width:150,
        scopedSlots: {
            customRender: 'notSatisfactionNumber'
        },
    },{
        title:'满意率',
        dataIndex: 'satisfactionRate',
        width:150,
    },{
        title:'跑一次',
        dataIndex: 'runOnce',
        width:150,
    },{
        title:'跑多次',
        dataIndex: 'runMany',
        width:150,
        scopedSlots: {
            customRender: 'runMany'
        },
    },{
        title:'实现率',
        dataIndex: 'implementRate',
        width:150,
    }
];

const notSatisfactionColumns = [

    {
        title:'群众姓名',
        dataIndex: 'personName',
        width:250,
    },
    {
        title:'群众电话',
        dataIndex: 'phone',
        width:250,
    },
    {
        title:'部门',
        dataIndex: 'organizationName',
        width:250,
    },{
        title:'投诉时间',
        dataIndex: 'feedbackTime',
        width:150,
    },{
        title:'办理事项',
        dataIndex: 'matters',
        width:150,
    },{
        title:'满意度',
        dataIndex: 'satisfactionName',
        width:150,
    },
];

const  runManyColumns= [

    {
        title:'群众姓名',
        dataIndex: 'personName',
        width:250,
    },
    {
        title:'群众电话',
        dataIndex: 'phone',
        width:250,
    },
    {
        title:'部门',
        dataIndex: 'organizationName',
        width:250,
    },{
        title:'投诉时间',
        dataIndex: 'feedbackTime',
        width:150,
    },{
        title:'办理事项',
        dataIndex: 'matters',
        width:150,
    },{
        title:'实现率',
        dataIndex: 'completeRateName',
        width:150,
    },
]


export default {
    name:'index',
    components:{
        notSatisfactionData,
        runManyData,
        AInput: Input,
        ARow: Row,
        ACol: Col,
        AButton: Button,
        ATable: Table,
        ASelect: Select,
        ASelectOption: Option,
        AUpload:Upload,
        AIcon: Icon,
        ADivider: Divider,
        APopconfirm: Popconfirm,
        SearchBox,
        SearchBoxItem,
        ADatePicker:DatePicker,
        ATreeSelect:TreeSelect,
        ARangePicker:RangePicker
    },
    data(){
        return {
            startTime:'',
            endTime:'',
            runManyColumns,
            notSatisfactionColumns,
            organizationOptions:[],
            searchParams:{
                searchTime:[moment('01','DD'), moment()],
                organizationId:'',
            },
            tableData:[],
            columns:columns,
            loading:false,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            pagination: {
                pageSize: '10',
                defaultCurrent: 1,
                total: 0,
                rows: 10,
                page: 0,
            },

            notSatisfactionModal:{
                notSatisfactionVisible: false,
                notSatisfactionColumns: [],
                title: '',
                notSatisRecoed: {},
            },
            runManyModal : {
                runManyVisible: false,
                runManyColumns: [],
                title: '',
                runManyRecord: {},
        },
            authorityActionList: window.authorityActionList,
        }
    },
    created(){
        this.getOrganizationTree();
        this.initList();
    },
    methods:{
        onShowSizeChange() {
            this.pagination.rows = this.pagination.pageSize
            this.initList()
        },
        moment,
        initList(){
            autoDoFn(async () => {
                this.loading = true;
              let params = {
                startTime: this.searchParams.searchTime[0].format('YYYY-MM-DD') + ' 00:00:00',
                endTime: this.searchParams.searchTime[1].format('YYYY-MM-DD') + ' 00:00:00',
                organizationId:this.searchParams.organizationId
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
        handleSearch(){
            this.initList();
        },
        handleReset(){
            this.searchParams = {
                searchTime:[moment('01','DD'), moment()],
                organizationId:'',
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
        // 获取组织树
        getOrganizationTree(){
            autoDoFn(async ()=>{
                const res = await getOrganizationTree({})
                if(res.success){
                    this.organizationOptions = transformTree(res.data);
                }
            })
        },
        onPageChange(pagination){
            this.pagination.page = pagination.current;
            this.$nextTick(() => {
            });
        },

        exportExcel(){
            autoDoFn(async () => {
              let params = {
                startTime: this.searchParams.searchTime[0].format('YYYY-MM-DD') + ' 00:00:00',
                endTime: this.searchParams.searchTime[1].format('YYYY-MM-DD') + ' 00:00:00',
                organizationId:this.searchParams.organizationId
              }
              const res = await exportExcel({
                ...params
              });
              if (res) {
                window.open(`${res.data}`, '_blank');
              }
            });
        },
        //查看不满意的详情
        handleNotSatisfaction(record){
            this.notSatisfactionModal = {
                notSatisfactionVisible: true,
                notSatisfactionColumns: notSatisfactionColumns,
                title: '不满意详情',
                //传递的参数的值
                notSatisRecoed: {
                    satisfaction: '1',
                    orgaId: record.organizationId,
                    startTime:this.searchParams.searchTime[0].format('YYYY-MM-DD') + ' 00:00:00',
                    endTime:this.searchParams.searchTime[1].format('YYYY-MM-DD') + ' 23:59:59'
                },
            }
        },
        //关闭不满意详情
        handleNotSatisfactionClose(){
            this.notSatisfactionModal = {
                notSatisfactionVisible: false,
                notSatisfactionColumns: [],
                title: '',
                notSatisRecoed: {},
            }
        },
        //查看跑多次的详情
        handleRunMany(record){
            this.runManyModal = {
                runManyVisible: true,
                runManyColumns: runManyColumns,
                title: '跑多次详情',
                //传递的参数的值
                runManyRecord: {
                    completeRate: '2',
                    orgaId: record.organizationId,
                    startTime:this.searchParams.searchTime[0].format('YYYY-MM-DD') + ' 00:00:00',
                    endTime:this.searchParams.searchTime[1].format('YYYY-MM-DD') + ' 23:59:59'
                },
            }
        },

        //关闭跑多次详情
        handleRunManyClose(){
            this.runManyModal = {
                runManyVisible: false,
                runManyColumns: [],
                title: '',
                runManyRecord: {},
            }
        },
    }
}
</script>

<style scoped>

</style>
