<template>
    <div class="content-wrap">
        <h2 class="content__title">逾期未回复</h2>

        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="手机号码：">
                <a-input v-model="searchParams.suggestionPhoneNumber" placeholder="请输入手机号码"/>
            </search-box-item>
            <search-box-item label="用户姓名：">
                <a-input v-model="searchParams.suggestionName" placeholder="请输入用户姓名"/>
            </search-box-item>
            <search-box-item label="投诉部门：">
                <a-tree-select
                        style="width: 100%"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                         v-model="searchParams.departmentId"
                         :treeData="organizationOptions"
                         treeDefaultExpandAll
                        :showSearch='true'
                        treeNodeFilterProp="title"
                        placeholder="请选择组织机构"
                        ></a-tree-select>
            </search-box-item>
            <search-box-item label="指定回复人：">
                <a-input v-model="searchParams.userName" placeholder="请输入指定回复人"/>
            </search-box-item>
            <search-box-item label="反馈时间：" :span="2">
                <a-range-picker v-model="searchParams.searchTime"  style="width: 100%"/>
            </search-box-item>

        </search-box>

        <div class="action">
            <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_FEEDBACK_OVERDUETREATMENT_EXPORT') > -1">导出</a-button>
        </div>

        <div class="content">
            <a-table :columns="columns"
                     :dataSource="tableData"
                     :loading="loading"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)" v-if="authorityActionList.indexOf('A_FEEDBACK_OVERDUETREATMENT_VIEW') > -1">查看</a>
                    <template>
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleRemand(record)" v-if="authorityActionList.indexOf('A_FEEDBACK_OVERDUETREATMENT_REMIND') > -1">提醒</a>
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
  Select,
  Upload,
  Icon,
  Divider,
  Popconfirm,
  DatePicker,
  Cascader,
  TreeSelect
} from 'ant-design-vue';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

import { autoDoFn, formatTimes, transformTree } from '@/utils/util';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import DetailView from './detailView';

import { getOrganizationTree } from '@/remote/common';
import { getPage, getDetail, remind, exportExcel } from '@/remote/overdue';

const columns = [
    {
        title:'手机号码',
        dataIndex: 'suggestionPhoneNumber',
        width:150,
    },{
        title:'用户姓名',
        dataIndex: 'suggestionName',
        width:150,
    },{
        title:'投诉部门',
        dataIndex: 'organizationName',
        width:150,
    },{
        title:'反馈时间',
        dataIndex: 'createdDateTime',
        width:150,
    },{
        title:'指定回复人',
        dataIndex: 'userName',
        width:150,
    },{
        title:'最后处理时间',
        dataIndex: 'outDateTime',
        width:150,
    },{
        title:'逾期天数',
        dataIndex: 'outDays',
        width:150,
    },{
        title:'操作',
        key: 'action',
        width:200,
        scopedSlots: { customRender: 'action' },
    }
]


export default {
    name:'index',
    components:{
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
        DetailView,
        ARangePicker:RangePicker,
        ACascader:Cascader,
        ATreeSelect:TreeSelect
    },
    data(){
        return {
            organizationOptions:[],
            searchParams:{
                suggestionPhoneNumber:'',
                suggestionName:'',
                departmentId:'',
                organizationChose:[],
                searchTime:[],  //7天前 moment().subtract('days', 6).format('YYYY-MM-DD')
                userName:''
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
            modifyId:'',
            viewVisible:false,
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
                let feedBackTimeBegin = '';
                let feedBackTimeEnd = '';
                if(this.searchParams && this.searchParams.searchTime && this.searchParams.searchTime.length>0){
                    feedBackTimeBegin = this.searchParams.searchTime[0].format('YYYY-MM-DD');
                    feedBackTimeEnd = this.searchParams.searchTime[1].format('YYYY-MM-DD')
                }
                const res = await getPage({
                    ...this.searchParams,
                    ...this.pagination,
                    'feedBackTimeBegin':feedBackTimeBegin,
                    'feedBackTimeEnd':feedBackTimeEnd
                });
                if (res.success) {
                    this.tableData = res.data.list;
                    this.pagination.total = res.data.total;
                    this.pagination.page = res.data.pageNum;
                    this.pagination.row = res.data.pageSize;
                }
                this.loading = false;
            });
        },
        handleSearch(){
            console.log(this.searchParams);
            this.initList();
        },
        handleReset(){
            this.searchParams = {
                suggestionPhoneNumber:'',
                suggestionName:'',
                departmentId:'',
                organizationChose:[],
                searchTime:[],
                userName:''
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

        onPageChange(pagination){
            this.pagination.page = pagination.current;
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


        exportExcel(){
            autoDoFn(async () => {
                const res = await exportExcel({
                    ...this.searchParams
                });
                if (res) {
                    window.open(`${res.data}`, '_blank');
                }
            });
        },

        handleDrawerToggle(type, isVisible) {
            this[type] = isVisible;
            if (!isVisible) {
                this.modifyId = '';
            }
        },
        handleViewShow(rowData){
            this.handleDrawerToggle('viewVisible', true);
            this.modifyId = rowData.id;
        },

        handleRemand(rowData){
            autoDoFn(async ()=>{
                this.loading = true;
                const res = await remind({'id':rowData.id})
                if(res.success){
                    this.$message.success('提醒成功')
                    this.initList();
                }else{
                    this.$message.error(res.message)
                }
                this.loading = false;
            })
        }


    }
}
</script>

<style scoped>

</style>
