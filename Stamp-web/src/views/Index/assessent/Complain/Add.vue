<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="450"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible"
                    @submit="handleSubmit"
                    layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}">
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item
                            label='申诉原因'
                            fieldDecoratorId="representationReason"
                            :fieldDecoratorOptions="{
                            rules: [{ required: true, message: '请输入申诉原因!'},
                            {max:255,message:'申诉原因最多255个字符'}]}">
                        <a-text-area placeholder='请输入申诉原因' style="height: 150px"/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='附件'
                            fieldDecoratorId="attachmentList"
                            :fieldDecoratorOptions="{
                            rules:[{ required: false, message: '请上传附件!'}]}">
                        <a-upload name="file"
                                  :multiple="true"
                                  :showUploadList="true"
                                  action="/upload"
                                  :fileList="fileList"
                                  :data="{resourceType:configType}"
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
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
        </div>
    </Drawer>
</template>

<script>
import { Row, Col, Input, Button, Form, Select,  Drawer, Spin, Upload } from 'ant-design-vue';
import { getDetail, formPost } from '@/remote/complain';
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
    ASelect: Select,
    ASelectOption: Option,
    AFormItem: Item,
    ATextArea: TextArea,
    ADrawer: Drawer,
    ASpin: Spin,
    AUpload: Upload,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'planId'],
  data() {
    return {
      addLoading: false,
      configType: '',
      fileList: [],
      appraisalRecordId:'',
    };
  },
  computed: {
    title() {
      return (this.modifyId && !this.planId) ? '考核记录申诉编辑' : '考核记录申诉录入';
    },
  },
  created() {
    this.addLoading = false;
  },
  watch: {
    addVisible() {
      if (this.modifyId && this.addVisible && !this.planId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res.success) {
            const {
              attachmentList, description,appraisalRecordId
            } = res.data;
            this.appraisalRecordId = appraisalRecordId;
            this.fileList = attachmentList ? attachmentList.map(item => ({
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
                  },
                ],
              },
            })) : [];
            this.form.setFieldsValue({
              representationReason: description,
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
            let res;
            if(this.planId){
              res = await formPost({
                id:'',
                appraisalRecordId: this.planId,
                description: values.representationReason,
                attachmentList: this.fileList.map(item => ({
                  attachmentSize: item.response.data[0].fileSize, // 必填  文件长度  int
                  fileName: item.response.data[0].fileName, // 必填  文件名 string
                  suffix: item.response.data[0].suffixName, // 必填 后缀名 string
                  url: item.response.data[0].filePath.indexOf('uploadFile') > -1 ?
                    `${item.response.data[0].filePath}` :
                    `/uploadFile${item.response.data[0].filePath}`,
                })),
              });
            }else{
              if (this.modifyId) {
                res = await formPost({
                  id:this.modifyId,
                  description: values.representationReason,
                  appraisalRecordId: this.appraisalRecordId,
                  attachmentList: this.fileList.map(item => ({
                    attachmentSize: item.response.data[0].fileSize, // 必填  文件长度  int
                    fileName: item.response.data[0].fileName, // 必填  文件名 string
                    suffix: item.response.data[0].suffixName, // 必填 后缀名 string
                    url: item.response.data[0].filePath.indexOf('uploadFile') > -1 ?
                      `${item.response.data[0].filePath}` :
                      `/uploadFile${item.response.data[0].filePath}`,
                  })),
                });
              }
            }
						console.log('33333'+res)
            if (res.success) {
              this.$message.success('操作成功');
              this.$emit('successCallback');
            }
            this.addLoading = false;
          });
        }
      });
    },
    // 文件上传
    handleChange(info) {
      const fileList = info.fileList.map((file) => {
        const item = Object.assign({}, file);
        if (file.response) {
          item.url = file.response.url;
        }
        return item;
      }).filter((file) => {
        if (file.response) {
          if (file.response.code !== 0) {
            this.$message.error(`${file.name}上传失败!`);
          }
          return file.response.code === 0;
        }
        return true;
      });
      this.fileList = fileList;
    },
    beforeUpload() {
      return true;
    },
  },

};
</script>

<style scoped>

</style>
