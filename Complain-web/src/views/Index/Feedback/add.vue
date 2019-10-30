<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="反馈信息修改">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view" ref="form" :autoFormCreate="(form)=>{this.form = form}" @submit="handleSubmit">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='姓名'>
                            {{viewData.personName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='电话'>
                            {{viewData.phone || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='受理部门'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='受理窗口'>
                            {{viewData.windowNo || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='办理时间'>
                            {{viewData.feedbackTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='满意度' fieldDecoratorId="satisfaction"
                                     :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择满意度!'}]}">
                            <a-select placeholder="请选择满意度" :disabled="satisfaction === '0'">
                                <a-select-option value="0">满意</a-select-option>
                                <a-select-option value="1">不满意</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='实现率' fieldDecoratorId="completeRate"
                                     :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择实现率!'}]}">
                            <a-select placeholder="请选择实现率" :disabled="completeRate === '1'">
                                <a-select-option value="1">跑一次</a-select-option>
                                <a-select-option value="2">跑多次</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">关闭</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="viewLoading">保存</a-button>
        </div>
    </a-drawer>
</template>

<script>
import { Row, Col, Button, Form, Drawer, Spin, Tooltip, Select, Input } from 'ant-design-vue';
import { getDetail, modify } from '@/remote/feedback';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;

export default {
  name: 'DetailView',
  components: {
    ARow: Row,
    ACol: Col,
    AButton: Button,
    AForm: Form,
    AFormItem: Item,
    ASelectOption: Option,
    ASelect: Select,
    ADrawer: Drawer,
    ASpin: Spin,
    ATooltip: Tooltip,
    AInput: Input,
  },
  props: ['viewVisible', 'handleClose', 'modifyId'],
  data() {
    return {
      viewData: {},
      viewLoading: false,
      form: null,
      completeRate: '0',
      satisfaction: '1',
        satisfactionName:'非常满意',
        completeRateName:'跑一次',
    };
  },
  watch: {
    viewVisible() {
      if (this.modifyId && this.viewVisible) {
        autoDoFn(async () => {
            this.viewLoading = true;
            const res = await getDetail({ id: this.modifyId });

            if (res.success) {
                this.viewData = {
                ...res.data,
                };
            }
            this.completeRate= String(res.data.completeRate);
            this.satisfaction= String(res.data.satisfaction);
          this.form.setFieldsValue({
            completeRate: res.data.completeRate===undefined?'': String(res.data.completeRate),
            satisfaction: res.data.satisfaction===undefined?'': String(res.data.satisfaction),
          });
            this.viewLoading = false;
            });
        }
    },
  },
  methods: {
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            this.viewLoading = true;
            const res = await modify({
              id: this.modifyId,
              statis: values.satisfaction,
              complete: values.completeRate
            });
            if (res.success) {
              this.$message.success('操作成功');
              this.$emit('successCallback');
            }
            this.viewLoading = false;
          });
        }
      });
    },
  },
};
</script>

