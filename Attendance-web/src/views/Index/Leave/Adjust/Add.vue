<template>
    <Drawer v-model="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="320"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item
                            label='所属机构' >
                        <a-input :disabled="true" v-model="organizationName"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='申请人' >
                        <a-input :disabled="true" v-model="employeesName"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='调休日期'
                            fieldDecoratorId="restTime"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择调休日期' }]}"
                    >
                        <a-date-picker :disabledDate="disabledDate" style="width: 100%"></a-date-picker>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='加班日期'
                            fieldDecoratorId="overTimeDate"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择加班日期!' }]}">
                        <a-input :disabled="true" placeholder='请选择加班日期'
                                 style="width: 200px;margin-right: 15px"></a-input>
                    </a-form-item>
                    <a-button style="position: absolute; right: 12px; top: 28px;" type="primary" @click="overTimeSelect">选择</a-button>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='调休原因'
                            fieldDecoratorId="description"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入调休原因!' }]}"
                    >
                        <a-text-area placeholder="请输入调休原因" style="height: 150px"></a-text-area>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
        </div>
        <staff-modal :membersVisible="selectStaffVisible"
                     :propsSelectedRowKeys="selectedRowKeys"
                     @cancel="handleUpdateData('selectStaffVisible', false)"
                     @ok="handleSelectStaffOk"
                     type="radio"
        ></staff-modal>
        <over-time-modal :membersVisible="overTimeVisible"
                     :propsSelectedRowKeys="overTimeSelectedRowKeys"
                     @cancel="handleUpdateData('overTimeVisible', false)"
                     @ok="handleSelectOverTimeOk"
                     type="radio"
        ></over-time-modal>
    </Drawer>
</template>

<script>
import { Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, DatePicker } from 'ant-design-vue';
import { formPost, getDetail } from '@/remote/leaveAdjust';
import { autoDoFn } from '@/utils/util';
import moment from 'moment';
import StaffModal from '@/components/StaffModal/StaffModal';
import OverTimeModal from './OverTimeModal';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

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
    ADatePicker: DatePicker,
    StaffModal,
    OverTimeModal,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData'],
  data() {
    return {
      addLoading: false,
      selectedRowKeys: [],
      overTimeSelectedRowKeys: [],
      selection: {},
      overTimeSelection: {},
      selectStaffVisible: false,
      overTimeVisible: false,
      organizationName: localStorage.getItem('organName'),
      employeesName: localStorage.getItem('employeesName'),
    };
  },
  computed: {
    title() {
      return this.modifyId ? '调休申请编辑' : '调休申请录入';
    },
  },
  watch: {
    addVisible() {
      if (this.modifyId && this.addVisible) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            const {
              employeeName, organizationId, restTime, description,
              overTimeDate,
            } = res.data;
            this.selection = {
              id: res.data.employeeId,
              name: res.data.employeeName,
            };
            this.overTimeSelection = {
              overTimeDate: res.data.overTimeDate,
            };
            this.form.setFieldsValue({
              organizationId : String(organizationId),
              employeeName,
              description,
              restTime: moment(restTime),
              overTimeDate,
            });
          }
          this.addLoading = false;
        });
      }else {
        this.selection = {};
      }
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await formPost(this.modifyId, {
              ...values,
              restTime: values.restTime.format('YYYY-MM-DD'),
              organizationId: localStorage.getItem('organId'),
              employeesId : localStorage.getItem('employeeId'),
              overTimeId: this.overTimeSelection.id,
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
    handleUpdateData(name, value) {
      this[name] = value;
    },
    handleSelectStaffOk(selectedRowKeys, selections) {
      this.selection = selections[0];
      this.form.setFieldsValue({
        employeeName: selections[0].name,
      });
      this.handleUpdateData('selectStaffVisible', false);
    },
    handleSelectOverTimeOk(selectedRowKeys, selections) {
      this.overTimeSelection = selections[0];
      this.form.setFieldsValue({
        overTimeDate: selections[0].overTimeDate,
      });
      this.handleUpdateData('overTimeVisible', false);
    },
    staffSelect() {
      const { id } = this.selection;
      this.selectedRowKeys = id ? [String(id)] : [];
      this.handleUpdateData('selectStaffVisible', true);
    },
    overTimeSelect() {
      const { id } = this.overTimeSelection;
      this.overTimeSelectedRowKeys = id ? [String(id)] : [];
      this.handleUpdateData('overTimeVisible', true);
    },
    transDateFormat(date, format = 'YYYY-MM-DD'){
      return moment(date.format(format))
    },
    // 日期限制
    disabledDate(currentDate) {
      if(!currentDate){
        return false;
      }
      return this.transDateFormat(currentDate).valueOf() < this.transDateFormat(moment()).valueOf();
    },
  },
};
</script>

<style scoped>

</style>
