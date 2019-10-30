<template>
    <div>
        <h1>录音demo</h1>

        <a-spin tip="正在加载中..." style="margin-top: 250px" :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}"
                    class="staff-add-form">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='语音输入框'
                                fieldDecoratorId="title"
                                >
                            <a-input placeholder='请输入名称'/>
                            <a-button onclick="startRecording()">语音输入</a-button>
                            <a-button @click="auditOk()">完成</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
    </div>

</template>

<script>
    import {
        Row,
        Col,
        Input,
        Button,
        Form,
        Select,
        Modal,
        Spin,
        TreeSelect,
        Upload,
        Icon,
        DatePicker,
    } from 'ant-design-vue'
    import {autoDoFn} from '@/utils/util';
    import {formPost, getDetail} from '@/remote/myStaff';
    import StaffModal from '@/components/StaffModal/StaffModal';

    const {Item} = Form;
    const {Option} = Select;
    const {TextArea} = Input;
    export default {
        name: "index",
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
            StaffModal
        },
        data() {
            return {
                imageUrl: '',
                addVisible: true,
                addLoading: false,
                approverType: '',
                selectedRowKeys: [],
                selection: {},
                title: '',
                organizationId: '',
                isOne: 0
            }
        },
        props: ['handleClose', 'modifyId', 'orgTreeData', 'jobList'],
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
                            if (res.data.userId) {
                                this.selection.id = res.data.userId
                            }
                            const {
                                title, context, isOne, roleId, organId,
                                jobId
                            } = res.data;
                            this.form.setFieldsValue({
                                context: context !== undefined ? context : '',
                                isOne: isOne !== undefined ? String(isOne) : '',
                                title: title !== undefined ? title : '',
                                jobId: jobId !== undefined ? String(jobId) : '',
                                roleId: roleId !== undefined ? String(roleId) : '',

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
                    if (err) {
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

            isOneChange(value) {
                this.isOne = value
            },

            handleUpdateData(name, value) {
                this[name] = value;
            },


            handleCancel() {
                this.$emit('cancel');
            },
            handleOk(e) {
                this.handleSubmit(e);

            },
            auditOk() {
                const text = uploadAudio();
                this.form.setFieldsValue({
                    title: text === undefined ? '' : text
                })
            }

        },

    }
</script>

<style scoped>

</style>
