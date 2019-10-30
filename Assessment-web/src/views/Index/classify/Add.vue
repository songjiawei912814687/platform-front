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
                                label='指标类型'
                                fieldDecoratorId="type"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择指标类型!'}]}">
                            <a-select placeholder='请选择指标类型'>
                                <a-select-option value='0'>动态效能指标</a-select-option>
                                <a-select-option value='1'>常态效能指标</a-select-option>
                                <a-select-option value='3'>工作人员考核</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='指标名称'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入指标名称!'}]}">
                            <a-input placeholder='请输入指标名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='基准值'
                                fieldDecoratorId="datumValue"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入基准值!'}]}">
                            <a-input placeholder='请输入基准值'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='累计最高加分'
                                fieldDecoratorId="maxBonus"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入累计最高加分!'}]}">
                            <a-input placeholder='请输入累计最高加分'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='对象类型'
                                fieldDecoratorId="objectType"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入对象类型!'}]}">
                            <a-select placeholder='请选择对象类型'>
                                <a-select-option value='0'>窗口</a-select-option>
                                <a-select-option value='1'>工作人员</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='状态'
                                fieldDecoratorId="state"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入状态!'}]}">
                            <a-select placeholder='请选择状态'>
                                <a-select-option value='0'>启用</a-select-option>
                                <a-select-option value='1'>停用</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='排序'
                                fieldDecoratorId="displayOrder"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入排序' }]}">
                            <a-input-number placeholder='请输入排序' style="width: 100%;" :min="1" :max="999"/>
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
  InputNumber,
  Button,
  Form,
  Select,
  Drawer,
  Spin,
  TreeSelect,
  Upload,
  Icon,
  DatePicker,
} from 'ant-design-vue';
import { formPost, getDetail } from '@/remote/classify';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
  name: 'Add',
  components: {
    AInput: Input,
    AInputNumber: InputNumber,
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
  },
  props: ['addVisible', 'handleClose', 'modifyId'],
  data() {
    return {
      addLoading: false,
    };
  },
  computed: {
    title() {
      return this.modifyId ? '指标分类编辑' : '指标分类录入';
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
              type, name, datumValue, maxBonus, objectType, state,displayOrder
            } = res.data;
            this.form.setFieldsValue({
              type: String(type), name, datumValue, maxBonus, objectType: String(objectType), state: String(state),displayOrder: displayOrder===undefined?"": String(displayOrder),
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
              type: Number(values.type),
              name: String(values.name),
              datumValue: Number(values.datumValue),
              maxBonus: Number(values.maxBonus),
              objectType: Number(values.objectType),
              state: Number(values.state),
              displayOrder: Number(values.displayOrder),
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

<style lang="less">

</style>
