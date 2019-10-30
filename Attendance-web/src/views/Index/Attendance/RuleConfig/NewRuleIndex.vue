<template>
        <a-drawer :visible = "newRuleViewVisible"
                @close="handleClose"
                 :destroyOnClose = "true"
                :width="1000"
                title="考勤规则">
        <div class="action">
            <a-button @click="addwsssss('newRuleAddVisible', true)">录入</a-button>
        </div>
        <div class="content" style="top: 100px;">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     :rowKey="record => String(record.id)"
                     @change="onPageChange"
                     :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="handleViewShow(record)">查看</a>
                    <template>
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="handleModifyShow(record)">编辑</a>
                    </template>
                      <template v-if="authorityActionList.indexOf('A_ATTENDANCE_ATTENDANCEMANAGEMENT_ATTENDANCERULE_DISABLE') > -1">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" v-if="String(record.state) === '3'" @click="handleChangeState(record, true)">启用</a>
                        <a href="javascript:;" v-else @click="handleChangeState(record, false)">停用</a>
                    </template>
                    <template>
                        <a-divider  type="vertical"/>
                        <a-popconfirm  title="确认要删除此条数据?"
                                      @confirm="handleDelete({idList: record.id})" okText="确认" cancelText="取消">
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
        <new-rule-add :newRuleAddVisible="newRuleAddVisible"
             @successCallback="handleAddSuccess"
             :modifyId="modifyId"
             :attendanceRuleConfigId="attendanceRuleConfigId"
             :handleClose="() => handleDrawerToggle('newRuleAddVisible', false)">
        </new-rule-add>
        <new-rule-detail-view :newRuleDetailVisible="newRuleDetailVisible"
                     :modifyId="modifyId"
                     :handleClose="() => handleDrawerToggle('newRuleDetailVisible', false)">
        </new-rule-detail-view>

        </a-drawer>
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
  Drawer,
  Icon,
  Divider,
  Popconfirm,
} from 'ant-design-vue';
import { getPage, getDel, start, stop,getDetail } from '@/remote/attendanceRuleNew';
import { getOrgTree } from '@/remote/base';
import SearchBox from '@/components/SearchBox/SearchBox';
import SearchBoxItem from '@/components/SearchBox/SearchBoxItem';
import NewRuleAdd from './NewRuleAdd';
import NewRuleDetailView from './NewRuleDetailView';
import { autoDoFn, transformTree } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;

const columns = [
  {
    title: '规则名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '规则值',
    dataIndex: 'value',
    width: 100,
  },
  {
    title: '启用状态',
    dataIndex: 'stateName',
    width: 200,
  },
  {
    title: '规则说明',
    dataIndex: 'description',
    width: 300,
  },
  {
    title: '操作',
    key: 'action',
    width: 230,
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  name: 'NewRuleIndex',
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
    ADrawer: Drawer,
    APopconfirm: Popconfirm,
    SearchBox,
    SearchBoxItem,
    NewRuleAdd,
    NewRuleDetailView,
  },

    props:['newRuleViewVisible','handleClose','attendanceRuleConfigId','newRuleAddVisible','modifyId'],
  data() {
    return {
      columns,
      newRuleViewVisible: false,
      newRuleAddVisible:false,
      newRuleDetailVisible:false,
      modifyId: '',
      data: [],
      searchParams: {
      name: '',
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
    watch: {
        newRuleViewVisible() {
            this.initList();
        },
    },
  methods: {
      addwsssss(type, isVisible){
          this.handleDrawerToggle(type,isVisible)
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
              }
              this.loading = false;
          });
      },
      onShowSizeChange() {
          this.pagination.rows = this.pagination.pageSize
          this.initList()
      },
    initList() {
      autoDoFn(async () => {
        this.loading = true;
        const res = await getPage({
            ...this.searchParams,
            attendanceRuleConfigId:this.attendanceRuleConfigId,
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
      this.handleDrawerToggle('newRuleAddVisible', true);
      this.modifyId = rowData.id;
    },
    handleViewShow(rowData) {
      this.handleDrawerToggle('newRuleDetailVisible', true);
      this.modifyId = rowData.id;
    },
    handleDrawerToggle(type, isVisible) {
      this[type] = isVisible;
      if (!isVisible) {
        this.modifyId = '';
      }
    },
    handleAddSuccess() {
      this.handleDrawerToggle('newRuleAddVisible', false);
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
        total: 0,
        row: 10,
        page: 0,
      };
      this.$nextTick(() => {
        this.initList();
      });
    },
    // handleDelete(data) {
    //   autoDoFn(async () => {
    //     this.loading = true;
    //     const res = await getDel(data);
    //     if (res) {
    //       this.$message.success('删除成功');
    //       this.initList();
    //     }
    //     this.loading = false;
    //   });
    // },
    handleChangeState(data, type) {
      this.loading = true;
      if (type) {
        autoDoFn(async () => {
          const res = await start({ idList: data.id });
          if (res) {
            this.$message.success('操作成功！');
          }
          this.loading = false;
          this.initList();
        });
      } else {
        autoDoFn(async () => {
          const res = await stop({ idList: data.id });
          if (res) {
            this.$message.success('操作成功！');
          }
          this.loading = false;
          this.initList();
        });
      }
    },
    onPageChange(pagination) {
      this.pagination.page = pagination.current;
      this.$nextTick(() => {
        this.initList();
      });
    },
  },

};
</script>

<style lang="less">

</style>
