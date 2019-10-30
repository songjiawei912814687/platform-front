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
                                label='名称'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入用户名称!'},{ max: 55, message: '最多55个字符!' }]}">
                            <a-input placeholder='请输入名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='审批类型'
                                fieldDecoratorId="approvalType"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择审批类型!' }]}"
                        >
                            <a-select placeholder='请选择审批类型'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode">
                                <!--<a-select-option value='0'>用户账号</a-select-option>-->
                                <a-select-option value='1'>请假申请</a-select-option>
                                <a-select-option value='3'>加班申请</a-select-option>
                                <a-select-option value='5'>会议室申请</a-select-option>
                                <a-select-option value='7'>人员入职申请</a-select-option>
                                <a-select-option value='9'>人员离职申请</a-select-option>
                                <a-select-option value='11'>考核申诉</a-select-option>
                                <a-select-option value='13'>岗位调动</a-select-option>
                                <a-select-option value='15'>人员调休</a-select-option>
                                <a-select-option value='17'>员工加减分记录</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='人员类型'
                                fieldDecoratorId="approvalConfigType"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择人员编制!' }]}"
                        >
                            <a-select placeholder='请选择人员类型'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode">
                                <!--<a-select-option value='0'>用户账号</a-select-option>-->
                                <a-select-option value='1'>窗口</a-select-option>
                                <a-select-option value='0'>后台</a-select-option>
                                <a-select-option value='2'>行政</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='组织机构'
                                fieldDecoratorId="organId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择组织机构!' }]}"
                        >
                            <a-tree-select
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="orgTreeData"
                                    placeholder='请选择现组织机构'
                                    treeDefaultExpandAll
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='描述'
                                fieldDecoratorId="description"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入描述!'},{max:255,message:'最多105个字符！'}]}">
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
    } from 'ant-design-vue'
    import {autoDoFn} from '@/utils/util';
    import {formPost, getDetail} from '@/remote/approval';

    const {Item} = Form;
    const {Option} = Select;
    const {TextArea} = Input;
    export default {
        name: "add",
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
        props: ['addVisible', 'handleClose', 'modifyId','orgTreeData'],
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
                return this.modifyId ? '编辑' : '录入';
            },
        },
        watch: {
            addVisible() {
                this.imageUrl = '';
                if (this.modifyId) {
                    autoDoFn(async () => {
                        this.addLoading = true;
                        const res = await getDetail({id: this.modifyId});
                        if (res) {
                            const {
                                name, description, approvalType, approvalConfigType,organId
                            } = res.data;
                            this.form.setFieldsValue({
                                description,
                                name,
                                approvalType: String(approvalType),
                                approvalConfigType: String(approvalConfigType),
                                organId: String(organId)
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
    }
</script>

<style scoped>

</style>
