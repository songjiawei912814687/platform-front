<template>
    <div class="content-wrap">
        <h2 class="content__title">请假管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="请假时间：" :span="2">
                <a-range-picker v-model="searchParams.searchTime"
                                style="width: 100%"
                                format="YYYY-MM-DD"
                                :placeholder="['请选择时间', '请选择时间']">

                </a-range-picker>
            </search-box-item>
            <search-box-item label="所属机构：">
                <a-tree-select style="width: 100%" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="orgTreeData"
                               showSearch treeNodeFilterProp="title"
                               placeholder='请选择所属机构' treeDefaultExpandAll :rowKey="record => String(record.id)" v-model="searchParams.organizationId"
                               :allowClear="true"></a-tree-select>
            </search-box-item>
            <search-box-item label="申请人：">
                <a-input v-model="searchParams.employeesName" placeholder="请输入申请人"/>
            </search-box-item>
            <search-box-item label="请假类型：">
                <a-select v-model="searchParams.applicationType" placeholder="请选择请假类型" style="width: 100%;">
                    <a-select-option value='1'>临时外出二小时公事</a-select-option>
                    <a-select-option value='2'>哺乳假</a-select-option>
                    <a-select-option value='4'>产假</a-select-option>
                    <a-select-option value='5'>年休假</a-select-option>
                    <a-select-option value='6'>因公外出</a-select-option>
                    <a-select-option value='7'>事假</a-select-option>
                    <a-select-option value='8'>病假</a-select-option>
                    <!--<a-select-option value='9'>其他</a-select-option>-->
                    <a-select-option value='10'>临时外出二小时私事</a-select-option>
                    <a-select-option value='11'>婚假</a-select-option>
                    <a-select-option value='12'>探亲假</a-select-option>
                    <a-select-option value='13'>陪产假</a-select-option>
                    <a-select-option value='14'>丧假</a-select-option>
                </a-select>
            </search-box-item>

            <search-box-item label="审核状态：">
                <a-select v-model="searchParams.status" placeholder="请选择审核状态" style="width: 100%;">
                    <a-select-option value='0'>待审核</a-select-option>
                    <a-select-option value='1'>审核通过</a-select-option>
                    <a-select-option value='2'>审核未通过</a-select-option>
                </a-select>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="approval"
                      v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATION_ADD') > -1">申请
            </a-button>
            <a-button @click="exportExcel"
                      v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATION_ADD') > -1">
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
                <span slot="startTime" slot-scope="text, record">{{record.startDate + ' ' + record.startTime}}</span>
                <span slot="endTime" slot-scope="text, record">{{record.endDate + ' ' + record.endTime}}</span>
                <span slot="applicationType"
                      slot-scope="text, record">{{applicationTypeArr[record.applicationType]}}</span>
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATION_VIEW') > -1">查看</a>
                    <template
                            v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATION_EDITOR') > -1">
                        <a-divider type="vertical" v-show="record.status === 0"/>
                        <a href="javascript:;" v-show="record.status === 0" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <!--<a-divider type="vertical"/>
                    <a href="javascript:;" @click="handleChangeState(record)">流程</a>-->
                    <template
                            v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_LEAVEAPPLICATION_DELETE') > -1">
                        <a-divider v-show="record.status === 0" type="vertical"/>
                        <a-popconfirm v-show="record.status === 0" title="确认要删除此条数据?"
                                      @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
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
             :orgTreeData="orgTreeData"
             :ruleList="ruleList"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :applicationTypeArr="applicationTypeArr"
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
    } from 'ant-design-vue';
    import {getPage, getDel, getAttendanceRule, exportExcel} from '@/remote/leaveApply';
    import {getOrgTree} from '@/remote/base';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import Add from './Add';
    import DetailView from './DetailView';
    import {autoDoFn, transformTree} from '@/utils/util';
    import moment from 'moment';
    import {getIsPerson} from "@/remote/base";

    const {Item} = Form;
    const {Option} = Select;
    const {RangePicker} = DatePicker;
    const applicationTypeArr = [
        '',
        '临时外出二小时公事',
        '哺乳假',
        '',
        '产假',
        '年休假',
        '因公外出',
        '事假',
        '病假',
        '',
        '临时外出二小时私事',
        '婚假',
        '探亲假',
        '陪产假',
        '丧假',
    ];

    const columns = [
        {
            title: '机构',
            dataIndex: 'organizationName',
            width: 200,
        },
        {
            title: '人员',
            dataIndex: 'employeesName',
            width: 200,
        },
        {
            title: '类型',
            dataIndex: 'applicationType',
            scopedSlots: {customRender: 'applicationType'},
            width: 200,
        },
        {
            title:"申请时间",
            dataIndex: 'createdDateTime' ,
            scopedSlots: {customRender: 'createdDateTime'},
            width: 200,
        },
        {
            title: '开始时间',
            dataIndex: 'startDate',
            scopedSlots: {customRender: 'startTime'},
            width: 300,
        },
        {
            title: '结束时间',
            dataIndex: 'endDate',
            scopedSlots: {customRender: 'endTime'},
            width: 300,
        },
        {
            title: '请假原因',
            dataIndex: 'description',
            width: 400,
        },
        {
            title: '状态',
            dataIndex: 'statusName',
            width: 250,
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 180,
            scopedSlots: {customRender: 'action'},
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
            Add,
            DetailView,
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
                    // searchTime: [moment().subtract(1, 'months'), moment()],
                    searchTime: [],
                },
                loading: false,
                scroll: {
                    y: document.documentElement.clientHeight - 360,
                    x: 1000,
                },
                orgTreeData: [],
                ruleList: [],
                applicationTypeArr,
                createdDateTime:'',
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                pagination: {
                    pageSize: '10',
                    defaultCurrent: 1,
                    total: 0,
                    rows: 10,
                    page: 0,
                },
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
                        startDate: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
                        endDate: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',

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
            initBaseData() {
                autoDoFn(async () => {
                    const orgRes = await getOrgTree();

                    if (orgRes) {
                        if(orgRes.data.length==0){
                            this.orgTreeData = transformTree([{'id':localStorage.organId,'name':localStorage.organName}]);
                        }else{
                            this.orgTreeData = transformTree(orgRes.data);
                        }
                    }
                });
                autoDoFn(async () => {
                  const ruleRes = await getAttendanceRule();
                  if (ruleRes) {
                    this.ruleList = ruleRes.data && ruleRes.data.length && ruleRes.data.sort((a, b) => {
                      return a.type - b.type
                    });
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
            },
            handleSearch() {
                this.initList();
            },
            handleReset() {
                this.searchParams = {
                    organizationName: '',
                    employeesName: '',
                    searchTime: '',
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
                    } else {
                        this.loading = false;
                    }
                });
            },
            exportExcel() {
                autoDoFn(async () => {
                    let res = await exportExcel({
                        ...this.searchParams,
                        startDate: this.searchParams.searchTime[0] ? this.searchParams.searchTime[0].format("YYYY-MM-DD") : '',
                        endDate: this.searchParams.searchTime[1] ? this.searchParams.searchTime[1].format("YYYY-MM-DD") : '',
                    });
                    if (res) {
                        window.open(`${res.data}`, '_blank')
                    }
                })
            },
            onPageChange(pagination) {
                this.pagination.page = pagination.current;
                this.$nextTick(() => {
                    this.initList();
                });
            },
            approval() {
                autoDoFn(async () => {
                    const res = await getIsPerson();
                    console.log(res);
                    if (res.success) {
                        this.handleDrawerToggle('addVisible', true)
                    }
                })
            }
        },
    };
</script>

<style lang="less">

</style>
