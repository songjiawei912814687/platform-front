<template>
    <a-drawer :visible="leaveVisible"
              @close="handleClose"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="320"
              title="人员离职">
        <a-form @submit="handleSubmit" :autoFormCreate="(form)=>{this.form = form}" class="form">
            <a-row>
                <a-col :span="24 ">
                    <div class="form__item" style="margin-bottom: 24px">
                        <p class="form__label">人员姓名</p>
                        <a-input placeholder='请输入人员姓名' :disabled="true"/>
                    </div>
                </a-col>
                <a-col :span="24">
                    <div class="form__item">
                        <p class="form__label">开通消费</p>
                        <a-form-item
                                fieldDecoratorId="organizationId"
                        >
                            <a-select
                                    placeholder='请选择开通消费'
                            >
                                <a-select-option value='one'>开通消费1</a-select-option>
                                <a-select-option value='two'>开通消费2</a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                </a-col>
                <a-col :span="24">
                    <div class="form__item">
                        <p class="form__label">开通道闸</p>
                        <a-form-item
                                fieldDecoratorId="organizationId"
                        >
                            <a-select
                                    placeholder='请选择开通道闸'
                            >
                                <a-select-option value='one'>开通道闸1</a-select-option>
                                <a-select-option value='two'>开通道闸2</a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                </a-col>
                <a-col :span="24 ">
                    <div class="form__item">
                        <p class="form__label">离职原因</p>
                        <a-form-item fieldDecoratorId="resean">
                            <a-text-area placeholder='请输入离职原因' style="height: 150px"/>
                        </a-form-item>
                    </div>
                </a-col>
            </a-row>
        </a-form>
        <div slot="footer">
            <a-button @click="handleClose">取消</a-button>
            <a-button @click="handleSubmit" type="primary">保存</a-button>
        </div>
    </a-drawer>
</template>

<script>
import { Row, Col, Input, Button, Table, Form, Select, DatePicker, Upload, Icon, Drawer } from 'ant-design-vue';
import { employeesFormPost } from '@/remote/staff';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
  name: 'Leave',
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
    ATextArea: TextArea,
    ADrawer: Drawer,
  },
  props: ['title', 'rowData', 'leaveVisible', 'handleClose'],
  data() {
    return {};
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          employeesFormPost(values).then((res) => {
            if (res) {
              this.$message.success('操作成功');
              this.$emit('successCallback');
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
