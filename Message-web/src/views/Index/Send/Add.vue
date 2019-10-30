<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="320"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item
                            label='手机号码'
                            fieldDecoratorId="phoneNumber"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入手机号码!' },{ min: 11,max: 11, message: '请输入11位数的手机号!' }]}"
                    >
                        <a-input placeholder='请输入手机号码'/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='姓名'
                            fieldDecoratorId="name"
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入姓名!' }]}"
                    >
                        <a-input placeholder='请输入姓名'/>
                    </a-form-item>
                </a-col>
                <a-col  :span="24">
                    <a-form-item>
                        <a-button style="margin-right: 10px" type="primary" @click="addStaff">添加
                        </a-button>
                        <a-button style="margin-right: 10px" type="primary" @click="staffSelect">选择人员
                        </a-button>
                        <a-button type="primary" @click="staffSelectGroud">选择小组
                        </a-button>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                            label='接收号码'
                            fieldDecoratorId="groudList"
                            :fieldDecoratorOptions="{rules: [{ required: false, message: '请选择接收号码!'}]}">
                        <a-text-area placeholder='请选择接收号码' style="height: 150px;" disabled/>
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
                     @cancel="() => this.selectStaffVisible = false"
                     @ok="handleSelectStaffOk"
                     type="checkbox"
        ></staff-modal>
        <staff-modal-groud :membersVisible="selectStaffGroudVisible"
                           :propsSelectedRowKeys="selectedGroudRowKeys"
                           @cancel="() => this.selectStaffGroudVisible = false"
                           @ok="handleSelectStaffGroudOk"
                           type="checkbox"
        ></staff-modal-groud>
    </Drawer>
</template>

<script>
import { Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, DatePicker } from 'ant-design-vue';
import { autoDoFn } from '@/utils/util';
import StaffModal from '@/components/StaffModal/StaffModal';
import StaffModalGroud from '@/components/StaffModal/StaffModalGroud';
import moment from 'moment';

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
    ADatePicker: DatePicker,
    StaffModal,
    StaffModalGroud,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'staffList'],
  data() {
    return {
      addLoading: false,
      selectStaffVisible: false,
      selectedRowKeys: [],
      selectStaffGroudVisible: false,
      selectedRowName: [],
      selectedGroudRowKeys: [],
      selectedRowStaff: [],
      selectedRowNameArr: [],
      state: {
        value: '1',
      },
    };
  },
  computed: {
    title() {
      return this.modifyId ? '短信模板编辑' : '短信模板录入';
    },
  },
  watch: {
    addVisible() {
      if (this.staffList.length > 0) {
        this.selectedRowNameArr = this.staffList;
      }
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.$emit('successCallback', this.selectedRowNameArr);
    },
    // 添加
    addStaff() {
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            if (this.selectedRowStaff.indexOf(`${values.phoneNumber}/${values.name}\n`) < 0) {
              this.selectedRowStaff.push(`${values.phoneNumber}/${values.name}\n`);
            }
            this.selectedRowNameArr = this.selectedRowStaff.concat(this.selectedRowName);
            this.form.setFieldsValue({
              groudList: this.selectedRowNameArr,
              phoneNumber: '',
              name: '',
            });
          });
        }
      });
    },
    // 选择人员
    staffSelect() {
      this.selectStaffVisible = true;
    },
    handleSelectStaffOk(selectedRowKeys, selections) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRowName = [];
      selections.forEach((item) => {
        this.selectedRowName.push(`${item.phoneNumber}/${item.name}\n`);
      });
      this.selectedRowNameArr = this.selectedRowStaff.concat(this.selectedRowName);
      this.form.setFieldsValue({
        groudList: this.selectedRowNameArr,
      });
      this.selectStaffVisible = false;
    },
    // 选择小组
    staffSelectGroud() {
      this.selectStaffGroudVisible = true;
    },
    handleSelectStaffGroudOk(selectedRowKeys, selections) {
      this.selectedGroudRowKeys = selectedRowKeys;
      this.form.setFieldsValue({
        groudList: this.selectedRowKeys,
      });
      this.selectStaffVisible = false;
    },
  },
};
</script>

<style scoped>

</style>
