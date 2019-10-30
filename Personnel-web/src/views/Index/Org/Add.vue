<template>
    <Drawer v-model="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="650"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label='组织机构名称'
                                fieldDecoratorId="name"

                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入组织机构名称!' },{ max: 105, message: '最多105个字符!' }]}"
                        >
                            <a-input :disabled="this.linkedId !== undefined" placeholder='请输入组织机构名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='组织机构编号'
                                fieldDecoratorId="organizationNo"
                        >
                            <a-input placeholder='请输入组织机构编号' disabled/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='组织机构编码'
                                fieldDecoratorId="organizationCode"
                        >
                            <a-input placeholder='请输入组织机构编码' />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='上级组织机构'
                                fieldDecoratorId="parentId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择上级组织机构!' }]}"
                        >
                            <a-tree-select
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="orgTreeData"
                                    showSearch
                                    treeNodeFilterProp="title"
                                    placeholder='请选择上级组织机构'
                                    treeDefaultExpandAll
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='部门员工工号首位数'
                                fieldDecoratorId="firstLetter"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择部门员工工号首位数!' }]}"
                        >
                            <a-select placeholder='请选择部门员工工号首位数'>
                                <a-select-option value='0'>0</a-select-option>
                                <a-select-option value='1'>1</a-select-option>
                                <a-select-option value='2'>2</a-select-option>
                                <a-select-option value='3'>3</a-select-option>
                                <a-select-option value='4'>4</a-select-option>
                                <a-select-option value='5'>5</a-select-option>
                                <a-select-option value='6'>6</a-select-option>
                                <a-select-option value='7'>7</a-select-option>
                                <a-select-option value='8'>8</a-select-option>
                                <a-select-option value='9'>9</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="12">-->
                        <!--<a-form-item-->
                                <!--label='机构类型'-->
                                <!--fieldDecoratorId="type"-->
                                <!--:fieldDecoratorOptions="{rules: [{ required: true, message: '请选择机构类型!' }]}"-->
                        <!--&gt;-->
                            <!--<a-select placeholder='请选择机构类型'>-->
                                <!--<a-select-option value='0'>机构</a-select-option>-->
                                <!--<a-select-option value='1'>部门</a-select-option>-->
                            <!--</a-select>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                    <a-col :span="12">
                        <a-form-item
                                label='是否考核'
                                fieldDecoratorId="assessmentState"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否考核!' }]}"
                        >
                            <a-select placeholder='请选择是否考核'>
                                <a-select-option value='0'>是</a-select-option>
                                <a-select-option value='1'>否</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='是否配置审批流'
                                fieldDecoratorId="configApprove"
                                :fieldDecoratorOptions="{rules: [{message: '请选择是否配置审批流!' }]}"
                        >
                            <a-select placeholder='是否配置审批流'>
                                <a-select-option value='0'>是</a-select-option>
                                <a-select-option value='1'>否</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='配置审批流规则'
                                fieldDecoratorId="approveRule"
                                :fieldDecoratorOptions="{rules: [{ message: '请选择配置审批流规则!' }]}"
                        >
                            <a-select placeholder='请选择配置审批流规则'>
                                <a-select-option value='0.5'>一天之内</a-select-option>
                                <a-select-option value='1.0'>一天</a-select-option>
                                <a-select-option value='1.5'>一天之外，两天之内</a-select-option>
                                <a-select-option value='2.0'>两天</a-select-option>
                                <a-select-option value='2.5'>两天之外，三天之内</a-select-option>
                                <a-select-option value='3.0'>三天</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='考勤规则'
                                fieldDecoratorId="attendanceRuleConfigId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择考勤规则!' }]}"
                        >
                            <a-select placeholder='请选择考勤规则'
                                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                            >
                                <a-select-option v-for="item in ruleList"
                                                 :getPopupContainer="triggerNode => triggerNode.parentNode"
                                                 :value='String(item.id)' :key="item.id">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='手机号'
                                fieldDecoratorId="phoneNumber"
                                :fieldDecoratorOptions="{
                                rules: [
                                { pattern: /^1\d{10}$/, message: '请输入正确手机号码!' },
                                ]}"
                        >
                            <a-input placeholder='请输入手机号'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='办公电话'
                                fieldDecoratorId="officePhone"
                        >
                            <a-input placeholder='请输入办公电话'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='传真'
                                fieldDecoratorId="fax"
                        >
                            <a-input placeholder='请输入传真'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='排序'
                                fieldDecoratorId="displayOrder"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入排序' }]}"
                        >
                            <a-input-number placeholder='请输入排序' style="width: 100%;" :min="1" :max="999"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='分管领导'
                                fieldDecoratorId="leadership"
                        >
                            <a-input :disabled="true" placeholder='请选择分管领导'
                                     style="width: 200px;margin-right: 15px"></a-input>
                        </a-form-item>
                        <a-button style="position: absolute; right: 12px; top: 28px;" type="primary" @click="leadershipSelect">选择</a-button>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='部门管理员'
                                fieldDecoratorId="departmentalManager"
                        >
                            <a-input :disabled="true" placeholder='请选择部门管理员'
                                     style="width: 200px;margin-right: 15px"></a-input>
                        </a-form-item>
                        <a-button style="position: absolute; right: 12px; top: 28px;" type="primary" @click="departmentalManagerSelect">选择</a-button>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='权力事项组织编码'
                                fieldDecoratorId="ouorgcode"
                        >
                            <a-input placeholder='请输入权力事项组织编码'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='地址'
                                fieldDecoratorId="address"
                        >
                            <a-text-area placeholder='请输入地址' style="height: 150px"/>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
        </div>
        <staff-modal :membersVisible="selectStaffVisible"
                     :propsSelectedRowKeys="selectedRowKeys"
                     :organTree="orgTreeData"
                     @cancel="handleUpdateData('selectStaffVisible', false)"
                     @ok="handleSelectStaffOk"
                     type="radio"
        ></staff-modal>
    </Drawer>
