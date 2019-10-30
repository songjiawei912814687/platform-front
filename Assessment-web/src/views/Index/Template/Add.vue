<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="320"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='模版名称'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入模版名称!' },{ max: 55, message: '最多55个字符!' }]}"
                        >
                            <a-input placeholder='请输入模版名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='模版类型'
                                fieldDecoratorId="type"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择模版类型!'}]}">
                            <a-select placeholder='请选择模版类型' @change="handleTypeChange">
                                <a-select-option value='0'>月度考核</a-select-option>
                                <a-select-option value='1'>年度考核</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='对象类型'
                                fieldDecoratorId="objectType"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择对象类型!'}]}">
                            <a-select placeholder='请选择对象类型' @change="handleObjectTypeChange">
                                <a-select-option value='0'>窗口</a-select-option>
                                <a-select-option value='1' :disabled="type === '1'">工作人员</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='启用状态'
                                fieldDecoratorId="state"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择启用状态!'}]}">
                            <a-select placeholder='请选择启用状态'>
                                <a-select-option value='0'>启用</a-select-option>
                                <a-select-option value='1'>停用</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" v-if="objectType !== '1'">
                        <a-form-item
                                label='考核对象'
                                fieldDecoratorId="objectList"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择考核对象!'}]}">
                            <a-select placeholder='请选择考核对象' mode="multiple"
                                      :disabled="!type && !objectType"
                                      showSearch
                                      :filterOption="filterOption"
                                      optionFilterProp="children">
                                <a-select-option v-for="item in objectListData"
                                                 :value='String(item.organizationId || item.id)'
                                                 :key='String(item.organizationId || item.id)'>{{item.organizationName
                                    || item.name}}
                                </a-select-option>
                            </a-select>
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
import { formPost, getDetail, getAppraisalOrganizationNotInUse, getRolesNotInUse } from '@/remote/template';
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
    ADatePicker: DatePicker,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData'],
  data() {
    return {
      addLoading: false,
      type: '',
      objectType: '',
      objectListData: [],
    };
  },
  computed: {
    title() {
      return this.modifyId ? '考核模版编辑' : '考核模版录入';
    },
  },
  created() {
  },
  watch: {
    addVisible() {
      if (this.modifyId && this.addVisible) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res.success) {
            const {
              name, type, objectType, state, objectIdList,
            } = res.data;
            this.type = String(type);
            this.objectType = String(objectType);
            this.$nextTick(() => {
              if (String(objectType) === '0') {
                this.getAppraisalOrganizationNotInUse();
                this.form.setFieldsValue({
                  name: String(name),
                  type: String(type),
                  objectType: String(objectType),
                  objectList: objectIdList ? objectIdList.split(',') : [],
                  state: String(state),
                });
              } else if (String(objectType) === '1') {
                this.form.setFieldsValue({
                  name: String(name),
                  type: String(type),
                  objectType: String(objectType),
                  state: String(state),
                });
              }
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
            const res = await formPost({
              id: this.modifyId,
              objectIdList: values.objectType==='1'?'':values.objectList.join(','),
            }, {
              name: values.name,
              objectType: values.objectType,
              type: values.type,
              state: values.state,
              id: this.modifyId,
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
    handleTypeChange(value) {
      this.type = value;
      this.form.setFieldsValue({
        objectType: '',
        objectList: [],
      });
    },
    handleObjectTypeChange(value) {
      this.objectType = value;
      this.form.setFieldsValue({
        objectList: [],
      });
      if (value === '0') {
        this.getAppraisalOrganizationNotInUse();
      }
    },
    getAppraisalOrganizationNotInUse() {
      autoDoFn(async () => {
        const res = await getAppraisalOrganizationNotInUse({ templateId: this.modifyId,type:this.type });
        if (res) {
          this.objectListData = res.data;
        }
      });
    },
    filterOption(input, option) {
      console.log(input)
      console.log(option.componentOptions.children[0].text)
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  },
};
</script>

<style scoped>

</style>
