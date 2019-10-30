<template>
    <Drawer v-model="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="320"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}"
                    class="staff-add-form">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='组织机构'
                                fieldDecoratorId="organizationId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择组织机构!' }]}"
                        >
                            <a-tree-select
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="orgTreeData"
                                    placeholder='请选择现组织机构'
                                    showSearch
                                    treeNodeFilterProp="title"
                                    treeDefaultExpandAll
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='用户名'
                                fieldDecoratorId="username"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入用户名!' },{ max: 25, message: '长度不大于25!' }]}"
                        >
                            <a-input placeholder='请输入用户名'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" v-if="modifyId <= 0">
                        <a-form-item
                                label='密码'
                                fieldDecoratorId="password"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码!' },{ max: 25, message: '长度不大于25!' }]}"
                        >
                            <a-input placeholder='请输入密码' type="password"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" v-if="modifyId <= 0">
                        <a-form-item
                                label='核对密码'
                                fieldDecoratorId="repassword"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请再次输入密码!' },{ max: 25, message: '长度不大于25!' }]}"
                        >
                            <a-input placeholder='请再次输入密码' type="password"/>
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
  import {formPost, getDetail} from '@/remote/system-user';
  import {autoDoFn} from '@/utils/util';

  const {Item} = Form;
  const {Option} = Select;
  const {TextArea} = Input;


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
    props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'staffList', 'roleList'],
    data() {
      return {
        addLoading: false,
        uploadLoading: false,
      };
    },
    computed: {
      title() {
        return this.modifyId ? '用户编辑' : '用户录入';
      },
    },
    watch: {
      addVisible() {
        if (this.modifyId) {
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await getDetail({id: this.modifyId});
            if (res) {
              const {
                organizationId, username, password, userType
              } = res.data;
              this.form.setFieldsValue({
                organizationId: String(organizationId),
                username,
                password,
                userType: String(userType),
              });
            }
            this.addLoading = false;
          });
        }
      },
    },
    methods: {
        handleSubmit(e){
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
