<template>
    <a-drawer :visible="visible"
              @close="handleClose"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="780"
              title="步骤设置">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <div class="action">
                <a-button @click="handleDrawerToggle('addVisible',true)">录入</a-button>
            </div>
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     @change="onPageChange"
                     :rowKey="record => String(record.id)"
                     :pagination="pagination"
            >
            <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)">查看</a>
                    <template>
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                    <template>
                        <a-divider type="vertical"/>
                        <a-popconfirm title="确认要删除此条数据?" @confirm="handleDelete({idList: record.id})" okText="确认"
                                      cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>

                </span>

            </a-table>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
        </div>

        <detail-view :viewVisible="viewVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('viewVisible', false)"></detail-view>

        <add :addVisible="addVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :orgTreeData="orgTreeData"
             :jobList="jobList"
             :roleList="roleList"
             :approvalId="approvalId"
             :levelList="levelList"
             :handleClose="() => handleDrawerToggle('addVisible', false)"></add>
    </a-drawer>

</template>

<script>
  import {
    Button,
    Select,
    Drawer,
    Spin,
    Table,
    Popconfirm,
  } from 'ant-design-vue';
  import { autoDoFn, transformTree } from '@/utils/util';
  import { getSteps, getDel } from '@/remote/approvalConfig';
  import Add from './stepsAdd';
  import { getOrgTree, getRoleAll, getJobAll, getLevelAll } from '@/remote/base';
  import DetailView from './stepsDetailView';

  const columns = [
    {
      title: '步骤',
      dataIndex: 'successivelyLevelName',
      width: 100,
      fixed: 'left',
    },
    {
      title: '审批人类型',
      dataIndex: 'approverTypeName',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 500,
      scopedSlots: { customRender: 'action' },
    }
  ];

  export default {
    name: 'steps',
    components: {
      AButton: Button,
      ADrawer: Drawer,
      ASpin: Spin,
      ATable: Table,
      APopconfirm: Popconfirm,
      Add,
      DetailView
    },
    props: ['visible', 'handleClose', 'approvalId'],
    data() {
      return {
        data: [],
        columns,
        addLoading: false,
        modifyId: '',
        addVisible: false,
        viewVisible: false,
        orgTreeData: [],
        roleList: [],
        jobList: [],
        levelList: [],
        searchParams: {
          name: '',
          windowNo: '',
        },
        pagination: {
          defaultCurrent: 1,
          total: 0,
          row: 10,
          page: 0,
        },
      };
    },
    watch: {
      visible() {
        if (this.visible) {
          this.initTable();
          this.initBaseData();
          this.getLevel();
        }
      },
    },

    methods: {
      initTable() {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getSteps({
            approvalId: this.approvalId,
            ...this.searchParams,
            ...this.pagination,
          });
          if (res) {
            this.data = res.data.list;
            this.pagination.total = res.data.total;
            this.pagination.page = res.data.pageNum;
            this.pagination.row = res.data.pageSize;
          }
          this.addLoading = false;
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
        this.getLevel();
        this[type] = isVisible;
        if (!isVisible) {
          this.modifyId = '';
        }
      },
      getLevel() {
        autoDoFn(async () => {
          const levelRes = await getLevelAll({
            approvalId: this.approvalId,

          });
          if (levelRes) {
            this.levelList = levelRes.data;
          }

        });
      },
      handleAddSuccess() {
        this.handleDrawerToggle('addVisible', false);
        this.initTable();
        this.getLevel();
        this.initBaseData();
      },
      initBaseData() {
        autoDoFn(async () => {
          const orgRes = await getOrgTree();
          if (orgRes) {
            this.orgTreeData = transformTree(orgRes.data);
          }
          const jobRes = await getJobAll();
          if (jobRes) {
            this.jobList = jobRes.data;
          }
          const roleRes = await getRoleAll();
          if (roleRes) {
            this.roleList = roleRes.data;
          }


        });

      },
      onPageChange(pagination) {
        this.pagination.page = pagination.current;
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
            this.loading = false;
            this.initTable();
            this.getLevel();
          } else {
            this.loading = false;
          }
        });
      },
    }
  };
</script>

<style scoped>
    a {
        padding: 0 5px;
    }
</style>
