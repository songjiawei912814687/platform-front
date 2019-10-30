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
                            label='小组名称'
                            fieldDecoratorId="name"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入小组名称!' },{ max: 255, message: '最多255个字符!' }]}"
                    >
                        <a-input placeholder='请输入小组名称'/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='描述'
                            fieldDecoratorId="description"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入描述!'},{max:255,message:'最多105个字符！'}]}">
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
  DatePicker,
} from 'ant-design-vue';
import { getDetail, formPost } from '@/remote/group';
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
  props: [
    'addVisible',
    'handleClose',
    'modifyId'
  ],
  data() {
    return {
      addLoading: false,
      selectStaffVisible: false,
      selectedRowKeys: [],
      selectedRowName: [],
      employeeIds: [],
      state: {
        value: '1',
      },
    };
  },
  computed: {
    title() {
      return this.modifyId ? '短信小组编辑' : '短信小组录入';
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
              name, description, state,
            } = res.data;
            const employeeListName = [];
            this.selectedRowKeys = [];

            this.form.setFieldsValue({
              name: String(name),
              description: description ? String(description) : 'undefined',
              state: String(state),
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
              name: String(values.name),
              description: String(values.description),
              state: window.parseInt('0'),
              employeeIds: this.selectedRowKeys,
            });
            if (res) {
              this.$message.success('添加成功');
              this.$emit('successCallback');
            }
            this.addLoading = false;
          });
        }
      });
    },
    staffSelect() {
      this.selectStaffVisible = true;
    },

  },
};
</script>

<style scoped>
</style>
