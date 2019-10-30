<template>
    <a-modal v-model="actionAddVisible"
            @cancel="handleCancel"
             @ok="handleOk"
            :width="320"
             okText="保存"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="actionAddVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}"
                    class="staff-add-form">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='名称'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入用户名称!'},{ max: 55, message: '最多55个字符!' }]}">
                            <a-input placeholder='请输入用户名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='编码'
                                fieldDecoratorId="code"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入用户名称!'}]}">
                            <a-input placeholder='请输入用户名称'/>
                        </a-form-item>
                    </a-col>


                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
        </div>
    </a-modal>
</template>

<script>
    import {
        Row,
        Col,
        Input,
        Button,
        Form,
        Select,
        Spin,
        TreeSelect,
        Upload,
        Icon,
        DatePicker,
        Modal
    } from 'ant-design-vue';
    import { formPost, getDetail } from '@/remote/action';
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
            AModal: Modal,
            ASpin: Spin,
            ATreeSelect: TreeSelect,
            AUpload: Upload,
            AIcon: Icon,
            ADatePicker: DatePicker,
        },
        props: ['actionAddVisible', 'handleClose', 'menuId','modifyId'],
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
            actionAddVisible() {
                this.imageUrl = '';
                if (this.modifyId) {
                    autoDoFn(async () => {
                        this.addLoading = true;
                        const res = await getDetail({ id: this.modifyId });
                        if (res) {
                            const {
                                name,code
                            } = res.data;
                            this.form.setFieldsValue({
                                code,
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
                                menuId: this.menuId,
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
            handleCancel(){
                this.$emit('cancel');
            },
            handleOk(e){
                this.handleSubmit(e);
                this.$emit('cancel');
            }
        },
    };
</script>

<style lang="less">

</style>