</template>

<script>
import { Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, InputNumber } from 'ant-design-vue';
import { formPost, getDetail } from '@/remote/org';
import { autoDoFn } from '@/utils/util';
import StaffModal from '@/components/StaffModal/StaffModal';
import Index from './index';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
  name: 'Add',
  components: {
    Index,
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
    AInputNumber: InputNumber,
    StaffModal,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'staffList','ruleList'],
  data() {
    return {
      addLoading: false,
      selectStaffVisible: false,
      staffType: '',
      selection: {},
      selectedRowKeys: [],
      resData: {},
	  linkedId:'',
    };
  },
  computed: {
    title() {
      return this.modifyId ? '组织编辑' : '组织录入';
    },
  },
  watch: {
    addVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            const {
              address, assessmentState, departmentalManagerName,
              fax, leadershipName, name, officePhone, organizationNo, parentId,
              phoneNumber, type, displayOrder,organizationCode,firstLetter, linkedId,attendanceRuleConfigId,
              configApprove,approveRule,ouorgcode
            } = res.data;
            this.resData = res.data;
			this.linkedId = linkedId;
            this.form.setFieldsValue({
              address,
              fax,
              name,
              ouorgcode,
              leadership: leadershipName,
              departmentalManager: departmentalManagerName,
              displayOrder,
              officePhone,
              organizationCode:organizationCode !== undefined ? String(organizationCode) : '',
              organizationNo: organizationNo !== undefined ? String(organizationNo) : '',
              phoneNumber,
              parentId: parentId !== undefined ? String(parentId) : '',
              assessmentState: assessmentState !== undefined ? String(assessmentState) : '',
              firstLetter: firstLetter !== undefined ? String(firstLetter) : '',
              type: type !== undefined ? String(type) : '',
              attendanceRuleConfigId:attendanceRuleConfigId !==undefined? String(attendanceRuleConfigId):'',
              configApprove:configApprove===undefined?'':String(configApprove),
              approveRule:approveRule===undefined?'':String(approveRule),
            });
          }
          this.addLoading = false;
        });
      }else {
          this.linkedId = undefined
        this.resData = {};
      }
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (String(this.modifyId) === String(values.parentId)) {
            this.$message.error('上级组织机构不可以是当前组织机构');
            return false;
          }
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await formPost(this.modifyId, {
              ...values,
              parentId: values.parentId,
              leadership: this.resData.leadership || '',
              departmentalManager: this.resData.departmentalManager || '',
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
    handleUpdateData(name, value) {
      this[name] = value;
    },
    handleSelectStaffOk(selectedRowKeys, selections) {
      this.resData[this.staffType] = selections[0].id;
      this.form.setFieldsValue({
        [this.staffType]: selections[0].name,
      });
      this.handleUpdateData('selectStaffVisible', false);
    },
    leadershipSelect() {
      const { leadership } = this.resData;
      this.selectedRowKeys = leadership ? [String(leadership)] : [];
      this.handleUpdateData('selectStaffVisible', true);
      this.staffType = 'leadership';
    },
    departmentalManagerSelect() {
      const { departmentalManager } = this.resData;
      this.selectedRowKeys = departmentalManager ? [String(departmentalManager)] : [];
      this.handleUpdateData('selectStaffVisible', true);
      this.staffType = 'departmentalManager';
    },
  },
};
</script>

<style scoped>

</style>
