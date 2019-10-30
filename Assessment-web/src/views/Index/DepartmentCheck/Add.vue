<template>
    <Drawer :value="addVisible"
            @on-close="handleClose1"
            :mask-closable="false"
            :width="1500"
            :title="'部门考核计划明细'"
            id='table'
            >
        <div :style="{height: scroll.y + 100 + 'px', overflow: 'auto'}" >
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"

                     size="small"
                     bordered
                     :rowKey="record => String(record.id)"
                     :pagination="false">
                <template slot="input" slot-scope="text, record">
                    <editable-cell v-if="(state==0&&record.scoreSourceName!='自动计算')||state==1||(permission==1&&state!=0)" :text="record.quantity" @change="value => onCellChange(record, value)"/>
                    <span v-else>{{record.quantity}}</span>
                </template>
                <template slot="textInput" slot-scope="text, record">
                    <editabletext-cell  v-if="(record.indexId!='32'&&record.indexId!='36')&&(permission==1&&state!=0)" :text="record.ratingDescription" @change="value => onCellTextChange(record, value)"/>
                    <span v-else>{{record.ratingDescription}}</span>
                </template>
                <span slot="action" slot-scope="text, record">
                    <template>
                        <a href="javascript:;" @click="handleAdditionViewShow(record)">上传</a>
                    </template>
                </span>
            </a-table>
        </div>
        <div class="drawer-footer">
            <a-popconfirm v-if="state==1" placement="top" okText="确认" cancelText="取消" @confirm="confirm(2)">
                <template slot="title">
                    <p>确认提交后将无法修改</p>
                </template>
                <a-button>提交</a-button>
            </a-popconfirm>
            <a-popconfirm v-if="state==2&&permission==1" placement="top" okText="确认" cancelText="取消"
                          @confirm="confirm(3)">
                <template slot="title">
                    <p>确认核实？</p>
                </template>
                <a-button>确认</a-button>
            </a-popconfirm>
            <a-button @click="handleClose1" style="margin-right: 8px">关闭</a-button>
        </div>
        <addition-view :viewVisible="viewVisible"
                       @successCallback="handleAddSuccess"
                       :modifyId="itemId"
                       :state="state"
                       :permission="permission"
                       :handleClose="() => handleDrawerToggle('viewVisible', false)">
        </addition-view>
    </Drawer>
</template>

