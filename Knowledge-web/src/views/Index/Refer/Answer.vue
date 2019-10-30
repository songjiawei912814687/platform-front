<template>
    <Drawer :value="answerVisible"
              @on-close="handleClose"
              :mask-closable="false"
              :width="1000"
              :title="咨询问题回答">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">

                    <a-col :span="24">
                        <a-form-item
                                label='问题类型'
                                fieldDecoratorId="type"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否公开!'}]}">
                            <a-select placeholder='请选择问题类型'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode" disabled>
                                <a-select-option v-for="item in QuestionType"
                                                 :getPopupContainer="triggerNode => triggerNode.parentNode"
                                                 :value='String(item.id)' :key="item.id" >
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='组织机构'
                                fieldDecoratorId="organizationId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择机构!' }]}"

                        >
                            <a-tree-select
                                    style="width: 100%;"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="organTree"
                                    placeholder='请选择所属机构'
                                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                                    treeDefaultExpandAll
                                    disabled
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='问题'
                                fieldDecoratorId="title"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入问题的内容!'}]}">
                            <a-text-area style="height: 150px" disabled></a-text-area>
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item
                                label='答案'
                                fieldDecoratorId="description"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入问题的答案!'}]}">
                            <a-text-area style="height: 150px"></a-text-area>
                        </a-form-item>
                    </a-col>


<!--                    <a-col :span="24">-->
<!--                        <a-form-item-->
<!--                                label='附件'-->
<!--                                fieldDecoratorId="attachmentList"-->
<!--                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请上传附件!'}]}">-->
<!--                            <a-upload name="file"-->
<!--                                      :multiple="true"-->
<!--                                      :showUploadList="true"-->
<!--                                      action="/upload"-->
<!--                                      :fileList="fileList"-->
<!--                                      :data="{resourceType:14}"-->
<!--                                      :beforeUpload="beforeUpload"-->
<!--                                      @change="handleChange"-->
<!--                            >-->
<!--                                <a-button>选择文件</a-button>-->
<!--                            </a-upload>-->
<!--                        </a-form-item>-->
<!--                    </a-col>-->


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
import { autoDoFn } from '@/utils/util';
import { answerQuestion, getDetail } from '@/remote/refer';

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
  props: ['answerVisible', 'handleClose', 'modifyId', 'QuestionType', 'organTree'],
  data() {
    return {
      addLoading: false,
    };
  },
  computed: {
    title() {
      return this.modifyId ? '咨询问题编辑' : '咨询问题录入';
    },
  },
  watch: {
      answerVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            const {
              title, description, isOpen, isTop,organizationId, type
            } = res.data;
            this.form.setFieldsValue({
              title, description, isOpen, isTop,
                organizationId: organizationId !== undefined ? String(organizationId) : '',
                type: type !== undefined ? String(type) : '',
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
            const {
              title, description, isOpen, isTop,type, organizationId
            } = values;
            const res = await answerQuestion(this.modifyId, {
              title, description, isOpen: parseInt(isOpen), isTop: parseInt(isTop),type,organizationId
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
