<template>
    <div class="content-wrap">
        <h2 class="content__title">新闻中心</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
            <search-box-item label="标题：">
                <a-input v-model="searchParams.title" placeholder="请输入标题"/>
            </search-box-item>
        </search-box>

        <div class="content">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     @change="onPageChange"
                     :rowKey="record => String(record.id)"
                     :pagination="pagination">

                <span slot="type" slot-scope="text, record">
                    <b style="color: red">
                        {{record.disName === undefined || record.disName === '' ? '' : '['+record.disName+']'}}
                    </b>
                    <b style="color: cornflowerblue">
                        {{'['+record.typeName+']'}}
                    </b>

                    {{record.title}}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)"
                       v-if="authorityActionList.indexOf('A_SYSTEM_MESSAGECENTER_NEWSCENTER_VIEW') > -1">查看</a>


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

        <!--详情-->
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     @cancel="() => handleDrawerToggle('viewVisible', false)"></detail-view>


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
    import {getDetail, getStaffPage} from '@/remote/staff';
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
    import DetailView from './DetailView';
    import {autoDoFn} from '@/utils/util';

    const {Item} = Form;
    const {Option} = Select;

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            scopedSlots: {customRender: 'type'},
            width: 300,
        },
        {
            title: '发布时间',
            dataIndex: 'createdDateTime',
            width: 100,
        },

        {
            title: '操作',
            key: 'action',
            width: 50,
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
            DetailView,
        },
        data() {
            return {
                columns,
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
            initList() {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getStaffPage({
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
                    username: '',
                    name: '',
                    userType: ''
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
            // 查看角色
            getUsers() {
                autoDoFn(async () => {
                    this.usersLoading = true;
                    const res = await getByRoleId({
                        userId: this.roleId,
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
                        userId: this.roleId,
                        roleIdList: id,
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
                        userId: this.roleId,
                        roleIdList: selections.map(item => item.id).join(","),
                    });
                    if (res) {
                        this.$message.success('操作成功');
                        this.addUsersVisible = false;
                        this.getUsers()
                    }
                })
            },
        },
    };
</script>

<style lang="less">

</style>
