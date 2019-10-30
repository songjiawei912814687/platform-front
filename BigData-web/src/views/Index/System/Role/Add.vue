<template>
    <Drawer v-model="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="320"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}"
                    class="staff-add-form">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='角色名称'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入用户名称!'},{ max: 55, message: '最多55个字符!' }]}">
                            <a-input placeholder='请输入用户名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='是否开启默认权限'
                                fieldDecoratorId="defaultPermissions"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否开启!' }]}"
                        >
                            <a-select placeholder='请选择'>
                                <a-select-option value='1'>开启</a-select-option>
                                <a-select-option value='0'>关闭</a-select-option>
                            </a-select>
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
    Upload,
    Icon,
    DatePicker,
  } from 'ant-design-vue';
  import { formPost, getDetail } from '@/remote/system-role';
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
      AUpload: Upload,
      AIcon: Icon,
      ADatePicker: DatePicker,
    },
    props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'staffList', 'roleList', 'windowList'],
    data() {
      return {
        addLoading: false,
        uploadLoading: false,
        imageUrl: '',
        configType: '',
        windowState: '',
      };
    },
    computed: {
      title() {
        return this.modifyId ? '角色编辑' : '角色录入';
      },
    },
    watch: {
      addVisible() {
        this.imageUrl = '';
        if (this.modifyId) {
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await getDetail({ id: this.modifyId });
            if (res) {
              const {
                name, description, defaultPermissions
              } = res.data;
              this.form.setFieldsValue({
                defaultPermissions: defaultPermissions === undefined ? '0' : String(defaultPermissions),
                description,
                name,
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
      }
    },
  };
</script>

<style lang="less">

</style>
