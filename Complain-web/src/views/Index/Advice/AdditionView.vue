<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="320"
              title="附件">
        <a-upload action="/upload"
                    name="file"
                    :data="{resourceType:10}"
                    :multiple="false"
                    :showUploadList="false"
                    :fileList="fileList"
                    @remove="handleRemoveUpload"
                    @change="handleUploadChange"
        >
        <a-button>上传</a-button>
        </a-upload>
        <a-form-item style="margin-bottom: 0px;" v-for="file in attachmentList">
                <i class="anticon anticon-paper-clip"></i>
                <a style="color:rgba(0, 0, 0, 0.65);"  :href="file.url" target="_blank" >
                {{file.fileName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 </a>
                 <span @click="removeAtt(file)">x</span>
            </a-form-item>
        <div class="drawer-footer">
            <a-button @click="handleClose">关闭</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading" >保存</a-button>
        </div>
    </a-drawer>
</template>

<script>
import  { Row, Col, Button, Form, Drawer, Spin,Upload } from 'ant-design-vue';
import { autoDoFn } from '@/utils/util';
import { saveAddtition,getAddition } from '@/remote/advice';
const { Item } = Form;
    export default {
        name: "detailView",
        components: {
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AForm: Form,
            AFormItem: Item,
            ASelectOption: Option,
            ADrawer: Drawer,
            ASpin: Spin,
            AUpload:Upload,
        },
        props: ['viewVisible', 'handleClose', 'modifyId',],
        data() {
            return {
                addLoading:false,
                viewData: {},
                fileList: [],
                attachmentList:[],
                viewLoading: false,
                data:[],
            };
        },
        watch: {
            viewVisible() {
                if (this.modifyId) {
                    autoDoFn(async () => {
                        this.viewLoading = true;
                        const res = await getAddition({ planItemId: this.modifyId });
                        if (res) {
                            this.attachmentList = res.data;
                        }
                        this.viewLoading = false;
                    });
                }
            },
        },
        methods:{
                    // 文件上传(示例表)
            handleRemoveUpload(res, file, fileList) {
                this.fileList = fileList;
            },
            removeAtt(file) {
                this.attachmentList = this.attachmentList.filter(t => t.url != file.url)
            },
            handleUploadChange(info) {
                let fileList = info.fileList;
                fileList = fileList.map((file) => {
                if (file.response) {
                    file.url = file.response.url;
                }
                return file;
                });
                fileList = fileList.filter((file) => {
                if (file.response) {
                    if (file.response.code !== 0) {
                    this.$message.error(file.name + file.response.data[0].message);
                    }
                    return file.response.code === 0;
                }
                return true;
                });
                this.fileList = fileList;
                fileList = fileList.slice(-1);
                this.attachmentList.push({fileName:fileList[0].response.data[0].fileName,url:fileList[0].response.data[0].filePath !== undefined && fileList[0].response.data[0].filePath.indexOf('uploadFile') > -1 ?
                    `${fileList[0].response.data[0].filePath}` :`/uploadFile${fileList[0].response.data[0].filePath}`});
            },
            handleSubmit(e) {
                e.preventDefault();
                autoDoFn(async () => {
                this.addLoading = true;
                console.log("this.modifyId:"+this.modifyId)
                    console.log("this.attachmentList:"+this.attachmentList)
                const res = await saveAddtition(this.modifyId, {
                    list: this.attachmentList,
                });
                if (res) {
                    this.$message.success('操作成功');
                    this.$emit('successCallback');
                }
                this.addLoading = false;
                });
            },
        },
    }
</script>

<style scoped>

</style>
