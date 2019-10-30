<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="320"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item
                            label='业务类型'
                            fieldDecoratorId="state"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择业务类型!'}]}">
                        <a-select placeholder='请选择业务类型'>
                            <a-select-option value='0'>窗口回访</a-select-option>
                            <a-select-option value='1'>人员入职</a-select-option>
                            <a-select-option value='3'>人员离职</a-select-option>
                            <a-select-option value='5'>会议提醒</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='接收号码'
                            fieldDecoratorId="name"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入接收号码!' }]}"
                    >
                        <a-input placeholder='请输入接收号码'/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='下发时间'
                            fieldDecoratorId="recordDateTime"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请选择下发时间!'}]}">
                        <a-date-picker format="YYYY/MM/DD HH:mm:ss" :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" style="width: 100%"/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='短信内容'
                            fieldDecoratorId="description"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入模板内容!'},{max:255,message:'最多255个字符！'}]}">
                        <a-text-area placeholder='请输入模板内容' style="height: 150px"/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='状态'
                            fieldDecoratorId="state"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择状态!'}]}">
                        <a-select placeholder='请选择状态'>
                            <a-select-option value='0'>待发送</a-select-option>
                            <a-select-option value='1'>发送失败</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='描述'
                            fieldDecoratorId="description"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入描述!'},{max:255,message:'最多105个字符！'}]}">
                        <a-text-area placeholder='请输入描述' style="height: 150px"/>
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
import { Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, DatePicker } from 'ant-design-vue';
import { getPageError, reSendAll, reSend } from '@/remote/message';
import { autoDoFn } from '@/utils/util';
import moment from 'moment';

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
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'classifyList'],
  data() {
    return {
      addLoading: false,
      state: {
        value: '1',
      },
    };
  },
  computed: {
    title() {
      return this.modifyId ? '短信模板编辑' : '短信模板录入';
    },
  },
  watch: {
    addVisible() {
      if (this.modifyId && this.addVisible) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res.success) {
            const {
              state,
            } = res.data;
            this.form.setFieldsValue({
              state: String(state),
            });
          }
          this.addLoading = false;
        });
      }
    },
  },
  methods: {
    moment,
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await formPost(this.modifyId, {
              appraisalId: window.parseInt(values.appraisalId),
              name: String(values.name),
              description: String(values.description),
              scoreType: window.parseInt(values.scoreType),
              scoreSource: window.parseInt(values.scoreSource),
              dataType: values.dataType ? window.parseInt(values.dataType) : 0,
              cumulativeLimit: Number(values.cumulativeLimit),
              score: Number(values.score),
              defaultScore: Number(values.defaultScore),
              state: window.parseInt(values.state),
            });
            if (res.success) {
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
