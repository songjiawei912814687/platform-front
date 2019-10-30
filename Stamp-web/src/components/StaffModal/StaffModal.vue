<template>
    <div class="staff-modal">
        <a-modal
                title="选择人员"
                :visible="membersVisible"
                @cancel="handleCancel"
                @ok="handleOk"
                :width="760"
        >
            <div class="staff-header">
                <a-row>
                    <a-col :span="3">
                        <p class="header__label">姓名：</p>
                    </a-col>
                    <a-col :span="6">
                        <a-input v-model="searchParams.name" placeholder="请输入姓名"></a-input>
                    </a-col>
                    <a-col :span="3">
                        <p class="header__label">工号：</p>
                    </a-col>
                    <a-col :span="6">
                        <a-input v-model="searchParams.employeeNo" placeholder="请输入工号"></a-input>
                    </a-col>
                    <a-col :span="6">
                        <p style="text-align: right;">
                            <a-button @click="handleReset" style="margin-right: 5px">清空</a-button>
                            <a-button @click="getMembers" type="primary">查询</a-button>
                        </p>
                    </a-col>
                </a-row>
            </div>
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
import { getStaffPage } from '@/remote/base';
import { autoDoFn } from '@/utils/util';

const membersColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '工号',
    dataIndex: 'employeeNo',
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
    propsSelectedRowKeys: {
      required: false,
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    membersVisible() {
      if(this.membersVisible){
        this.getMembers();
        this.selectedRowKeys = this.propsSelectedRowKeys;
      }
    },
  },
  data: () => ({
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
    searchParams: {
      name: '',
      employeeNo: '',
    },
  }),
  methods: {
    getMembers() {
      autoDoFn(async () => {
        this.membersLoading = true;
        const res = await getStaffPage({
          ...this.searchParams,
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
      this.searchParams = {
        name: '',
        employeeNo: '',
      };
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
  },
};
</script>

<style lang="less" scoped>
    .header__label {
        text-align: right;
        line-height: 32px;
    }
</style>
