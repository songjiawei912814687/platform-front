<template>
    <a-modal
            title="审批"
            :visible="approvalVisible"
            @cancel="handleClose"
            :loading="addLoading"
            @ok="handleOk"
            :width="760"
    >
        <a-form v-if="approvalVisible" @submit="handleSubmit" layout="vertical"
                :autoFormCreate="(form)=>{this.form = form}"
                class="staff-add-form">
            <a-row :gutter="24">

                <a-col :span="24">
                    <a-form-item
                            label='审批建议'
                            fieldDecoratorId="descrition"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入审批建议!'},{max:255,message:'最多105个字符！'}]}">
                        <a-text-area placeholder='请输入审批建议' style="height: 150px"/>
                    </a-form-item>
                </a-col>

            </a-row>
        </a-form>
        <template slot="footer">
            <a-button key="back" @click="handleClose">取消</a-button>
            <a-button key="ok" type="primary" @click="audit">通过</a-button>
            <a-button key="ok" type="primary" @click="notAudit">不通过</a-button>
        </template>
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
    Drawer,
    Spin,
    TreeSelect,
    Upload,
    Icon,
    DatePicker,
    Modal
  } from 'ant-design-vue';
  import { autoDoFn } from '@/utils/util';
  import { getAudit } from '@/remote/audit';

  const { Item } = Form;
  const { Option } = Select;
  const { TextArea } = Input;
  export default {
    name: 'approval',
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
      AModal: Modal
    },
    data() {
      return {
        imageUrl: '',
        result: '',
        addLoading: false,
      };
    },
    props: ['approvalVisible', 'handleClose', 'modifyId'],
    computed: {
      title() {
        return this.modifyId ? '审批' : '审批';
      },
    },
    methods: {
      audit(e) {
        debugger;
        this.result = '1';
        this.handleSubmit(e);
      },
      notAudit(e) {
        this.result = '3';
        this.handleSubmit(e);
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            autoDoFn(async () => {
              this.addLoading = true;
              const res = await getAudit({
                result: this.result,
                approvalAssociationId: this.modifyId,
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

<style scoped>

</style>
