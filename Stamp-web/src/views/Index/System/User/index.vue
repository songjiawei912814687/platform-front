<template>
    <div class="content-wrap">
        <h2 class="content__title">用户管理</h2>
        <search-box @onSearch="handleSearch" @onReset="handleReset">
          <search-box-item label="组织机构：">
                <a-input v-model="searchParams.organName" placeholder="请输入组织机构"/>
          </search-box-item>
					<search-box-item label="姓名：">
					    <a-input v-model="searchParams.name" placeholder="请输入员工姓名"/>
					</search-box-item>
            <search-box-item label="账号：">
                <a-input v-model="searchParams.username" placeholder="请输入账号"/>
            </search-box-item>
            <search-box-item label="用户类型：">
                <a-select v-model="searchParams.type" placeholder="请选择用户类型" style="width:100%">
                    <a-select-option value='0'>用户账号</a-select-option>
                    <a-select-option value='1'>部门账号</a-select-option>
                    <a-select-option value='2'>印章单位账号</a-select-option>
                </a-select>
            </search-box-item>

        </search-box>
        <div class="action">
            <a-button @click="handleDrawerToggle('addVisible', true)"
                      v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_SYSTEMSETTINGS_USERMANAGEMENT_ADD') > -1">录入
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
                       v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_SYSTEMSETTINGS_USERMANAGEMENT_VIEW') > -1">查看</a>
                    <template
                            v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_USERMANAGEMENT_ROLEUSER') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleUsersShow(record)">用户角色</a>
                    </template>
                    <template v-if="authorityActionList.indexOf('M_STAMP_SYSTEM_SYSTEMSETTINGS_USERMANAGEMENT_DELETE') > -1">
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                    <template v-if="authorityActionList.indexOf('A_SYSTEM_SYSTEMSETTINGS_USERMANAGEMENT_UPDATEPWD') > -1">
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要重置密码吗?" @confirm="handleUpadatePwd({userId: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;">重置密码</a>
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
             :orgTreeData="orgTreeData"
             :roleList="roleList"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
        <!--详情-->
        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>
        <!--查看角色-->
        <a-modal
                title="查看角色"
                :visible="usersVisible"
                @cancel="handleDrawerToggle('usersVisible', false)"
        >
            <template slot="footer">
                <a-button key="back" @click="handleDrawerToggle('usersVisible', false)">关闭</a-button>
            </template>
            <a-row>
                <a-col :span="24">
                    <a-button @click="handleAddUser">添加角色</a-button>
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
        <!--添加角色-->
        <add-users-modal :membersVisible="addUsersVisible"
                         @cancel="() => this.addUsersVisible = false"
                         @ok="handleAddUserOk"
                         :roleId="roleId"
                         type="checkbox"
        ></add-users-modal>
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
    TreeSelect
  } from 'ant-design-vue';
  import {getPage, getDel, getByRoleId, saveByRoleId, getUsersDel,updatePwd} from '@/remote/system-user';
  import {getOrgTree, getRoleAll} from '@/remote/base';
  import SearchBox from '@/components/SearchBox/SearchBox';
  import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
  import Add from './Add';
  import DetailView from './DetailView';
  import AddUsersModal from './AddUsersModal';
  import {autoDoFn, transformTree, transformTree1} from '@/utils/util';

  const {Item} = Form;
  const {Option} = Select;

  const columns = [
    {
      title: '组织机构',
      dataIndex: 'organName',
      width: 250,
    },
      {
          title: '姓名',
          dataIndex: 'employeesName',
          width: 250,
      },

    {
      title: '账号',
      dataIndex: 'username',
      width: 400,
    },
    {
      title: '用户类型',
      dataIndex: 'userTypeName',
      width: 400,
    },
    {
      title: '操作',
      key: 'action',

      width: 450,
      scopedSlots: {customRender: 'action'},
    },
  ];

  const usersColumns = [
    {
      title: '角色',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      key: 'action',
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
      ATreeSelect: TreeSelect,
    },
    data() {
      return {
        columns,
        addVisible: false,
        viewVisible: false,
        modifyId: '',
        data: [],
        searchParams: {
					type: '2',
          name: '',
          username: '',
					organizationId: '',
        },
        loading: false,
        scroll: {
          y: document.documentElement.clientHeight - 360,
          x: 1000,
        },
          pageSizeOptions: [10, 20, 30, 40, 50],
          pagination: {
              pageSize: 10,
              defaultCurrent: 1,
              total: 0,
              rows: 10,
              page: 0,
          },
        orgTreeData: [],
        roleList: [],

        // 查看角色
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

        // 添加角色
        addUsersVisible: false,
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
        autoDoFn(async () => {
          const orgRes = await getOrgTree();
          if (orgRes) {
            this.orgTreeData = transformTree(orgRes.data);
          }
          /*const roleRes = await getRoleAll();
          if (roleRes) {
            this.roleList = roleRes.data.list;
          }*/
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
          type: '2',
          organName:''
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
        handleUpadatePwd(data) {
            autoDoFn(async () => {
                this.loading = true;
                const res = await updatePwd(data);
                if (res) {
                    this.$message.success('重置密码成功');
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
