<template>
    <Drawer v-model="newRuleAddVisible"
              @on-close="handleClose"
              :mask-closable="false"
              :width="320"
              :destroyOnClose="true"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="newRuleAddVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}">
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item
                            label='规则名称'
                            fieldDecoratorId="name"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入规则名称!' },{ max: 255, message: '最多255个字符!' }]}"
                    >
                        <a-input placeholder='请输入规则名称'/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='规则值'
                            fieldDecoratorId="value"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入规则值!' },{ max: 255, message: '最多255个字符!' }]}"
                    >
                        <a-input placeholder='请输入规则值'/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='是否启用'
                            fieldDecoratorId="state"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否启用' }]}"
                    >
                        <a-select>
                            <a-select-option value="1">启用</a-select-option>
                            <a-select-option value="3">停用</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='类型'
                            fieldDecoratorId="type"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择类型' }]}"
                    >
                        <a-select>
                            <a-select-option value="1">上午上班</a-select-option>
                            <a-select-option value="3">上午下班</a-select-option>
                            <a-select-option value="2">下午上班</a-select-option>
                            <a-select-option value="4">下午下班</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='规则说明'
                            fieldDecoratorId="description"
                            :fieldDecoratorOptions="{rules: [{ max: 255, message: '最多255个字符!' }]}">
                        <a-text-area placeholder='请输入规则说明' style="height: 150px"/>
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
import { formPost, getDetail } from '@/remote/attendanceRuleNew';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
  name: 'NewRuleAdd',
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
  props: ['newRuleAddVisible','handleClose', 'modifyId', 'orgTreeData','attendanceRuleConfigId','newRuleViewVisible'],
  data() {
    return {
      addLoading: false,
    };
  },
  computed: {
    title() {
      return this.modifyId ? '考勤规则编辑' : '考勤规则录入';
    },
  },
  watch: {
      newRuleAddVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            const {
              name, value, state,description,type,
            } = res.data;
            this.form.setFieldsValue({
              name,
              value,
              description,
              state: String(state),
              type: String(type),
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
                        attendanceRuleConfigId : this.attendanceRuleConfigId,
                        ...values,
                        state: window.parseInt(values.state),
                        type: window.parseInt(values.type),
                    });
                    console.log(res)
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
