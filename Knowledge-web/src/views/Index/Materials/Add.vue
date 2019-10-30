<template>
    <Drawer :value="addVisible"
              @close="handleClose"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label='材料名称'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入材料名称!'}]}">
                            <a-input placeholder='请输入材料名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='材料详细要求'
                                fieldDecoratorId="requestDetail"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入材料详细要求!'}]}">
                            <a-input placeholder='请输入材料详细要求'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='材料形式'
                                fieldDecoratorId="materialForm"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入材料名称!'}]}">
                            <a-checkbox-group :options="options" @change="onChange"></a-checkbox-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='必要性及描述'
                                fieldDecoratorId="necessarilyDescription"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入必要性及描述!'}]}">
                            <a-input placeholder='请输入必要性及描述'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='材料出具单位'
                                fieldDecoratorId="meteriaOrganization"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入情况分类!'}]}">
                            <a-input placeholder='请输入情况分类'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='备注'
                                fieldDecoratorId="remark"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入备注!'}]}">
                            <a-text-area style="height: 100px"></a-text-area>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item class="uploads"
                                label='示例表'
                                fieldDecoratorId="fileList"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请上传示例表!'}]}">
                            <a-upload action="/upload"
                                      name="file"
                                      :data="{resourceType:9}"
                                      :multiple="false"
                                      :fileList="fileList"
                                      @remove="handleRemoveUpload"
                                      @change="handleUploadChange">
                                <a-button>上传</a-button>
                            </a-upload>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item class="uploads"
                                     label='空白表'
                                     fieldDecoratorId="fileList1"
                                     :fieldDecoratorOptions="{rules: [{ required: true, message: '请上传示例表!'}]}">
                            <a-upload action="/upload"
                                      name="file"
                                      :data="{resourceType:10}"
                                      :multiple="false"
                                      :fileList="fileList1"
                                      @remove="handleRemoveUpload1"
                                      @change="handleUploadChange1"
                            >
                                <a-button>上传</a-button>
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
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Select,
  Checkbox,
  Drawer,
  Spin,
  TreeSelect,
  Upload,
  Icon,
  DatePicker,
} from 'ant-design-vue';
import { autoDoFn } from '@/utils/util';
import StaffModal from '@/components/StaffModal/StaffModal';
import { getDetail, formPost } from '@/remote/materials';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
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
    ACheckbox: Checkbox,
    ACheckboxGroup: CheckboxGroup,
    StaffModal,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'grainId','orgId'],
  data() {
    return {
      addLoading: false,
      blankAttachmentList: [],
      exampleAttachmentList: [],
      configType: '',
      fileList: [],
      fileList1: [],
      options: [{ label: '原件', value: '1' }, { label: '复印件', value: '3' }],
      checkedList: [],
    };
  },
  computed: {
    title() {
      return this.modifyId ? '材料清单编辑' : '材料清单录入';
    },
  },
  watch: {
    addVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
              this.blankAttachmentList = [];
              this.exampleAttachmentList = [];
              this.fileList = [];
              this.fileList1 = [];

            const {
              name, materialForm, requestDetail, necessarilyDescription,
              meteriaOrganization, remark, exampleAttachmentList, blankAttachmentList,
            } = res.data;
              if (exampleAttachmentList && exampleAttachmentList.length > 0) {
                  this.fileList = exampleAttachmentList.map(item => ({
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
                  }));
              }
              if (blankAttachmentList && blankAttachmentList.length > 0) {
                  this.fileList1 = blankAttachmentList.map(item => ({
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
                  }));
              }
            this.form.setFieldsValue({
              name,
              materialForm: materialForm.split(",").filter(item => !!item),
              requestDetail,
              necessarilyDescription,
              meteriaOrganization,
              remark,
                fileList: this.fileList,
                fileList1: this.fileList1,
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
              minimumParticleId: this.grainId,
                orgId: this.orgId,
              ...values,
              materialForm: values.materialForm.join(","),
            exampleAttachmentList: this.fileList.map(item => ({
                "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
                "fileName": item.response.data[0].fileName,//必填  文件名 string
                "suffix": item.response.data[0].suffixName,//必填 后缀名 string
                url: item.response.data[0].filePath.indexOf("uploadFile") > -1 ?
                    `${item.response.data[0].filePath}` :
                    `/uploadFile${item.response.data[0].filePath}`,
            })),
            blankAttachmentList: this.fileList1.map(item => ({
                "attachmentSize": item.response.data[0].fileSize,//必填  文件长度  int
                "fileName": item.response.data[0].fileName,//必填  文件名 string
                "suffix": item.response.data[0].suffixName,//必填 后缀名 string
                url: item.response.data[0].filePath.indexOf("uploadFile") > -1 ?
                    `${item.response.data[0].filePath}` :
                    `/uploadFile${item.response.data[0].filePath}`,
            })),
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
    onChange(checkedValue) {
      this.checkedList = checkedValue;
    },
    // 文件上传(示例表)
    handleRemoveUpload(res, file, fileList) {
      this.fileList = fileList;
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
      fileList = fileList.slice(-1);
      this.fileList = fileList;
    },
    // 文件上传(空白表)
    handleRemoveUpload1(res, file, fileList) {
      this.fileList1 = fileList;
    },
    handleUploadChange1(info) {
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
      fileList = fileList.slice(-1);
      this.fileList1 = fileList;
    },
  },
};
</script>

<style lang="less">

</style>
