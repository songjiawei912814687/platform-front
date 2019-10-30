<template>
    <div class="content-wrap">
        <h2 class="content__title">审批配置</h2>
        <div>
            <span style="margin-left: 30px">审批流配置：</span>
            <a-input style="width: 180px;margin-right: 20px" v-model="searchParams.name" placeholder="请输入审批流名称"/>
            <span style="margin-left: 30px">组织机构：</span>
            <a-input style="width: 180px;margin-right: 20px" v-model="searchParams.organName" placeholder="请输入组织名称"/>
            <span>审批类型：</span>
            <a-select v-model="searchParams.approvalType" style="width: 180px" placeholder='请选择审批类型'
                      :getPopupContainer="triggerNode => triggerNode.parentNode">
                <a-select-option value='1'>请假申请</a-select-option>
                <a-select-option value='3'>加班申请</a-select-option>
                <a-select-option value='5'>会议室申请</a-select-option>
                <a-select-option value='7'>人员入职申请</a-select-option>
                <a-select-option value='9'>人员离职申请</a-select-option>
                <a-select-option value='11'>考核申诉</a-select-option>
                <a-select-option value='13'>岗位调动</a-select-option>
                <a-select-option value='15'>人员调休</a-select-option>
                <a-select-option value='17'>员工加减分记录</a-select-option>
            </a-select>

            <a-button @click="reset" style="margin-left:10px">重置</a-button>
            <a-button @click="search" type="primary" style="margin-left: 10px">查询</a-button>

        </div>


        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible',true)"
                      v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPROVALFLOWCONFIGURATION_ADD') > -1">
                录入
            </a-button>
        </div>
        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination"
            >
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPROVALFLOWCONFIGURATION_VIEW') > -1">查看</a>
                    <template>
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)"
                           v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPROVALFLOWCONFIGURATION_EDITOR') > -1">编辑</a>
                    </template>


                    <template>
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;"
                               v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPROVALFLOWCONFIGURATION_DELETE') > -1">删除</a>
                        </a-popconfirm>
                    </template>
                    <template>
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="steps(record)"
                           v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_APPROVALFLOWCONFIGURATION_STEPSETTING') > -1">步骤设置</a>
                    </template>
                </span>

            </a-table>


        </div>
        <!--新增-->
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :orgTreeData="orgTreeData"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <!--查看-->
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>

        <steps :visible="stepsVisible"
               :approval-id="approvalId"
               @cancel="() => this.stepsVisible = false"
               @successCallback="() => this.stepsVisible = false"
               :handleClose="() => handleDrawerToggle('stepsVisible', false)"
        ></steps>
    </div>

</template>

<script>
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import {getPage, getDel} from '@/remote/approvalNew';
    import {getOrgTree} from "@/remote/base";
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
    } from 'ant-design-vue'
    import {autoDoFn, transformTree} from '@/utils/util';
    import Add from './add'
    import DetailView from './detailView'
    import Steps from './steps'

    const {Item} = Form;
    const {Option} = Select;

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            width: 300,
        },
        {
            title: '审批类型',
            dataIndex: 'approvalTypeName',
            width: 300,
        },
        {
            title: '是否包含本部门',
            dataIndex: 'approvalConfigTypeName',
            width: 400,
        },
        {
            title: '隶属组织机构',
            dataIndex: 'organName',
            width: 400,
        },
        {
            title: '描述',
            dataIndex: 'description',
            width: 400,
        }, {
            title: '操作',
            key: 'action',
            width: 400,
            scopedSlots: {customRender: 'action'},
        }
    ];
    export default {
        name: "Index",
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
            AModal: Modal,
            SearchBox,
            SearchBoxItem,
            Add,
            DetailView,
            Steps,
        },
        data() {
            return {
                columns,
                data: [],
                addVisible: false,
                viewVisible: false,
                stepsVisible: false,
                modifyId: '',
                loading: false,
                orgTreeData: [],
                approvalId: '',
                searchParams: {
                    name: '',
                    organName: '',
                    approvalType: ''

                },
                pagination: {
                    defaultCurrent: 1,
                    total: 0,
                    row: 10,
                    page: 0,
                },
                authorityActionList: window.authorityActionList
            }

        },
        created() {
            this.initList();
            this.initOrganList();
        },
        methods: {
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
            initOrganList() {
                autoDoFn(async () => {
                    const res = await getOrgTree();
                    if (res) {
                        this.orgTreeData = transformTree(res.data);
                    }
                    console.log(this.orgTreeData)
                })
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
                debugger
                this[type] = isVisible;
                if (!isVisible) {
                    this.modifyId = '';
                }
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
            steps(data) {
                this.approvalId = String(data.id);
                this.stepsVisible = true;
            },
            handleAddSuccess() {
                this.handleDrawerToggle('addVisible', false);
                this.initList();
            },
            onPageChange(pagination) {
                this.pagination.page = pagination.current;
                this.$nextTick(() => {
                    this.initList();
                });
            },
            handleSearch() {
                this.initList();
            },
            reset(){
                this.searchParams.approvalType = '';
                this.searchParams.organName = '';
                this.searchParams.name = '';
            },
            search(){
                this.initList();
            }
        }
    }
</script>

<style scoped>

</style>