<script>
  import {
    Row,
    Col,
    Input,
    Button,
    Form,
    Select,
    Drawer,
    Spin,
    TreeSelect,
    Table,
    Upload,
    Icon,
    DatePicker,
    InputNumber,
    Popconfirm
  } from 'ant-design-vue';
  import {getDetail, detailEdit,descrptionEdit,updateState} from '@/remote/departmentCheck';
  import {autoDoFn} from '@/utils/util';
  import StaffModal from '@/components/StaffModal/StaffModal';
  import moment from 'moment';
  import EditableCell from './EditableCell';
  import EditabletextCell from './EditabletextCell';
  import AdditionView from './AdditionView';
  import _ from 'lodash';

  const {Item} = Form;
  const {Option} = Select;
  const {TextArea} = Input;

  export default {
    name: 'Add',
    components: {
      AInput: Input,
      ARow: Row,
      ACol: Col,
      AButton: Button,
      AForm: Form,
      AFormItem: Item,
      ASelect: Select,
      ASelectOption: Option,
      ATextArea: TextArea,
      ADrawer: Drawer,
      ASpin: Spin,
      ATreeSelect: TreeSelect,
      AUpload: Upload,
      AIcon: Icon,
      ADatePicker: DatePicker,
      ATable: Table,
      AInputNumber: InputNumber,
      APopconfirm: Popconfirm,
      StaffModal,
      EditableCell,
      EditabletextCell,
      AdditionView,
    },
    props: ['addVisible', 'handleClose', 'modifyId', 'state', 'permission', 'staffList', 'orgTreeData', 'roleList'],
    data() {
      const columns = [
        {
          title: '指标项',
          dataIndex: 'indexName',
          width: 80,
          customRender: this.customRender,
          className:'strong',
        },
        {
          title: '基准分',
          dataIndex: 'datumValue',
          width: 80,
          customRender: this.customRender,
        },
        {
          title: '最高限分',
          dataIndex: 'maxBonus',
          width: 100,
          customRender: this.customRender,
        },
        {
          title: '指标项得分',
          dataIndex: 'indexScore',
          width: 110,
          customRender: this.customRender,
        },
        {
          title: '规则名称',
          dataIndex: 'ruleName',
          width: 190,
        },
        {
          title: '评价标准',
          dataIndex: 'description',
          width: 220,
        },
        // {
        //   title: '打分设置',
        //   dataIndex: 'scoreSourceName',
        //   width: 180,
        // },
        {
          title: '计分公式',
          dataIndex: 'scoreTypeName',
          width: 90,
        },
        {
          title: '限额',
          dataIndex: 'cumulativeLimit',
          width: 60,
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          width: 100,
          scopedSlots: {customRender: 'input'},
        },
        {
          title: '分值',
          dataIndex: 'score',
          width: 80,
        },
        {
          title: '得分',
          dataIndex: 'ruleScore',
          width: 60,
        },
        {
          title: '附件',
          scopedSlots: {customRender: 'action'},
          width: 80,
        },
        {
          title: '评分说明',
          dataIndex: 'ratingDescription',
          width: 200,
          scopedSlots: {customRender: 'textInput'},
        },

      ];
      return {
        addLoading: false,
        columns,
        itemId: '',
        // permission:'',
        // state:'',
        data: [],
        viewVisible: false,
        searchParams: {
          year: new Date(moment().subtract(1, 'months').valueOf()),
          month: moment().subtract(1, 'months'),
          name: '',
          organizationId: '',
        },
        loading: false,
        scroll: {
          y: document.documentElement.clientHeight-200,

        },
        pagination: {
          defaultCurrent: 1,
          total: 0,
          row: 10,
          page: 0,
        },
        numberList: [],
        groupByData: {},
      };
    },
    computed: {},
    watch: {
      addVisible() {
        if (this.modifyId && this.addVisible) {
          autoDoFn(async () => {
            this.loading = true;
            const res = await getDetail({planId: this.modifyId});
            if (res) {
              this.data = res.data;
              this.groupByData = _.groupBy(res.data, 'indexId');
              this.numberList = res.data.map(item => ({
                [String(item.id)]: item.quantity,
              }));
            }
            this.loading = false;
          });
        }
      },
    },
    methods: {
      handleClose1() {
        this.$emit('successCallback');
      },
      confirm(state) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await updateState({
            id: this.modifyId, state: state
          });
          if (res) {
            this.$message.success('操作成功');
            this.$emit('successCallback');
          }
          this.addLoading = false;
        });
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            autoDoFn(async () => {
              this.addLoading = true;
              const res = await formPost(this.modifyId, {
                ...values,
                employeeId: this.selection.id,
              });
              if (res) {
                this.$message.success('操作成功');
                this.$emit('successCallback');
              }
              this.addLoading = false;
            });
          }
        });
      },
      onCellChange(record, value) {
        autoDoFn(async () => {
          this.loading = true;
          const res1 = await detailEdit({
            id: record.id,
          }, {
            ...record,
            quantity: value,
          });
          if (res1) {
            this.$message.success('操作成功!');
          }
          const res = await getDetail({planId: this.modifyId});
          if (res) {
            this.data = res.data;
            this.numberList = res.data.map(item => ({
              [String(item.id)]: item.quantity,
            }));
          }
          this.loading = false;
        });
      },
      onCellTextChange(record, value) {
        autoDoFn(async () => {
          this.loading = true;
          const res1 = await descrptionEdit({
            id: record.id, description: value
          }, {
            ...record,
            quantity: value,
          });
          if (res1) {
            this.$message.success('操作成功!');
          }
          const res = await getDetail({planId: this.modifyId});
          if (res) {
            this.data = res.data;
            this.numberList = res.data.map(item => ({
              [String(item.id)]: item.quantity,
            }));
          }
          this.loading = false;
        });
      },
      handleDrawerToggle(type, isVisible) {
        this[type] = isVisible;
        if (!isVisible) {
          this.modifyId = '';
        }
      },
      handleDrawerAdditionToggle(type, isVisible) {
        this[type] = isVisible;
        if (!isVisible) {
          this.itemId = '';
          // this.state = '';
          // this.permission = '';
        }
      },
      handleAdditionViewShow(rowData) {
        this.handleDrawerAdditionToggle('viewVisible', true);
        this.itemId = rowData.id;
        // this.state = state;
        this.permission = permission;
      },
      handleAddSuccess() {
        this.handleDrawerAdditionToggle('viewVisible', false);
        // autoDoFn(async () => {
        //   this.loading = true;
        //   const res = await getDetail({planId: this.modifyId});
        //   if (res) {
        //     this.data = res.data;
        //     this.numberList = res.data.map(item => ({
        //       [String(item.id)]: item.quantity,
        //     }));
        //   }
        //   this.loading = false;
        // });
      },
      customRender (value, row, index) {
        const obj = {
          children: value,
          attrs: {},
        };
        if(this.groupByData[row.indexId] && this.groupByData[row.indexId].length){
          const index = this.groupByData[row.indexId].findIndex(item => item.id === row.id);
          if(index === 0){
            obj.attrs.rowSpan = this.groupByData[row.indexId].length;
          }else{
            obj.attrs.rowSpan = 0;
          }
        }
        return obj;
      }
    },
  };
</script>

<style lang="less">
    .strong {
        font-weight:bolder;
        font-size : 900;
    }
    #table  tr  td {
      border-color: #999;
    }
    #table .ant-table-bordered .ant-table-thead > tr > th{
      border-color: #999;
    }

    #table .ant-table-bordered .ant-table-header > table{
      border-color: #999;
    }

    #table .ant-table-bordered .ant-table-body > table{
      border-color: #999;
    }

</style>
