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
                            label='名称'
                            fieldDecoratorId="holidayName"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入节假日名称!' },{ max: 50, message: '最多50个字符!' }]}"
                    >
                        <a-input placeholder='请输入节假日名称'/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='开始结束时间'
                            fieldDecoratorId="holidayDate"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择开始结束时间!' }]}">
                        <a-range-picker format="YYYY-MM-DD" style="width: 100%;"></a-range-picker>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='工作日'
                            fieldDecoratorId="isWorkDay"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否为工作日!' }]}"
                    >
                        <a-select>
                            <a-select-option value="3">是</a-select-option>
                            <a-select-option value="1">否</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='描述'
                            fieldDecoratorId="description"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入描述!' }]}"
                    >
                        <a-text-area placeholder='请输入描述' style="height: 150px"></a-text-area>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
        </div>
    </Drawer>
</template>

<script>
import { Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, DatePicker, InputNumber } from 'ant-design-vue';
import { formPost, getDetail } from '@/remote/leaveHoliday';
import { autoDoFn } from '@/utils/util';
import moment from 'moment';

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
  },
  props: ['addVisible', 'handleClose', 'modifyId'],
  data() {
    return {
      addLoading: false,
      dateFormat: 'YYYY-MM-DD',
    };
  },
  computed: {
    title() {
      return this.modifyId ? '节假日信息编辑' : '节假日信息录入';
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
              holidayName, startDate, endDate, isWorkDay, description,
            } = res.data;
            this.form.setFieldsValue({
              holidayName,
              holidayDate: [moment(startDate), moment(endDate)],
              description,
              isWorkDay: String(isWorkDay),
            });
          }
          this.addLoading = false;
        });
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
              startDate: values.holidayDate[0].format(this.dateFormat),
              endDate: values.holidayDate[1].format(this.dateFormat),
              id: this.modifyId,
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
  },
};
</script>

<style scoped>

</style>
