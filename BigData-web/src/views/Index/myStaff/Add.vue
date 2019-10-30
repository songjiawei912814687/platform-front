<template>
    <a-modal
            title="新增"
            :visible="addVisible"
            @cancel="handleCancel"
            @ok="handleOk"
            okText="保存"
            :width="1200"
            destroyOnClose=true>
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}"
                    class="staff-add-form">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='标题'
                                fieldDecoratorId="title"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入用户名称!'},{ max: 55, message: '最多55个字符!' }]}">
                            <a-input placeholder='请输入名称'/>
                            <!--<a-button onclick="startRecording()">语音输入</a-button>-->
                            <!--<a-button @click="auditOk()">完成</a-button>-->
                        </a-form-item>
                    </a-col>

                    <a-col :span="24" style="margin-top: 30px">
                        <a-form-item
                                label='类型'
                                fieldDecoratorId="type"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择新闻类型!' }]}"
                        >
                            <a-select placeholder='请选择'
                                      :value="type"
                            >
                                <a-select-option value='1'>公告</a-select-option>
                                <a-select-option value='3'>新闻</a-select-option>
                                <a-select-option value='5'>其他</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item
                                label='正文'
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入内容!'}]}">
                            <quill-editor
                                    style="min-height: 30vh;height: auto;"
                                    v-model="content"
                                    ref="myQuillEditor"
                                    :options="editorOption"
                                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                                    @change="onEditorChange($event)"
                            ></quill-editor>
                        </a-form-item>
                    </a-col>


                    <a-col :span="24" style="margin-top: 30px">
                        <a-form-item
                                label='发布范围'
                                fieldDecoratorId="isOne"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择发布范围!' }]}"
                        >
                            <a-select placeholder='请选择'
                                      :value="isOne"
                                      @change="isOneChange">
                                <a-select-option value='1'>是</a-select-option>
                                <a-select-option value='3'>否</a-select-option>
                            </a-select>

                        </a-form-item>

                    </a-col>

                    <a-col :span="24" v-show="isOne==='1'">
                        <a-form-item
                                label='组织机构'
                                fieldDecoratorId="organId"
                                :fieldDecoratorOptions="{rules: [{ required: isOne === '1', message: '请选择机构!' }]}"
                        >
                            <a-tree-select
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="orgTreeData"
                                    :allowClear="true"
                                    placeholder='请选择所属机构'
                                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                                    treeDefaultExpandAll
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" v-show="isOne==='1'">
                        <a-form-item
                                label='角色'
                                fieldDecoratorId="jobId"
                        >
                            <a-select placeholder='请选择角色'
                                      :allowClear="true"
                            >
                                <a-select-option v-for="item in jobList"
                                                 :getPopupContainer="triggerNode => triggerNode.parentNode"
                                                 :value='String(item.id)' :key="item.id">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>


                </a-row>
            </a-form>

            <a-upload
                    name="file"
                    listType="picture-card"
                    class="avatar-uploader"
                    :showUploadList="false"
                    :data="{resourceType:1}"
                    action="/upload"
                    :beforeUpload="beforeUpload"
                    @change="handleChange"
                    :style="{width: '125px', height: '125px'}"
            />

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
        message
    } from 'ant-design-vue';
    import {autoDoFn} from '@/utils/util';
    import {formPost, getDetail, uploadImg} from '@/remote/myStaff';
    import StaffModal from '@/components/StaffModal/StaffModal';
    import {quillEditor} from 'vue-quill-editor';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';

    const {Item} = Form;
    const {Option} = Select;
    const {TextArea} = Input;

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
        ['link', 'image'],
        ['clean']                                         // remove formatting button
    ]


    export default {
        name: 'stepsAdd',
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
            StaffModal,
            quillEditor,
            message
        },
        data() {
            return {
                imageUrl: '',
                addLoading: false,
                approverType: '',
                selectedRowKeys: [],
                selection: {},
                title: '',
                organizationId: '',
                isOne: '',
                content: null,
                uploadUrl: window.defaultConfig.uploadUrl,
                editorOption: {
                    modules: {
                        toolbar: {
                            container: toolbarOptions,  // 工具栏
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        document.querySelector('.avatar-uploader input').click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                }
            };
        },
        props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'jobList'],
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
                                this.selection.id = res.data.userId;
                            }
                            const {
                                title, context, isOne, organId,
                                jobId, type
                            } = res.data;
                            this.isOne = String(isOne);
                            this.content = context;
                            this.form.setFieldsValue({
                                context: context !== undefined ? context : '',
                                isOne: isOne !== undefined ? String(isOne) : '',
                                title: title !== undefined ? title : '',
                                jobId: jobId !== undefined ? String(jobId) : '',
                                organId: organId !== undefined ? String(organId) : '',
                                type: type !== undefined ? String(type) : '5',
                            });
                        }
                        this.addLoading = false;
                    });
                } else {
                    this.content = ''
                }
            },
        },

        methods: {


            beforeUpload(file) {
                const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isImg) {
                    this.$message.error('请上传.jpg或者.png格式的图片');
                }
                const arr = file.name.split('.');
                const isLt500K = file.size / 1024 < 500;
                if (!isLt500K) {
                    this.$message.error('图片最小大小为500k!');
                }
                return isImg && isLt500K;
            },
            handleChange(info) {
                console.log("info1"+info.file.status)
                if (info.file.status === 'uploading') {
                    this.addLoading = true;
                    return;
                }
                if (info.file.status === 'done') {

                    if (info.file.response.code === 0) {
                        let quill = this.$refs.myQuillEditor.quill
                        let imageUrl = this.uploadUrl+ `/uploadFile${info.file.response.data[0].filePath}`;
                        quill.insertEmbed(length, 'image', imageUrl)
                        // 调整光标到最后
                        quill.setSelection(length + 1)
                        console.log("info"+info)

                    }else {
                        message.error("插入图片失败")
                    }
                    this.addLoading = false;
                }
            },

            handleSubmit(e) {
                e.preventDefault();
                debugger;
                this.form.validateFields((err, values) => {
                    debugger;
                    debugger;
                    autoDoFn(async () => {
                        this.addLoading = true;
                        const res = await formPost(this.modifyId, {
                            context: this.content,
                            ...values,
                        });
                        if (res) {
                            this.$message.success('操作成功');
                            this.$emit('successCallback');
                        }
                        this.addLoading = false;
                    });
                });
            },

            isOneChange(value) {
                this.form.setFieldsValue({
                    jobId: '',
                    organId: ''
                });
                this.isOne = value;


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
                });
            }

        },

    };
</script>

<style lang="less" scoped>

</style>
