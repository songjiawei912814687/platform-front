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
                            label='加班日期'
                            fieldDecoratorId="overTimeDate"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择加班日期!' }]}"
                    >
                        <a-date-picker style="width: 100%"></a-date-picker>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='加班原因'
                            fieldDecoratorId="description"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入加班原因!' }]}"
                    >
                        <a-text-area placeholder="请输入加班原因" style="height: 150px"></a-text-area>
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
    </Drawer>
</template>

<script>
import { Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, DatePicker, InputNumber } from 'ant-design-vue';
import { formPost, getDetail } from '@/remote/leaveOvertime';
import { autoDoFn } from '@/utils/util';
import moment from 'moment';
import StaffModal from '@/components/StaffModal/StaffModal';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

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
    ARangePicker: RangePicker,
    AInputNumber: InputNumber,
    StaffModal
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'staffList'],
  data() {
    return {
      addLoading: false,
      dateFormat: 'YYYY-MM-DD',
      selectedRowKeys: [],
      selection: {},
      selectStaffVisible: false,
      organizationName: localStorage.getItem('organName'),
      employeesName: localStorage.getItem('employeesName'),
    };
  },
  computed: {
    title() {
      return this.modifyId ? '加班申请编辑' : '加班申请录入';
    },
  },
  watch: {
    addVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            const {
              organizationId, employeesName, overTimeDate, description,
            } = res.data;
            this.selection = {
              id: res.data.employeesId,
              name: res.data.employeesName,
            };
            this.form.setFieldsValue({
              description,
              overTimeDate: moment(overTimeDate),
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
              overTimeDate: values.overTimeDate.format('YYYY-MM-DD'),
              organizationId: localStorage.getItem('organId'),
              employeesId : localStorage.getItem('employeeId'),
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
        employeesName: selections[0].name,
      });
      this.handleUpdateData('selectStaffVisible', false);
    },
    staffSelect() {
      const { id } = this.selection;
      this.selectedRowKeys = id ? [String(id)] : [];
      this.handleUpdateData('selectStaffVisible', true);
    },
  },
};
</script>

<style scoped>

</style>
