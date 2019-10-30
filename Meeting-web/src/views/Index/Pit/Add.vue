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
                                label='开标评标室名称'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入开标评标室名称!'},{ max: 55, message: '最多55个字符!' }]}">
                            <a-input placeholder='请输入开标评标室名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='开标评标室类型'
                                fieldDecoratorId="type"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择开标评标室类型!' }]}"
                        >
                            <a-select
                                    placeholder='请选择开标评标室类型'
                                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                            >
                                <a-select-option value='0'>开标室</a-select-option>
                                <a-select-option value='1'>评标室</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='可容纳人数'
                                fieldDecoratorId="containNumber"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入可容纳人数!'}]}">
                            <a-input-number placeholder='请输入可容纳人数' :min="10" :max="100" style="width: 100%"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='ip'
                                fieldDecoratorId="ipList"
                                :fieldDecoratorOptions="{rules: []}"
                        >
                            <a-select
                                    mode="tags"
                                    style="width: 100%"
                                    @change="handleselectChange"
                                    placeholder="请输入招评室ip，按回车键确认"
                            >
                                <a-select-option v-for="i in 0" :key="(i + 9).toString(36) + i">{{(i + 9).toString(36) + i}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='描述'
                                fieldDecoratorId="description"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入描述!'},{max:255,message:'最多255个字符！'}]}">
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
  Upload,
  Icon,
  DatePicker,
  InputNumber,
} from 'ant-design-vue';
import { formPost, getDetail } from '@/remote/pit';
import { autoDoFn } from '@/utils/util';

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
    AUpload: Upload,
    AIcon: Icon,
    ADatePicker: DatePicker,
    AInputNumber: InputNumber,
  },
  props: ['addVisible', 'handleClose', 'modifyId'],
  data() {
    return {
      addLoading: false,
    };
  },
  computed: {
    title() {
      return this.modifyId ? '开标评标室编辑' : '开标评标室录入';
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
              name, description, ip,containNumber,type
            } = res.data;
            this.form.setFieldsValue({
              description,
              name,
              ipList: ip === undefined || ip === '' ? undefined : ip.split(','),
              containNumber,
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
              ...values,
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

<style lang="less">

</style>
