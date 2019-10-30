<template>
    <div class="content-wrap">
        <h2 class="content__title">角色管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="角色名称：">
                <a-input v-model="searchParams.name" placeholder="请输入角色名称"/>
            </search-box-item>
        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"
                      v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_ROLEMANAGEMENT_ADD') > -1">录入
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
                       v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_ROLEMANAGEMENT_VIEW') > -1">查看</a>
                    <template v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_ROLEMANAGEMENT_EDITOR') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_ROLEMANAGEMENT_PERMISSIONS') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="permissionsShow(record)">权限设置</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_ROLEMANAGEMENT_DATAPERMISSIONS') > -1">
                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="organPerShow(record)">数据权限</a>
                    </template>
                    <template
                            v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_ROLEMANAGEMENT_ROLEUSER') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleUsersShow(record)">角色用户</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_ROLEMANAGEMENT_DELETE') > -1">
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
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
        <!--新增-->
        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <!--详情-->
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <!--查看用户-->
        <a-modal
                title="查看用户"
                :visible="usersVisible"
                :width="700"
                @cancel="handleDrawerToggle('usersVisible', false)"
        >
            <a-input style="width: 300px;margin: 10px" v-model="nameOrAccount" placeholder="请输入账号或姓名"/>
            <a-button @click="searchYUser" style="left: 200px" icon="search">查询</a-button>

            <a-row>

                <a-col :span="24">
                    <a-button @click="handleAddUser">添加用户</a-button>
                </a-col>
            </a-row>
            <a-table :columns="usersColumns" :dataSource="usersData"
                     @change="onUsersPageChange"
                     :loading="usersLoading"
                     :rowKey="record => String(record.id)"
                     :pagination="usersPagination">
                <span slot="action" slot-scope="text, record">
                    <a-popconfirm title="确认要删除此条数据?" @confirm="handleUsersDelete(record.id)" okText="确认"
                                  cancelText="取消">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </a-modal>
        <!--添加用户-->
        <add-users-modal :membersVisible="addUsersVisible"
                         @cancel="() => this.addUsersVisible = false"
                         @ok="handleAddUserOk"
                         :roleId="roleId"
                         type="checkbox"
        ></add-users-modal>
        <!--权限-->
        <limits :visible="permissionsVisible"
                :roleId="roleId"
                @cancel="() => this.permissionsVisible = false"
                @successCallback="() => this.permissionsVisible = false"
        ></limits>
        <organ :visible="organPermissionsVisible"
               :roleId="roleId"
               @cancel="() => this.organPermissionsVisible = false"
               @successCallback="() => this.organPermissionsVisible = false"
        ></organ>
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
    } from 'ant-design-vue';
    import {
        getPage,
        getDel,
        getByRoleId,
        saveByRoleId,
        getUsersDel,
        getPermissionsByRoleId
    } from '@/remote/system-role';
    import {getOrgTree, getRoleAll} from '@/remote/base';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import Add from './Add';
    import DetailView from './DetailView';
    import AddUsersModal from './AddUsersModal';
    import Limits from './Limits';
    import Organ from './Organs'
    import {autoDoFn, transformTree, transformTree1} from '@/utils/util';

    const {Item} = Form;
    const {Option} = Select;

    const columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            width: 300,
        },
        {
            title: '描述',
            dataIndex: 'description',
            width: 1000,
        },
        {
            title: '操作',
            key: 'action',
            width: 500,
            scopedSlots: {customRender: 'action'},
        },
    ];

    const usersColumns = [
        {
            title: '账号',
            dataIndex: 'username',
        },
        {
            title: '用户',
            dataIndex: 'employeesName',
        },
        {
            title: '部门',
            dataIndex: 'organizationName',
        },
        {
            title: '账号类型',
            dataIndex: 'userTypeName',
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 100,
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
            AModal: Modal,
            SearchBox,
            SearchBoxItem,
            Add,
            DetailView,
            AddUsersModal,
            Limits,
            Organ
        },
        data() {
            return {
                nameOrAccount: '',
                columns,
                addVisible: false,
                viewVisible: false,
                modifyId: '',
                data: [],
                searchParams: {
                    name: '',
                    windowNo: '',
                },
                loading: false,
                scroll: {
                    y: document.documentElement.clientHeight - 360,
                    x: 1000,
                },
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                pagination: {
                    pageSize: '10',
                    defaultCurrent: 1,
                    total: 0,
                    rows: 10,
                    page: 0,
                },
                orgTreeData: [],
                roleList: [],

                // 查看用户
                usersVisible: false,
                usersLoading: false,
                usersColumns,
                roleId: '',
                usersData: [],
                usersPagination: {
                    defaultCurrent: 1,
                    total: 0,
                    row: 10,
                    page: 0,
                },
                authorityActionList: window.authorityActionList,
                // 添加用户
                addUsersVisible: false,

                // 权限
                permissionsVisible: false,
                organPermissionsVisible: false,
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
                autoDoFn(async () => {
                    const orgRes = await getOrgTree();
                    if (orgRes) {
                        this.orgTreeData = transformTree(orgRes.data);
                    }
                    const roleRes = await getRoleAll();
                    if (roleRes) {
                        this.roleList = roleRes.data.list;
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
            handleLeaveSuccess() {
                this.handleDrawerToggle('leaveVisible', false);
                this.initList();
            },
            handleSearch() {
                this.initList();
            },
            handleReset() {
                this.searchParams = {
                    name: '',
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
            // 查看用户
            getUsers() {
                autoDoFn(async () => {
                    this.usersLoading = true;
                    const res = await getByRoleId({
                        roleId: this.roleId,
                        nameOrAccount: this.nameOrAccount,
                        ...this.usersPagination,
                    });
                    if (res) {
                        this.usersData = res.data.list;
                        this.usersPagination.total = res.data.total;
                        this.usersPagination.page = res.data.pageNum;
                        this.usersPagination.row = res.data.pageSize;
                    }
                    this.usersLoading = false;
                });
            },
            handleUsersShow(data) {
                this.roleId = String(data.id);
                this.$nextTick(() => {
                    this.getUsers();
                    this.handleDrawerToggle('usersVisible', true);
                });
            },
            onUsersPageChange(pagination) {
                this.usersPagination.page = pagination.current;
                this.$nextTick(() => {
                    this.getUsers();
                    this.handleDrawerToggle('usersVisible', true);
                });
            },
            handleUsersDelete(id) {
                autoDoFn(async () => {
                    this.usersLoading = true;
                    const res = await getUsersDel({
                        roleId: this.roleId,
                        userIdList: id,
                    });
                    if (res) {
                        this.$message.success('删除成功');
                        this.getUsers();
                    } else {
                        this.usersLoading = false;
                    }
                });
            },
            // 添加用户
            handleAddUser() {
                this.addUsersVisible = true;
            },
            handleAddUserOk(selectedRowKeys, selections) {
                autoDoFn(async () => {
                    const res = await saveByRoleId({
                        roleId: this.roleId,
                        userIdList: selections.map(item => item.id).join(","),
                    });
                    if (res) {
                        this.$message.success('操作成功');
                        this.addUsersVisible = false;
                        this.getUsers()
                    }
                })
            },
            // 权限
            permissionsShow(data) {
                this.roleId = String(data.id);
                this.permissionsVisible = true;
            },
            searchYUser() {
                this.getUsers()
            },
            organPerShow(data) {
                this.roleId = String(data.id);
                this.organPermissionsVisible = true;
            }
        },
    };
</script>

<style lang="less">

</style>
