<template>
    <Drawer v-model="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="350"
            :title="title">
        <a-spin v-if="addVisible" tip="正在加载中..." :spinning="addLoading">
            <a-form @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='姓名'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入姓名!' },{ max: 55, message: '最多55个字符!' }]}"
                        >
                            <a-input placeholder='请输入姓名'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='性别'
                                fieldDecoratorId="sex"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择性别!' }]}"
                        >
                            <a-select placeholder='请选择性别'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode">
                                <a-select-option value='0'>男</a-select-option>
                                <a-select-option value='1'>女</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='手机号码'
                                fieldDecoratorId="phoneNumber"
                                :fieldDecoratorOptions="{
                                rules: [
                                { required: true, message: '请输入手机号码!' },
                                { pattern: /^1\d{10}$/, message: '请输入正确手机号码!' },
                                ]}"
                        >
                            <a-input placeholder='请输入手机号码'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='车牌号'
                                fieldDecoratorId="plateNoList"
                                :fieldDecoratorOptions="{rules: []}"
                        >
                            <a-select
                                    mode="tags"
                                    style="width: 100%"
                                    @change="handleselectChange"
                                    placeholder="请输入您的车牌号，按回车键确认"
                            >
                                <a-select-option v-for="i in 0" :key="(i + 9).toString(36) + i">{{(i + 9).toString(36) + i}}</a-select-option>
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
    import { formPost, getDetail } from '@/remote/address';
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
        },
        props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData'],
        data() {
            return {
                addLoading: false,
            };
        },
        computed: {
            title() {
                return this.modifyId ? '通讯录编辑' : '通讯录录入';
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
                                name, sex, phoneNumber, plateNo,
                            } = res.data;
                            this.form.setFieldsValue({
                                sex:String(sex),
                                phoneNumber:phoneNumber,
                                name:name,
                                plateNoList: plateNo === undefined || plateNo === '' ? undefined : plateNo.split(','),
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
