<template>
    <a-drawer :visible="addVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="审批意见">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view"
            :autoFormCreate="(form)=>{this.form = form}"
            @submit="handleSubmit">
                    <a-col :span="8">
                        <a-form-item label='所属部门'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label='被考核人'>
                            {{viewData.employeeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label='规则名称'>
                            {{viewData.ruleName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label='扣分分值'>
                            {{viewData.value || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label='扣分下限'>
                            {{viewData.minLimit || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label='扣分上限'>
                            {{viewData.maxLimit || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label='记录时间'>
                            {{viewData.createdDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label='申诉日期'>
                            {{viewData.complaintTime || 0}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='申诉原因'>
                            {{viewData.complaintDescription|| '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" style="margin-bottom: 24px">
                        <p class="des-label">附件</p>
                        <p class="des-content" v-if="viewData.attachmentList && viewData.attachmentList.length">
                            <a v-for="file in viewData.attachmentList" :href="file.url" target="_blank">{{file.fileName}}<br/></a>
                        </p>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item
                                label='审批状态'
                                fieldDecoratorId="state"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择审批状态!'}]}">
                            <a-select placeholder='请选择审批状态'  @change="getSelectValue" >
                                <a-select-option value='2'>审批通过</a-select-option>
                                <a-select-option value='3'>审批不通过</a-select-option>
                                <a-select-option value='1'>待审批</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='审批意见'>
                            <a-text-area placeholder='请输入申诉原因' style="height: 150px" v-model="suggesstion"/>
                        </a-form-item>
                    </a-col>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
            <a-button @click="handleClose">关闭</a-button>
        </div>
    </a-drawer>
</template>

<script>
import { Row, Col, Button, Form,Select,Input, Drawer, Spin } from 'ant-design-vue';
import { getDetail,approval,getApprovalDetail} from '@/remote/complain';
import { autoDoFn } from '@/utils/util';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
export default {
  name: 'DetailView',
  components: {
    ARow: Row,
    ACol: Col,
    AButton: Button,
    AForm: Form,
    AFormItem: Item,
    ASelect: Select,
    AInput: Input,
    ATextArea: TextArea,
    ASelectOption: Option,
    ADrawer: Drawer,
    ASpin: Spin,
  },
  props: ['addVisible', 'handleClose', 'modifyId'],
  data() {
    return {
      viewData: {},
      viewLoading: false,
      addLoading: false,
      state:1,
      suggesstion:'',
      minLimit :'',
      maxLimit:'',
    };
  },
  watch: {
    addVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.viewLoading = true;
          const res = await getApprovalDetail({ id: this.modifyId });
          if (res) {
            this.viewData = {
              ...res.data,
              minLimit:String(res.data.deductionType)==='1'?res.data.score:res.data.minLimit,
              maxLimit:String(res.data.deductionType)==='1'?res.data.score:res.data.maxLimit,
            };
            this.suggesstion = res.data.suggesstion === undefined || res.data.suggesstion === 'undefined' ? "" : res.data.suggesstion,
            this.state = res.data.state;
            this.form.setFieldsValue({
              state: String(res.data.state),
            });
          }
          this.viewLoading = false;
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
            const res = await approval({
                state:this.state,
                description:this.suggesstion,
                complaintId:this.modifyId
            });
            if (res.success) {
              this.$message.success('操作成功');
              this.$emit('successCallback');
            }
            this.addLoading = false;
          });
        }
      });
    },
    getSelectValue(value) {
      this.state = value;
    },
  },
};
</script>

<style lang="less">

</style>
