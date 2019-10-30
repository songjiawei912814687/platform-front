<template>
    <div class="content-wrap">
        <h2 class="content__title">调休管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="所属机构：">
                <a-tree-select style="width: 100%" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                               :treeData="orgTreeData"
                               showSearch treeNodeFilterProp="title"
                               placeholder='请选择所属机构'
                               treeDefaultExpandAll :rowKey="record => String(record.id)"
                               v-model="searchParams.organizationId"
                               :allowClear="true">
                </a-tree-select>
            </search-box-item>
            <search-box-item label="申请人：">
                <a-input v-model="searchParams.employeesName" placeholder="请输入申请人"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="approval"
                      v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_OFFAPPLICATION_ADD') > -1">申请
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
                       v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_OFFAPPLICATION_VIEW') > -1">查看</a>
                    <template
                            v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_OFFAPPLICATION_EDITOR') > -1">
                        <a-divider type="vertical" v-show="record.status === 0"/>
                        <a href="javascript:;" v-show="record.status === 0" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <!--<a-divider type="vertical"/>
                    <a href="javascript:;" @click="handleViewShow(record)">流程</a>-->
                    <template
                            v-if="authorityActionList.indexOf('A_ATTENDANCE_LEAVEMANAGEMENT_OFFAPPLICATION_DELETE') > -1">
                        <a-divider type="vertical" v-show="record.status === 0"/>
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
        TreeSelect,
        message
    } from 'ant-design-vue';
    import {getPage, getDel} from '@/remote/leaveAdjust';
    import {getOrgTree} from '@/remote/base';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import Add from './Add';
    import DetailView from './DetailView';
    import {autoDoFn, transformTree} from '@/utils/util';
    import { getIsPerson } from "@/remote/base";

    const {Item} = Form;
    const {Option} = Select;

    const columns = [
        {
            title: '所属机构',
            dataIndex: 'organizationName',
            width: 300,
        },
        {
            title: '申请人',
            dataIndex: 'employeesName',
            width: 300,
        },
        {
            title: '申请时间',
            dataIndex: 'createdDateTime',
            width: 300,
        },
        {
            title: '加班日期',
            dataIndex: 'overTimeDate',
            width: 300,
        },
        {
            title: '调休日期',
            dataIndex: 'restTime',
            width: 300,
        },
        {
            title: '状态',
            dataIndex: 'statusName',
            width: 300,
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 230,
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
                createdDateTime:'',
                viewVisible: false,
                searchParams: {
                    organizationName: '',
                    employeesName: '',
                },
                loading: false,
                scroll: {
                    y: document.documentElement.clientHeight - 360,
                    x: 1000,
                },
                orgTreeData: [],
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
                const that = this;
                autoDoFn(async () => {
                    const orgRes = await getOrgTree();
                    if (orgRes) {
                        that.orgTreeData = transformTree(orgRes.data);
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
            onPageChange(pagination) {
                this.pagination.page = pagination.current;
                this.$nextTick(() => {
                    this.initList();
                });
            },
            approval() {
                autoDoFn( async () => {
                    const res = await getIsPerson();
                    if(res.success){
                        this.handleDrawerToggle('addVisible', true)
                    }
                })
            }
        },
    };
</script>

<style lang="less">

</style>
