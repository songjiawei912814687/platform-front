<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="320"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='权力名称'
                                fieldDecoratorId="qlName"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入权力名称!'},{ max: 55, message: '最多55个字符!' }]}">
                            <a-input placeholder='请输入权力名称' :disabled="true"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='权力编号'
                                fieldDecoratorId="qlFullId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入权力编号!'},{ max: 55, message: '最多55个字符!' }]}">
                            <a-input placeholder='请输入权力编号' :disabled="true"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='权力内部编码'
                                fieldDecoratorId="qlInnerCode"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入权力编号!'},{ max: 55, message: '最多55个字符!' }]}">
                            <a-input placeholder='请输入权力编号' :disabled="true"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" >
                        <a-form-item
                                label='网上申请方式'
                                fieldDecoratorId="onlineApplication"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入网上申请方式!'}]}">
                            <a-text-area placeholder='请输入网上申请方式'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" >
                        <a-form-item
                                label='窗口申请方式'
                                fieldDecoratorId="windowApplication"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入窗口申请方式!'}]}">
                            <a-text-area placeholder='请输入窗口申请方式'/>
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
    import {autoDoFn} from '@/utils/util';
    import {formPost, getDetail} from '@/remote/power';

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
        props: ['addVisible', 'handleClose', 'modifyId'],
        data() {
            return {
                applyType: '',
                addLoading: false,
                options: [
                    {label: '承诺件', value: '0'},
                    {label: '即办件', value: '1'},
                    {label: '其他', value: '2'},
                ],

            };
        },
        computed: {
            title() {
                return this.modifyId ? '权力事项编辑' : '权力事项录入';
            },
        },
        watch: {
            addVisible() {
                if (this.modifyId) {
                    autoDoFn(async () => {
                        this.addLoading = true;
                        const res = await getDetail({id: this.modifyId});
                        if (res) {
                            this.applyType = res.data.applyType
                            const {
                                qlName,
                                qlFullId,
                                qlInnerCode,
                              onlineApplication,
                              windowApplication,
                            } = res.data;
                            this.form.setFieldsValue({
                                qlName,
                                qlFullId,
                                qlInnerCode,
                              onlineApplication,
                              windowApplication,
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
                              applyType: this.applyType,
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
