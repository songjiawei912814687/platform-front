<template>
    <div class="content-wrap">
        <h2 class="content__title">组织机构管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="组织机构名称：">
                <a-input v-model="searchParams.name"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"
                      v-if="authorityActionList.indexOf('A_PERSONNEL_ORGANIZATION_ADD') > -1">录入
            </a-button>
            <a-button @click="exportExcel" v-if="authorityActionList.indexOf('A_PERSONNEL_ORGANIZATION_EXPORT') > -1">
                导出
            </a-button>
        </div>
        <div class="content">
            <a-table :columns="columns" :dataSource="data"
                     :rowKey="record => String(record.id)"
                     :loading="loading" :scroll="scroll" :pagination="false">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('A_PERSONNEL_ORGANIZATION_VIEW') > -1">查看</a>
                    <template v-if="authorityActionList.indexOf('A_PERSONNEL_ORGANIZATION_EDITOR') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_PERSONNEL_ORGANIZATION_DELETE') > -1">
                         <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_PERSONNEL_ORGANIZATION_VIEWMEMBERS') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleMembersShow(record)">查看成员</a>
                    </template>

                     <!--<template v-if="authorityActionList.indexOf('A_PERSONNEL_ORGANIZATION_SYNC') > -1">-->
                        <!--<a-divider type="vertical"/>-->
                           <!--<a-popconfirm title="确认要下发到取号叫号?" @confirm="handleSync(record)" okText="确认"-->
                                         <!--cancelText="取消">-->
                            <!--<a href="javascript:;">下发</a>-->
                        <!--</a-popconfirm>-->
                    <!--</template>-->
                </span>
            </a-table>
        </div>
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :orgTreeData="orgTreeData"
             :staffList="staffList"
             :ruleList="ruleList"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <a-drawer
                title="查看成员"
                :visible="membersVisible"
                @close="() => handleDrawerToggle('membersVisible', false)"
                :width="780"
        >
            <template slot="footer">
                <a-button key="back" @click="handleDrawerToggle('membersVisible', false)">关闭</a-button>
            </template>
            <a-table :columns="membersColumns" :dataSource="membersData"
                     @change="onMembersPageChange"
                     :loading="membersLoading"
                     :rowKey="record => String(record.id)"
                     :pagination="membersPagination"></a-table>
        </a-drawer>
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
        Drawer
    } from 'ant-design-vue';
    import {getPage, getDel, getMembers, exportExcel,syncQueue} from '@/remote/org';
    import {getOrgTree, getEmployeesAll,getRuleAll} from '@/remote/base';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import Add from './Add';
    import DetailView from './DetailView';
    import {autoDoFn, transformTree} from '@/utils/util';

    const {Item} = Form;
    const {Option} = Select;

    const columns = [
        {
            title: '组织机构名称',
            dataIndex: 'name',
            width: 500,
        },
        {
            title: '排序',
            dataIndex: 'displayOrder',
            width: 150,
        },
        // {
        //     title:'下发到取号叫号',
        //     dataIndex: 'isSyncQueueName',
        //     width: 150,
        // },
        {
            title: '操作',
            key: 'action',
            width: 300,
            // fixed: 'right',
            scopedSlots: {customRender: 'action'},
        },
    ];

    const membersColumns = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '工号',
            dataIndex: 'employeeNo',
        },
        {
            title: '职位',
            dataIndex: 'jobsName',
        },
        {
            title: '组织机构',
            dataIndex: 'organizationName',
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
            AModal: Modal,
            ADrawer: Drawer,
            SearchBox,
            SearchBoxItem,
            Add,
            DetailView,
        },
        data() {
            return {
                columns,
                membersColumns,
                addVisible: false,
                modifyId: '',
                isSyncQueueName: '',
                data: [],
                membersData: [],
                viewVisible: false,
                membersVisible: false,
                membersLoading: false,
                searchParams: {
                    name: '',
                },
                loading: false,
                orgTreeData: [],
                staffList: [],
                ruleList:[],
                scroll: {
                    y: document.documentElement.clientHeight - 310,
                    x: 1000,
                },
                membersPagination: {
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
            initList() {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getPage({...this.searchParams});
                    if (res) {
                        this.data = res.data;
                    }
                    this.loading = false;
                });
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
                    const staffRes = await getEmployeesAll();
                    if (staffRes) {
                        this.staffList = staffRes.data.list;
                    }
                    const ruleRes = await getRuleAll();
                    if (ruleRes) {
                        this.ruleList = ruleRes.data;
                    }

                });
            },
            getMembers() {
                autoDoFn(async () => {
                    this.membersLoading = true;
                    const res = await getMembers({
                        organizationId: this.orgId,
                        ...this.membersPagination,
                    });
                    if (res) {
                        this.membersData = res.data.list;
                        this.membersPagination.total = res.data.total;
                        this.membersPagination.page = res.data.pageNum;
                        this.membersPagination.row = res.data.pageSize;
                    }
                    this.membersLoading = false;
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
                    name: '',
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
                        this.initBaseData();
                    } else {
                        this.loading = false;
                    }
                });
            },
            handleSync(data){
              autoDoFn(async ()=>{
                  this.loading = true;
                  const  res = await syncQueue(data);
                  if(res){
                      this.$message.success("组织下发到取号叫号成功");
                      this.initList();
                  }else{
                      this.loading = false;
                  }
              });
            },
            handleMembersShow(data) {
                this.orgId = data.id;
                this.$nextTick(() => {
                    this.getMembers();
                    this.handleDrawerToggle('membersVisible', true);
                });
            },
            onMembersPageChange(pagination) {
                this.membersPagination.page = pagination.current;
                this.$nextTick(() => {
                    this.getMembers();
                    this.handleDrawerToggle('membersVisible', true);
                });
            },
            exportExcel() {
                autoDoFn(async () => {
                    let res = await exportExcel(this.searchParams);
                    if (res) {
                        window.open(`${res.data}`, '_blank')
                    }
                })
            },

        },
    };
</script>

<style lang="less">

</style>
