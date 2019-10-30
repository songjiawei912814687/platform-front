<template>
    <a-modal :visible="leaveVisible"
             @cancel="handleCancel"
              :destroyOnClose="true"
              :maskClosable="false"
              :loading="addLoading"
              :width="500"
              title="人员离职">
        <a-form @submit="handleSubmit" :autoFormCreate="(form)=>{this.form = form}" class="form">
            <a-row>

                <a-col :span="24 ">
                    <div class="form__item">
                        <p class="form__label">离职原因</p>
                        <a-form-item fieldDecoratorId="reason">
                            <a-text-area placeholder='请输入离职原因' style="height: 150px"/>
                        </a-form-item>
                    </div>
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
                                  :data= {resourceType:5}
                                  :fileList="fileList"
                                  :beforeUpload="beforeUpload"
                                  @change="handleChange"
                        >
                            <a-button>选择文件</a-button>
                        </a-upload>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div slot="footer">
            <a-button @click="handleClose">取消</a-button>
            <a-button @click="handleSubmit" type="primary">保存</a-button>
        </div>
    </a-modal>
</template>

<script>
import { Row, Col, Input, Button, Table, Form, Select, DatePicker, Upload, Icon, Modal } from 'ant-design-vue';
import { formPost } from '@/remote/dimission';
import { autoDoFn } from '@/utils/util';
const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
  name: 'Leave',
  components: {
    AInput: Input,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    ATable: Table,
    AForm: Form,
    AFormItem: Item,
    ASelect: Select,
    ASelectOption: Option,
    ADatePicker: DatePicker,
    AUpload: Upload,
    AIcon: Icon,
    ATextArea: TextArea,
    AModal: Modal,
  },
  props: ['title', 'modifyId', 'rowData', 'leaveVisible', 'handleClose'],
  data() {
    return {
        fileList: [],
        addLoading: false,
        uploadLoading: false,
    };
  },
  methods: {

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
            autoDoFn(async () => {
                this.addLoading = true;
                console.log(this.fileList);
                const res = await formPost(this.modifyId, {
                    ...values,
                    employeeId: this.modifyId,
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
      handleCancel(){
          this.$emit('cancel');
      }
  },
};
</script>

<style scoped>

</style>
