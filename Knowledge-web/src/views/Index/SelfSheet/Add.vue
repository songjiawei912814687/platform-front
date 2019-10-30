<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
              :maskClosable="false"
              :width="320"
              :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='名称'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入表单名称!'}]}">
                            <a-input placeholder='请输入表单名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='地址'
                                fieldDecoratorId="url"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入地址!'}]}">
                            <a-input placeholder='请输入地址'/>
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
  Checkbox,
  Drawer,
  Spin,
  TreeSelect,
  Upload,
  Icon,
  DatePicker,
} from 'ant-design-vue';
import { autoDoFn } from '@/utils/util';
import StaffModal from '@/components/StaffModal/StaffModal';
import { getDetail, formPost } from '@/remote/selfSheet';
import moment from 'moment';
const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
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
    ACheckbox: Checkbox,
    ACheckboxGroup: CheckboxGroup,
    StaffModal,
  },
  props: ['addVisible', 'handleClose', 'modifyId'],
  data() {
    return {
      addLoading: false,
    };
  },
  computed: {
    title() {
      return this.modifyId ? '自助表单编辑' : '自助表单录入';
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
              name, url, display, type,amputated,createdDateTime,createdUserId,
                createdUserName,lastUpdateDateTime,lastUpdateUserId,lastUpdateUserName
            } = res.data;
            this.form.setFieldsValue({
              name, url, display,type,amputated,createdUserId,createdUserName,
                lastUpdateUserId,lastUpdateUserName,
                createdDateTime:moment(createdDateTime),
                lastUpdateDateTime:moment(lastUpdateDateTime)
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
  }
};
</script>

<style lang="less">

</style>
