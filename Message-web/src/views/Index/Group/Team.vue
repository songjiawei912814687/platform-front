<template>
    <a-drawer :visible="teamVisible"
              :loading="viewLoading"
              :destroyOnClose="true"
              :width="1200"
              @close="handleClose"
              title="查看成员">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <search-box @onSearch="handleSearch" @onReset="handleReset">
                <search-box-item label="所属机构：">
                    <a-tree-select style="width: 120%"
                                   :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                   :treeData="orgTreeData"
                                   showSearch treeNodeFilterProp="title"
                                   placeholder='请选择所属机构'
                                   treeDefaultExpandAll :rowKey="record => String(record.id)"
                                   v-model="searchParams.organizationId"
                                   :allowClear="true"></a-tree-select>
                </search-box-item>
                <search-box-item label="姓名：">
                    <a-input v-model="searchParams.employeesName" placeholder='请输入姓名' />
                </search-box-item>
                <search-box-item label="工号：">
                    <a-input v-model="searchParams.employeesNo" placeholder='请输入工号' />
                </search-box-item>
                <search-box-item label="手机号码：">
                    <a-input v-model="searchParams.phone" placeholder='请输入手机号码' />
                </search-box-item>
            </search-box>
            <div class="action">
                <a-button  @click="staffSelect('selectStaffVisible', true)" >添加成员</a-button>
            </div>
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="viewLoading"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <template >
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete(record.id)" okText="确认" cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                </span>
            </a-table>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose">关闭</a-button>
        </div>
        <staff-modal :membersVisible="selectStaffVisible"
                     :propsSelectedRowKeys="selectedRowKeys"
                     :organTree="orgTreeData"
                     @cancel="() => this.selectStaffVisible = false"
                     @ok="handleSelectStaffOk"
                     type="checkbox"
        ></staff-modal>
    </a-drawer>

</template>

<script>
    import { Row, Col, Button, Table, Drawer, Spin, Divider, Popconfirm,Input,Form,TreeSelect } from 'ant-design-vue';
    import { autoDoFn, transformTree2 } from '@/utils/util';
    import  StaffModal  from '@/components/StaffModal/StaffModal'
    import { getOrgTree, addMessageGroup, getDelTeam, getTeam} from "@/remote/group";
    import SearchBox from '@/components/SearchBox/SearchBox';
    import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';

    const columns = [
        {
            title: '工号',
            dataIndex: 'employeesNo',
            width: 200,
        },
        {
            title: '姓名',
            dataIndex: 'employeesName',
            width: 200,
        },
        {
            title: '电话',
            dataIndex: 'phoneNumber',
            width: 200,
        },
        {
            title: '组织机构',
            dataIndex: 'organizationName',
            width: 200,
        },

        {
            title: '操作',
            key: 'action',
            width: 200,
            scopedSlots: { customRender: 'action' },
        },
    ];
    export default {
        name: 'TeamVisible',
        components: {
            AInput: Input,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ATable: Table,
            ASelectOption: Option,
            ADrawer: Drawer,
            ASpin: Spin,
            ADivider: Divider,
            ATreeSelect: TreeSelect,
            APopconfirm: Popconfirm,
            StaffModal,
            SearchBox,
            SearchBoxItem,
        },
        props: ['teamVisible', 'handleClose', 'modifyId'],
        data() {
            return {
                columns,
                data: [],
                viewData: {},
                viewLoading: false,
                selectStaffVisible: false,
                selectedRowKeys: [],
                selectedRowName: [],
                selectedRowStaff: [],
                selectedRowNameArr: [],
                searchParams: {
                    organizationId: '',
                    employeesNo: '',
                    employeesName: '',
                    phone: '',
                },
                orgTreeData: [],
                pagination: {
                    defaultCurrent: 1,
                    total: 0,
                    row: 10,
                    page: 0,
                },
            };
        },
        watch: {
            teamVisible() {
                this.initOrganData()
                this.initList()
            },
        },
        methods: {
            initList(){
                    autoDoFn(async () => {
                        this.viewLoading = true;
                        const res = await getTeam({
                            messageGroupId: this.modifyId,
                            ...this.searchParams,
                            ...this.pagination
                        });
                        if (res.success) {
                            this.data = res.data.list
                            this.pagination.total = res.data.total;
                            this.pagination.page = res.data.pageNum;
                            this.pagination.row = res.data.pageSize;
                        }
                        this.viewLoading = false;
                    });
            },
            onPageChange(pagination) {
                this.pagination.page = pagination.current;
                this.$nextTick(() => {
                    this.initList();
                });
            },
            initOrganData() {
                autoDoFn(async () => {
                    const orgRes = await getOrgTree();
                    if (orgRes) {
                        this.orgTreeData = [
                            {
                                label: '无',
                                value: '0',
                                key: '0',
                                children: transformTree2(orgRes.data),
                            },
                        ];

                    }

                });
            },

            handleDelete(id) {
                autoDoFn(async () => {
                    this.loading = true;
                    const res = await getDelTeam({idList: id});
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.initList();
                    }
                    this.loading = false;
                });
            },
            staffSelect() {
                this.selectStaffVisible = true;
            },
            handleSelectStaffOk(selectedRowKeys, selections) {
                this.selectedRowKeys = selectedRowKeys;
                autoDoFn(async () => {
                    this.loading = true
                    const res = await addMessageGroup({
                        messageGroupId: this.modifyId,
                        empIdList: selectedRowKeys.join(',')
                    })
                    if(res.success){
                        this.$message.success('添加成功')
                        this.selectStaffVisible = false;
                        this.initList()
                    }
                })
            },
            handleSearch() {
                this.initList();
            },

            handleReset() {
                this.searchParams = {
                    organizationId: '',
                    employeesNo: '',
                    employeesName: '',
                    phone:'',
                };
                this.$nextTick(() => {
                    this.initList();
                });
            },



        },
    }
</script>

<style lang="less" scoped>
    p{
        margin-bottom: 10px;
    }
</style>
