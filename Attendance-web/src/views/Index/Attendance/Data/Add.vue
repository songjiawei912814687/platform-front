<template>
    <Drawer v-model="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="320"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical"
                    :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label='人员'
                                fieldDecoratorId="employeesName"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择申请人!' }]}">
                            <a-input :disabled="true" placeholder='请选择申请人'
                                     style="width: 200px;margin-right: 15px"></a-input>
                        </a-form-item>
                        <a-button style="position: absolute; right: 12px; top: 28px;" type="primary"
                                  @click="staffSelect">选择
                        </a-button>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='所属机构'
                                fieldDecoratorId="organizationName"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择机构!' }]}"
                        >
                            <a-input :disabled="true"></a-input>
                        </a-form-item>
                    </a-col>
                    <!--<a-col :span="24">
                        <a-form-item
                                label='考勤机名称'
                                fieldDecoratorId="attendanceDeviceName"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入考勤机名称!' }]}"
                        >
                            <a-input placeholder='请输入考勤机名称'></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='验证方式'
                                fieldDecoratorId="authentication"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择验证方式!' }]}"
                        >
                            <a-select>
                                <a-select-option value="0">系统验证</a-select-option>
                                <a-select-option value="1">考勤机验证</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>-->
                    <a-col :span="24">
                        <a-form-item
                                label='打卡时间'
                                fieldDecoratorId="punchTime"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择打卡时间' }]}"
                        >
                            <a-date-picker style="width: 100%" showTime format="YYYY-MM-DD HH:mm:ss"></a-date-picker>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='备注(补录原因)'
                                fieldDecoratorId="description"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入补录原因!' }]}"
                        >
                            <a-text-area placeholder="请输入补录原因" style="height: 150px"></a-text-area>
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
                     @cancel="handleUpdateData('selectStaffVisible', false)"
                     @ok="handleSelectStaffOk"
                     type="radio"
        ></staff-modal>
    </Drawer>
</template>

<script>
  import {Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, DatePicker} from 'ant-design-vue';
  import {formPost, getDetail} from '@/remote/attendanceData';
  import {autoDoFn} from '@/utils/util';
  import moment from 'moment';
  import StaffModal from '@/components/StaffModal/StaffModal';

  const {Item} = Form;
  const {Option} = Select;
  const {TextArea} = Input;

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
      ADatePicker: DatePicker,
      StaffModal,
    },
    props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData', 'staffList'],
    created() {
    },
    data() {
      return {
        addLoading: false,
        selectedRowKeys: [],
        selection: {},
        selectStaffVisible: false,
      };
    },
    computed: {
      title() {
        return '考勤数据补录';
      },
    },
    watch: {
      addVisible() {
        if (this.modifyId) {
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await getDetail({id: this.modifyId});
            if (res) {
              const {
                name, punchTime, organizationName,
                employeeName, authentication, attendanceDeviceName,
                description,
              } = res.data;
              this.form.setFieldsValue({
                name,
                punchTime,
                organizationName,
                employeeName,
                authentication: String(authentication),
                attendanceDeviceName,
                description,
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
                ...values,
                punchTime: values.punchTime.format("YYYY-MM-DD HH:mm:ss"),
                organizationId: this.selection.organizationId,
                employeeId: this.selection.id,
                jobsId: this.selection.jobsId,
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
        this.selection = selections[0];
        this.form.setFieldsValue({
          employeesName: selections[0].name,
          organizationName: selections[0].organizationName,
        });
        this.handleUpdateData('selectStaffVisible', false);
      },
      staffSelect() {
        const { id } = this.selection;
        this.selectedRowKeys = id ? [String(id)] : [];
        this.handleUpdateData('selectStaffVisible', true);
      },
    },
  };
</script>

<style scoped>

</style>
