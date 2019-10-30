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
                                label='规则配置名称'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入规则配置名称!' },{ max: 255, message: '最多255个字符!' }]}"
                        >
                            <a-input placeholder='请输入规则配置名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='规则配置描述'
                                fieldDecoratorId="description"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入规则配置描述!' },{ max: 255, message: '最多255个字符!' }]}"
                        >
                            <a-input placeholder='请输入规则配置描述'/>
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
    import {Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, DatePicker} from 'ant-design-vue';
    import {formPost, getDetail} from '@/remote/attendanceRuleConfig';
    import {autoDoFn} from '@/utils/util';

    const {Item} = Form;
    const {Option} = Select;
    const {TextArea} = Input;

    export default {
        name: 'AddConfig',
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
            };
        },
        computed: {
            title() {
                return this.modifyId ? '考勤规则配置编辑' : '考勤规则配置录入';
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
                                name,
                                description,
                            } = res.data;
                            this.form.setFieldsValue({
                                description,
                                name
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

<style scoped>

</style>
