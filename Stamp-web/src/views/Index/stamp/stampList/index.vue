<template>
    <div class="content-wrap">
        <h2 class="content__title">刻章管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="员工工号：">
                <a-input v-model="searchParams.empNo"/>
            </search-box-item>
            <search-box-item label="经办人：">
                <a-input v-model="searchParams.doName"/>
            </search-box-item>
            <search-box-item label="套餐名：">
                <a-select v-model="searchParams.servicePlan" placeholder="请选择套餐类型" style="width:100%">
                    <a-select-option value='A'>二合一（营业执照+公章）</a-select-option>
                    <a-select-option value='B1'>三合一(营业执照+公章+发票)</a-select-option>
                    <a-select-option value='B2'>三合一(营业执照+公章+开户)</a-select-option>
                    <a-select-option value='C'>四合一（营业执照+公章+发票+开户）</a-select-option>
                </a-select>
            </search-box-item>
            <search-box-item label="刻章单位：">
                <a-tree-select
                        style="width: 150px"
                        v-model="searchParams.stampCompany"
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        :treeData="orgTreeData"
                        treeDefaultExpandAll
                        showSearch
                        treeNodeFilterProp="title"
                ></a-tree-select>
            </search-box-item>
            <search-box-item label="营业执推送时间：" :span="2">
                <a-range-picker  v-model="searchParams.searchTime" style="width: 100%" format="YYYY-MM-DD" :placeholder="['请选择时间', '请选择时间']"></a-range-picker>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"
                      v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_STAMPLIST_ADD') > -1 && type!=='印章单位账号'">录入
            </a-button>
            <a-button @click="exportExcel"
                      v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_STAMPLIST_ADD') > -1">
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
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_STAMPLIST_VIEW') > -1">查看</a>
                    <template v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_STAMPLIST_EDITOR') > -1&&type!=='印章单位账号'">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_STAMPLIST_DELETE') > -1">
                         <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                </span>
                <span slot="stampaction" slot-scope="text, record">
                    <a-button v-if="record.stampDuration||record.stampReceiveTime===undefined" type="primary" @click="handleStamp({id:record.id})" disabled
                    >送达</a-button>
                    <a-button v-else  type="primary" @click="handleStamp(record)"
                    >送达</a-button>
                </span>
                <span slot="taxaction" slot-scope="text, record">
                    <a-button v-if="record.servicePlan==='B2'||record.servicePlan==='A'||record.taxDuration||record.stampReceiveTime===undefined" type="primary" @click="handleTax(record)" disabled
                    >送达</a-button>
                    <a-button v-else  type="primary" @click="handleTax(record)"
                    >送达</a-button>
                </span>
                <span slot="blankaction" slot-scope="text, record">
                    <a-button v-if="record.servicePlan==='B1'||record.servicePlan==='A'||record.bankDuration||record.stampReceiveTime===undefined" type="primary" @click="handleBlank(record)" disabled
                    >送达</a-button>

                    <a-button v-else  type="primary" @click="handleBlank(record)"
                    >送达</a-button>
                </span>
                <span  slot="persaccept" slot-scope="text, record">
                    <a-button v-if="record.stampReceiveTime" type="primary" @click="handleAccept(record)" disabled
                    >已接收</a-button>
                    <a-button v-else type="primary" @click="handleAccept(record)" disabled
                    >待接收</a-button>
                </span>

                <span  slot="unitaccept" slot-scope="text, record">
                    <a-button v-if="record.stampReceiveTime" type="primary" @click="handleAccept(record)" disabled
                    >已接收</a-button>
                    <a-button v-else type="primary" @click="handleAccept(record)"
                    >接收</a-button>
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
             :orgTreeData="orgTreeData"
             :staffList="staffList"
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
        Modal,
        Drawer,
        TreeSelect,
    } from 'ant-design-vue';
    import {getPage, getDel,CompanyDuration,StampDuration,TaxDuration,BankDuration,AllDuration,exportExcel} from '@/remote/stamp';
    import {getOrgTree, getEmployeesAll} from '@/remote/base';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import Add from './Add';
    import moment from 'moment';
    import DetailView from './DetailView';
    import {autoDoFn, transformTree} from '@/utils/util';
    const { MonthPicker } = DatePicker;
    const {RangePicker} = DatePicker;
    const {Item} = Form;
    const {Option} = Select;



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
            ARangePicker: RangePicker,
            AModal: Modal,
            ADrawer: Drawer,
            SearchBox,
            SearchBoxItem,
            Add,
            DetailView,
        },
        data() {
            return {
                type:"",
                columns: [],
                addVisible: false,
                modifyId: '',
                data: [],
                viewVisible: false,
                searchParams: {
                    empNo: '',
                    empName: '',
                    doName: '',
                    doNumber: '',
                    stampCompany: '',
                    servicePlan: '',
                    searchTime: [],
                },
                loading: false,
                orgTreeData: [],
                staffList: [],
                scroll: {
                    y: document.documentElement.clientHeight - 360,
                    x: 2200,
                },
                pageSizeOptions: [10, 20, 30, 40, 50],
                pagination: {
                    pageSize: 10,
                    defaultCurrent: 1,
                    total: 0,
                    rows: 10,
                    page: 0,
                },
                usersPagination: {
                    defaultCurrent: 1,
                    total: 0,
                    row: 10,
                    page: 0,
                },
                orgId: '',
                authorityActionList: window.authorityActionList,
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
                        ...this.pagination,
                        startDate: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD")+" 00:00" : '',
                        endDate: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD")+' 24:00': moment().format("YYYY-MM-DD 24:00"),
                    });
                    console.log(res)
                    if (res) {
                        this.data = res.data.list;
                        this.pagination.total = res.data.total;
                        this.pagination.page = res.data.pageNum;
                        this.pagination.row = res.data.pageSize;
                        this.type=localStorage.getItem('userTypeName');
                        console.log(this.type)
                        if(this.type==="个人账号")
                        {
                            console.log("11111111111111111111")
                            this.columns=[
                                {
                                    title: '序号',
                                    customRender:(text, row, index)=>`${index + 1+this.pagination.pageSize*(this.pagination.page-1)}`,
                                    width: 60,
                                    fixed: 'left'
                                },
                                {
                                    title: '服务套餐',
                                    width: 280,
                                    key:'servicePlan',
                                    dataIndex: 'servicePlanName',
                                    fixed: 'left'
                                },
                                {
                                    title: '员工工号',
                                    key:'empNo',
                                    dataIndex: 'empNo',
                                    width: 100,
                                },
                                {
                                    title: '窗口人员',
                                    key:'empName',
                                    dataIndex: 'empName',
                                    width: 100,
                                },
                                {
                                    title: '经办人',
                                    key:'doName',
                                    dataIndex: 'doName',
                                    width: 100,
                                },
                                {
                                    title: '时长(分)',
                                    key:'companyPushDuration',
                                    dataIndex: 'companyPushDuration',
                                    width: 100,
                                },
                                {
                                    title: '营业执照推送时间',
                                    key:'companyPushTime',
                                    dataIndex: 'companyPushTime',
                                    width: 150,
                                },
                                {
                                    title: '刻章接收',
                                    key: 'accept',
                                    width: 100,
                                    scopedSlots: {customRender: 'persaccept'},
                                },
                                {
                                    title: '公章单位',
                                    key:'stampCompanyName',
                                    dataIndex: 'stampCompanyName',
                                    width: 150,
                                },
                                {
                                    title: '公章送达',
                                    key: 'stampaction',
                                    width: 100,
                                    scopedSlots: {customRender: 'stampaction'},
                                },
                                {
                                    title: '时长(分)',
                                    key:'stampDuration',
                                    dataIndex: 'stampDuration',
                                    width: 100,
                                },
                                {
                                    title: '税务发票',
                                    key: 'taxaction',
                                    width: 100,
                                    scopedSlots: {customRender: 'taxaction'},
                                },
                                {
                                    title: '时长(分)',
                                    key:'taxDuration',
                                    width: 100,
                                    dataIndex: 'taxDuration',
                                },
                                {
                                    title: '银行开户',
                                    key: 'blankaction',
                                    width: 100,
                                    scopedSlots: {customRender: 'blankaction'},
                                },
                                {
                                    title: '时长(分)',
                                    key:'bankDuration',
                                    width: 100,
                                    dataIndex: 'bankDuration',
                                },
                                {
                                    title: '总时长(分)',
                                    key:'allDuration',
                                    width: 100,
                                    dataIndex: 'allDuration',
                                },
                                {
                                    title: '备注',
                                    key:'bak',
                                    width: 150,
                                    dataIndex: 'bak',
                                },
                                {
                                    title: '操作',
                                    key: 'action',
                                    width: 200,
                                    fixed: 'right',
                                    scopedSlots: {customRender: 'action'},
                                },
                            ]
                        }
                        else if(this.type==="印章单位账号")
                        {
                            console.log("22222222222222222222222")
                            this.columns=[
                                {
                                    title: '序号',
                                    customRender:(text, row, index)=>`${index + 1+this.pagination.pageSize*(this.pagination.page-1)}`,
                                    width: 60,
                                    fixed: 'left'
                                },
                                {
                                    title: '服务套餐',
                                    width: 280,
                                    key:'servicePlan',
                                    dataIndex: 'servicePlanName',
                                    fixed: 'left'
                                },
                                {
                                    title: '员工工号',
                                    key:'empNo',
                                    dataIndex: 'empNo',
                                    width: 100,
                                },
                                {
                                    title: '窗口人员',
                                    key:'empName',
                                    dataIndex: 'empName',
                                    width: 100,
                                },
                                {
                                    title: '经办人',
                                    key:'doName',
                                    dataIndex: 'doName',
                                    width: 100,
                                },
                                {
                                    title: '营业执照推送时间',
                                    key:'companyPushTime',
                                    dataIndex: 'companyPushTime',
                                    width: 150,
                                },
                                {
                                    title: '刻章接收',
                                    key: 'accept',
                                    width: 130,
                                    scopedSlots: {customRender: 'unitaccept'},
                                },
                                {
                                    title: '公章单位',
                                    key:'stampCompanyName',
                                    dataIndex: 'stampCompanyName',
                                    width: 150,
                                },
                                {
                                    title: '公章送达时长(分)',
                                    key:'stampDuration',
                                    dataIndex: 'stampDuration',
                                    width: 200,
                                },
                                {
                                    title: '税务发票时长(分)',
                                    key:'taxDuration',
                                    width: 200,
                                    dataIndex: 'taxDuration',
                                },
                                {
                                    title: '银行开户时长(分)',
                                    key:'bankDuration',
                                    width: 200,
                                    dataIndex: 'bankDuration',
                                },
                                {
                                    title: '总时长(分)',
                                    key:'allDuration',
                                    width: 150,
                                    dataIndex: 'allDuration',
                                },
                                {
                                    title: '备注',
                                    key:'bak',
                                    width: 200,
                                    dataIndex: 'bak',
                                },
                                {
                                    title: '操作',
                                    key: 'action',
                                    width: 180,
                                    fixed: 'right',
                                    scopedSlots: {customRender: 'action'},
                                },
                            ]
                        }
                        else if(this.type==="超级管理员账号") {
                            console.log("333333333333333333333")
                            this.columns = [
                                {
                                    title: '序号',
                                    customRender: (text, row, index) => `${index + 1 + this.pagination.pageSize * (this.pagination.page - 1)}`,
                                    width: 60,
                                    fixed: 'left'
                                },
                                {
                                    title: '服务套餐',
                                    width: 280,
                                    key: 'servicePlan',
                                    dataIndex: 'servicePlanName',
                                    fixed: 'left'
                                },
                                {
                                    title: '员工工号',
                                    key: 'empNo',
                                    dataIndex: 'empNo',
                                    width: 100,
                                },
                                {
                                    title: '窗口人员',
                                    key: 'empName',
                                    dataIndex: 'empName',
                                    width: 100,
                                },
                                {
                                    title: '经办人',
                                    key: 'doName',
                                    dataIndex: 'doName',
                                    width: 100,
                                },
                                {
                                    title: '时长(分)',
                                    key: 'companyPushDuration',
                                    dataIndex: 'companyPushDuration',
                                    width: 100,
                                },
                                {
                                    title: '营业执照推送时间',
                                    key: 'companyPushTime',
                                    dataIndex: 'companyPushTime',
                                    width: 150,
                                },
                                {
                                    title: '刻章接收',
                                    key: 'accept',
                                    width: 100,
                                    scopedSlots: {customRender: 'persaccept'},
                                },
                                {
                                    title: '公章单位',
                                    key: 'stampCompanyName',
                                    dataIndex: 'stampCompanyName',
                                    width: 150,
                                },
                                {
                                    title: '公章送达',
                                    key: 'stampaction',
                                    width: 100,
                                    scopedSlots: {customRender: 'stampaction'},
                                },
                                {
                                    title: '时长(分)',
                                    key: 'stampDuration',
                                    dataIndex: 'stampDuration',
                                    width: 100,
                                },
                                {
                                    title: '税务发票',
                                    key: 'taxaction',
                                    width: 100,
                                    scopedSlots: {customRender: 'taxaction'},
                                },
                                {
                                    title: '时长(分)',
                                    key: 'taxDuration',
                                    width: 100,
                                    dataIndex: 'taxDuration',
                                },
                                {
                                    title: '银行开户',
                                    key: 'blankaction',
                                    width: 100,
                                    scopedSlots: {customRender: 'blankaction'},
                                },
                                {
                                    title: '时长(分)',
                                    key: 'bankDuration',
                                    width: 100,
                                    dataIndex: 'bankDuration',
                                },
                                {
                                    title: '总时长(分)',
                                    key: 'allDuration',
                                    width: 100,
                                    dataIndex: 'allDuration',
                                },
                                {
                                    title: '备注',
                                    key: 'bak',
                                    width: 150,
                                    dataIndex: 'bak',
                                },
                                {
                                    title: '操作',
                                    key: 'action',
                                    width: 200,
                                    fixed: 'right',
                                    scopedSlots: {customRender: 'action'},
                                },
                            ]
                        }
                    }
                    this.loading = false;
                });
            },
            exportExcel() {
                autoDoFn(async () => {
                    let res = await exportExcel({
                        ...this.searchParams,
                        startDate: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD")+" 00:00" : '',
                        endDate: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD")+' 24:00': moment().format("YYYY-MM-DD 24:00"),
                    });
                    if (res) {
                        window.open(`${res.data}`, '_blank')
                    }
                })
            },
            initBaseData() {
                autoDoFn(async () => {
                    const orgRes = await getOrgTree();
                    if (orgRes) {
                        this.orgTreeData = [
                            {
                                label: '无',
                                value: '0',
                                key: '0',
                                children: transformTree(orgRes.data),
                            },
                        ];
                    }
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
                this.initBaseData();
            },
            handleSearch() {
                this.initList();
            },
            handleReset() {
                this.searchParams = {
                    empNo: '',
                    empName: '',
                    doName: '',
                    doNumber: '',
                    stampCompany: '',
                    servicePlan: '',
                    searchTime: '',
                };
                this.pagination = {
                    pageSize: 10,
                    defaultCurrent: 1,
                    total: 0,
                    rows: 10,
                    page: 0,
                };
                this.$nextTick(() => {
                    this.initList();
                });
            },
            onPageChange(pagination) {
                this.pagination.page = pagination.current;
                this.$nextTick(() => {
                    this.initList();
                });
            },
            handleStamp(data)
            {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await StampDuration(data);
                    if (res) {
                        this.$message.success('接收成功');
                        this.initList();
                        this.initBaseData();
                    } else {
                        this.loading = false;
                    }
                });
            },
            handleTax(data)
            {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await TaxDuration(data);
                    if (res) {
                        this.$message.success('接收成功');
                        this.initList();
                        this.initBaseData();
                    } else {
                        this.loading = false;
                    }
                });
            },
            handleBlank(data)
            {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await BankDuration(data);
                    if (res) {
                        this.$message.success('接收成功');
                        this.initList();
                        this.initBaseData();
                    } else {
                        this.loading = false;
                    }
                });
            },
            handleAccept(data)
            {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await CompanyDuration(data);
                    if (res) {
                        this.$message.success('接收成功');
                        this.initList();
                        this.initBaseData();
                    } else {
                        this.loading = false;
                    }
                });
            },
            handleDelete(data) {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getDel(data);
                    if (res) {
                        this.$message.success('删除成功');
                        this.initList();
                        this.initBaseData();
                    } else {
                        this.loading = false;
                    }
                });
            },

        },
    };
</script>

<style lang="less">

</style>
