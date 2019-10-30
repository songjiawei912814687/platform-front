<template>
    <a-modal
            title="新增"
            :visible="addVisible"
            @cancel="handleCancel"
            @ok="handleOk"
            okText="保存"
            :width="1200">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}"
                    class="staff-add-form">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='标题'
                                fieldDecoratorId="title"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入用户名称!'},{ max: 55, message: '最多55个字符!' }]}">
                            <a-input placeholder='请输入名称'/>
                        </a-form-item>
                    </a-col>




                    <a-col :span="24">
                        <a-form-item
                                label='描述'
                                fieldDecoratorId="discription"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入描述!'},{max:255,message:'最多105个字符！'}]}">
                            <a-text-area placeholder='请输入描述' style="height: 150px"/>
                        </a-form-item>
                    </a-col>


                    <a-col :span="24 ">
                        <a-form-item
                                label='附件'
                                fieldDecoratorId="attachmentList"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请上传附件!'}]}">
                            <a-upload name="file"
                                      :multiple="true"
                                      :showUploadList="true"
                                      action="/upload"
                                      :fileList="fileList"
                                      :data="{resourceType:6}"
                                      :beforeUpload="beforeUpload"
                                      @change="handleChange"
                            >
                                <a-button>选择文件</a-button>
                            </a-upload>
                        </a-form-item>
                    </a-col>



                </a-row>
            </a-form>
        </a-spin>


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
        Modal,
        Spin,
        TreeSelect,
        Upload,
        Icon,
        DatePicker,
    }  from 'ant-design-vue'
    import { autoDoFn } from '@/utils/util';
    import { formPost, getDetail } from '@/remote/download';
    import StaffModal from '@/components/StaffModal/StaffModal';

    const { Item } = Form;
    const { Option } = Select;
    const { TextArea } = Input;
    export default {
        name: "stepsAdd",
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
                fileList: [],
                addLoading: false,
                uploadLoading: false,
                approverType:'',
                selectedRowKeys: [],
                selection: {},
                organizationId:'',
                isOne:0
            }
        },
        props: ['addVisible', 'handleClose', 'modifyId'],
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
                        const res = await getDetail({ id: this.modifyId });
                        if (res) {

                            const {
                                title, discription,attachmentOuputList
                            } = res.data;
                            this.fileList = attachmentOuputList.map(item => ({
                                uid: item.url,
                                name: item.fileName,
                                response: {
                                    code: 0,
                                    data: [
                                        {
                                            fileName: item.fileName,
                                            filePath: item.url,
                                            fileSize: item.attachmentSize,
                                            suffixName: item.suffix,
                                        }
                                    ],
                                }
                            }));
                            this.form.setFieldsValue({

                                discription:discription !== undefined ? discription : '' ,
                                title: title !== undefined ? title : '',
                            });
                        }
                        this.addLoading = false;
                    });
                    debugger
                }
            },
        },
        methods: {

            handleSubmit(e) {
                debugger
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    debugger
                    if (!err) {
                        debugger
                        autoDoFn(async () => {
                            this.addLoading = true;
                            const res = await formPost(this.modifyId, {
                                ...values,
                                attachmentList: this.fileList.map(item => ({
                                    "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
                                    "fileName": item.response.data[0].fileName,//必填  文件名 string
                                    "suffix": item.response.data[0].suffixName,//必填 后缀名 string
                                    "url": '/uploadFile' + item.response.data[0].filePath//必填  附件路径 string
                                }))
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
            handleChange(info){
                let fileList = info.fileList;
                fileList = fileList.map((file) => {
                    if (file.response) {
                        file.url = file.response.url;
                    }
                    return file;
                });
                fileList = fileList.filter((file) => {
                    if (file.response) {
                        if(file.response.code !== 0){
                            this.$message.error(file.name + '上传失败!');
                        }
                        return file.response.code === 0;
                    }
                    return true;
                });
                this.fileList = fileList;
            },

            beforeUpload(file){
                const arr = file.name.split('.');
                return true;
            },

            isOneChange(value){
                this.isOne = value
            },

            handleUpdateData(name, value) {
                this[name] = value;
            },


            handleCancel() {
                this.$emit('cancel');
            },
            handleOk(e) {
                debugger
                this.handleSubmit(e);
            },

        },

    }
</script>

<style scoped>

</style>
