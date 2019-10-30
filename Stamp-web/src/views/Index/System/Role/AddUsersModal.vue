<template>
    <div class="staff-modal">
        <a-modal
                title="选择用户"
                :visible="membersVisible"
                @cancel="handleCancel"
                @ok="handleOk"
                :width="760"
        >
            <a-input style="width: 300px;margin: 10px" v-model="nameOrAccount" placeholder="请输入账号或姓名"/>
            <a-button @click="searchYUser" style="left: 200px" icon="search">查询</a-button>
            <template slot="footer">
                <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button key="ok" type="primary" @click="handleOk">确定</a-button>
            </template>
            <a-table :columns="membersColumns"
                     :destroyOnClose="true"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, hideDefaultSelections: true, type: type, selections: true, onChange: onSelectChange}"
                     :dataSource="membersData"
                     @change="onMembersPageChange"
                     :loading="membersLoading"
                     :rowKey="record => String(record.id)"
                     :pagination="membersPagination"></a-table>
        </a-modal>
    </div>
</template>

<script>
    import {
        Input,
        Button,
        Table,
        Modal,
        Row,
        Col,
    } from 'ant-design-vue';
    import {getByRoleIdNotIn} from '@/remote/system-role';
    import {autoDoFn} from '@/utils/util';

    const membersColumns = [
        {
            title: '账号',
            dataIndex: 'username',
        },
        {
            title: '姓名',
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
    ];

    export default {
        name: 'StaffModal',
        components: {
            AInput: Input,
            AButton: Button,
            ATable: Table,
            AModal: Modal,
            ARow: Row,
            ACol: Col,
        },
        props: {
            membersVisible: {
                required: true,
                type: Boolean,
                default: false,
            },
            type: {
                required: true,
                type: String,
                default: 'checkbox',
            },
            roleId: {
                required: true,
                type: String,
                default: '',
            },
        },
        watch: {
            membersVisible() {
                this.getMembers();
            },
        },
        data: () => ({
            nameOrAccount: '',
            membersColumns,
            selectedRowKeys: [],
            selections: [],
            membersLoading: false,
            membersData: [],
            membersPagination: {
                defaultCurrent: 1,
                total: 0,
                row: 10,
                page: 0,
            },
            searchParams: {},
        }),
        methods: {
            getMembers() {
                autoDoFn(async () => {
                    this.membersLoading = true;
                    const res = await getByRoleIdNotIn({
                        nameOrAccount: this.nameOrAccount,
                        ...this.searchParams,
                        ...this.membersPagination,
                        roleId: this.roleId,
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
            onMembersPageChange(pagination) {
                this.membersPagination.page = pagination.current;
                this.$nextTick(() => {
                    this.getMembers();
                });
            },
            handleCancel() {
                this.$emit('cancel');
            },
            handleOk() {
                this.$emit('ok', this.selectedRowKeys, this.selections);
            },
            onSelectChange(selectedRowKeys, selections) {
                this.selectedRowKeys = selectedRowKeys;
                this.selections = selections;
            },
            handleReset() {
                this.searchParams = {};
                this.membersPagination = {
                    defaultCurrent: 1,
                    total: 0,
                    row: 10,
                    page: 0,
                };
                this.$nextTick(() => {
                    this.getMembers();
                });
            },
            searchYUser() {
                this.getMembers();
            }
        },
    };
</script>

<style lang="less" scoped>
    .header__label {
        text-align: right;
        line-height: 32px;
    }
</style>
